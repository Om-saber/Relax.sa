import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../api/adminApi';

const BADGE_COLORS = {
  'super-admin': 'bg-rose-100 text-rose-800 border-rose-300',
  'management': 'bg-purple-100 text-purple-800 border-purple-300',
  'customer-service': 'bg-blue-100 text-blue-800 border-blue-300',
  'accountant': 'bg-emerald-100 text-emerald-800 border-emerald-300',
  'supervisor': 'bg-amber-100 text-amber-800 border-amber-300',
  'branch-manager': 'bg-cyan-100 text-cyan-800 border-cyan-300',
};

/**
 * ياخد /admin/roles و /admin/permissions
 * ويحوّلهم لشكل التاب القديم (id = key, permissions = object, badgeColor).
 */
const ALL_PERMISSION_KEYS = [
  'viewBookings', 'editBookings', 'cancelBookings',
  'manageStaff', 'manageClients', 'manageServices',
  'manageCities', 'viewReports', 'manageRoles',
  'manageComplaints', 'manageFinance', 'manageContent',
];

function adaptRole(raw) {
  const active = new Set(raw.permissions || []);
  return {
    id: raw.key,
    _apiId: raw.id,
    key: raw.key,
    name: raw.nameAr,
    nameEn: raw.nameEn,
    description: raw.description,
    isSystem: !!raw.isSystem,
    badgeColor: BADGE_COLORS[raw.key] || 'bg-gray-100 text-gray-800 border-gray-300',
    usersCount: raw.usersCount || 0,
    permissions: Object.fromEntries(
      ALL_PERMISSION_KEYS.map((k) => [k, active.has(k)]),
    ),
  };
}

export function useAdminRoles() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [rawRoles, rawPerms] = await Promise.all([
        adminApi.getRoles(),
        adminApi.getPermissions(),
      ]);
      setRoles((rawRoles || []).map(adaptRole));
      setPermissions(rawPerms || []);
    } catch (err) {
      console.error('[useAdminRoles] failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const togglePermission = async (roleKey, permissionKey) => {
    const role = roles.find((r) => r.id === roleKey);
    if (!role) return { success: false, error: 'الدور غير موجود' };
    if (role.key === 'super-admin') {
      return { success: false, error: 'مدير النظام لديه صلاحيات كاملة وغير قابلة للتعديل' };
    }

    // flip boolean in local state
    const nextValue = !role.permissions[permissionKey];

    const updatedPermissionsObj = {
      ...role.permissions,
      [permissionKey]: nextValue,
    };

    // Optimistic update
    setRoles((prev) =>
      prev.map((r) =>
        r.id === roleKey ? { ...r, permissions: updatedPermissionsObj } : r,
      ),
    );

    // Build the active keys array to send to API
    const newPerms = Object.entries(updatedPermissionsObj)
      .filter(([, v]) => v)
      .map(([k]) => k);

    try {
      await adminApi.updateRolePermissions(role._apiId, newPerms);
      return { success: true };
    } catch (err) {
      console.error('[useAdminRoles.togglePermission] failed:', err);
      // Revert
      setRoles((prev) => prev.map((r) => (r.id === roleKey ? role : r)));
      return { success: false, error: err.message };
    }
  };

  return {
    roles,
    permissions,
    loading,
    error,
    refetch: fetchAll,
    togglePermission,
  };
}
