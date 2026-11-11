import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../api/adminApi';

/**
 * يجيب الموظفات (STAFF) من /admin/users
 * ويحوّل كل واحدة لشكل موحّد للاستخدام في الـ reassign modal:
 * { staffProfileId, userId, name, phone, email, status, roleTitle }
 */
export function useAdminStaff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const users = await adminApi.getUsers();
      const staffOnly = (Array.isArray(users) ? users : [])
        .filter((u) => u.role === 'STAFF' && u.staffProfile?.id)
        .map((u) => ({
          staffProfileId: u.staffProfile.id,
          userId: u.id,
          name: u.name,
          phone: u.phone,
          email: u.email,
          status: u.staffProfile.status,
          roleTitle: u.staffProfile.roleTitle,
          staffCode: u.staffProfile.staffCode,
        }));
      setStaff(staffOnly);
    } catch (err) {
      console.error('[useAdminStaff] failed:', err);
      setError(err.message);
      setStaff([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  return { staff, loading, error, refetch: fetchStaff };
}
