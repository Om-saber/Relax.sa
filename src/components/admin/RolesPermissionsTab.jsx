import React, { useState, useEffect } from 'react';
import {
  FiShield, FiUsers, FiCheck, FiSave, FiRefreshCw, FiLock,
} from 'react-icons/fi';
import { adminApi } from '../../api/adminApi';

const RolesPermissionsTab = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [draftPermissions, setDraftPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [rolesData, permsData] = await Promise.all([
        adminApi.getRoles(),
        adminApi.getPermissions(),
      ]);
      setRoles(rolesData);
      setPermissions(permsData);
      if (rolesData.length > 0) {
        const first = selectedRole || rolesData[0];
        setSelectedRole(first);
        setDraftPermissions([...first.permissions]);
      }
    } catch (err) {
      setError(err.message || 'فشل تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setDraftPermissions([...role.permissions]);
    setSuccessMsg('');
  };

  const togglePermission = (permKey) => {
    if (selectedRole?.key === 'super-admin') return;
    setDraftPermissions((prev) =>
      prev.includes(permKey)
        ? prev.filter((k) => k !== permKey)
        : [...prev, permKey]
    );
  };

  const isDirty = () => {
    if (!selectedRole) return false;
    const original = new Set(selectedRole.permissions);
    const draft = new Set(draftPermissions);
    if (original.size !== draft.size) return true;
    for (const k of draft) if (!original.has(k)) return true;
    return false;
  };

  const handleSave = async () => {
    if (!selectedRole || !isDirty()) return;
    setSaving(true);
    setError('');
    setSuccessMsg('');
    try {
      const updated = await adminApi.updateRolePermissions(selectedRole.id, draftPermissions);
      setRoles((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      setSelectedRole(updated);
      setDraftPermissions([...updated.permissions]);
      setSuccessMsg('✅ تم حفظ الصلاحيات بنجاح');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message || 'فشل حفظ الصلاحيات');
    } finally {
      setSaving(false);
    }
  };

  const isSuperAdmin = selectedRole?.key === 'super-admin';
  const dirty = isDirty();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg">
            <FiShield className="text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#2B151F]">الأدوار والصلاحيات</h2>
            <p className="text-xs text-[#8E717D] mt-0.5">
              {roles.length} دور · {permissions.length} صلاحية
            </p>
          </div>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-white border border-rose-200 text-[#CF3A69] text-xs font-bold flex items-center gap-2 hover:bg-rose-50 disabled:opacity-50"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} /> تحديث
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3 rounded-xl mb-4">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3 rounded-xl mb-4">
          {successMsg}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-[#8E717D]">جاري التحميل...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-4 py-3 border-b border-rose-100">
                <h3 className="text-xs font-black text-[#8E717D]">الأدوار ({roles.length})</h3>
              </div>
              <div className="divide-y divide-rose-50">
                {roles.map((role) => {
                  const isActive = selectedRole?.id === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => handleSelectRole(role)}
                      className={`w-full text-start px-4 py-3 hover:bg-rose-50/40 transition-colors ${
                        isActive ? 'bg-rose-50 border-e-4 border-e-[#CF3A69]' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-black ${isActive ? 'text-[#CF3A69]' : 'text-[#2B151F]'}`}>
                            {role.nameAr}
                          </p>
                          <p className="text-[10px] text-[#8E717D] font-mono mt-0.5">{role.key}</p>
                          <p className="text-[10px] text-[#8E717D] mt-1 line-clamp-1">
                            {role.permissions.length} صلاحية
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <FiUsers className="text-[10px] text-[#8E717D]" />
                          <span className="text-[10px] font-bold text-[#8E717D]">{role.usersCount}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            {selectedRole && (
              <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-5 py-4 border-b border-rose-100">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-black text-[#2B151F]">{selectedRole.nameAr}</h3>
                      <p className="text-[11px] text-[#8E717D] mt-0.5">{selectedRole.description}</p>
                    </div>
                    {isSuperAdmin && (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200">
                        <FiLock className="text-amber-600 text-xs" />
                        <span className="text-[10px] font-black text-amber-700">مقفول</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-black text-[#2B151F]">
                      الصلاحيات ({draftPermissions.length}/{permissions.length})
                    </p>
                    {dirty && !isSuperAdmin && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                        ● تغييرات غير محفوظة
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {permissions.map((perm) => {
                      const checked = draftPermissions.includes(perm.key);
                      const disabled = isSuperAdmin;
                      return (
                        <label
                          key={perm.id}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                            disabled
                              ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-70'
                              : checked
                              ? 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-white border-rose-100 hover:bg-rose-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={disabled}
                            onChange={() => togglePermission(perm.key)}
                            className="hidden"
                          />
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border-2 ${
                              checked
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'border-gray-300 bg-white'
                            }`}
                          >
                            {checked && <FiCheck className="text-xs" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-[#2B151F]">{perm.label}</p>
                            <p className="text-[10px] text-[#8E717D] font-mono">{perm.key}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {!isSuperAdmin && (
                  <div className="bg-gray-50 border-t border-rose-100 px-5 py-4 flex items-center justify-between gap-3">
                    <p className="text-[11px] text-[#8E717D]">
                      {dirty ? 'اضغطي "حفظ" لتطبيق التغييرات' : 'لا توجد تغييرات'}
                    </p>
                    <button
                      onClick={handleSave}
                      disabled={!dirty || saving}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#CF3A69] to-[#E65A84] text-white text-xs font-black shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <FiSave /> {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesPermissionsTab;
