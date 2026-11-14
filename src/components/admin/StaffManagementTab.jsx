import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';
import {
  FiUsers, FiUserPlus, FiEdit2, FiTrash2, FiKey,
  FiSearch, FiX, FiRefreshCw,
} from 'react-icons/fi';
import { adminApi } from '../../api/adminApi';

const StaffManagementTab = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');

  const [modal, setModal] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', roleId: '' });
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [usersData, rolesData] = await Promise.all([
        adminApi.getUsers({ search: search || undefined, roleKey: filterRole || undefined }),
        adminApi.getRoles(),
      ]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (err) {
      setError(err.message || 'فشل تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filterRole]);

  const openCreate = () => {
    setModal('create');
    setSelectedUser(null);
    setFormData({ name: '', email: '', phone: '', password: '', roleId: roles[0]?.id || '' });
    setModalError('');
    setGeneratedPassword('');
  };

  const openEdit = (user) => {
    setModal('edit');
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email || '',
      phone: user.phone || '',
      password: '',
      roleId: user.roleId || '',
    });
    setModalError('');
  };

  const closeModal = () => {
    setModal(null);
    setSelectedUser(null);
    setModalError('');
    setGeneratedPassword('');
  };

  const handleSave = async () => {
    setSaving(true);
    setModalError('');
    try {
      if (modal === 'create') {
        await adminApi.createUser(formData);
      } else if (modal === 'edit') {
        const patch = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          roleId: formData.roleId,
        };
        await adminApi.updateUser(selectedUser.id, patch);
      }
      await loadData();
      closeModal();
    } catch (err) {
      setModalError(err.message || 'فشل الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user) => {
    if (!(await Swal.fire({ text: `هل أنتِ متأكدة من حذف/تعطيل "${user.name}"؟`, icon: 'warning', showCancelButton: true, confirmButtonText: 'نعم، متأكد', cancelButtonText: 'إلغاء', confirmButtonColor: '#CF3A69', cancelButtonColor: '#8E717D' })).isConfirmed) return;
    try {
      await adminApi.deleteUser(user.id);
      await loadData();
    } catch (err) {
      alert(err.message || 'فشل الحذف');
    }
  };

  const handleResetPassword = async (user) => {
    setModal('reset');
    setSelectedUser(user);
    setModalError('');
    setGeneratedPassword('');
    try {
      const result = await adminApi.resetPassword(user.id);
      setGeneratedPassword(result.password);
    } catch (err) {
      setModalError(err.message || 'فشل إعادة تعيين كلمة المرور');
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.includes(q)
    );
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center shadow-lg">
            <FiUsers className="text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#2B151F]">إدارة الموظفات والمديرين</h2>
            <p className="text-xs text-[#8E717D] mt-0.5">{filteredUsers.length} مستخدمة في النظام</p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#CF3A69] to-[#E65A84] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <FiUserPlus /> إضافة موظفة
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-rose-100 shadow-sm mb-6 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <FiSearch className="absolute start-3 top-3 text-[#CF3A69] text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالاسم / البريد / الجوال..."
            className="w-full ps-9 pe-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-xs font-bold focus:outline-none focus:border-[#CF3A69]"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-xs font-bold focus:outline-none focus:border-[#CF3A69]"
        >
          <option value="">كل الأدوار</option>
          {roles.map((r) => (
            <option key={r.id} value={r.key}>{r.nameAr}</option>
          ))}
        </select>
        <button
          onClick={loadData}
          className="px-3 py-2.5 rounded-xl border border-rose-200 text-[#CF3A69] hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5"
        >
          <FiRefreshCw /> تحديث
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-[#8E717D]">جاري التحميل...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-20 text-[#8E717D]">لا توجد نتائج</div>
      ) : (
        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100">
              <tr>
                <th className="text-start px-4 py-3 text-xs font-black text-[#8E717D]">الاسم</th>
                <th className="text-start px-4 py-3 text-xs font-black text-[#8E717D]">البريد</th>
                <th className="text-start px-4 py-3 text-xs font-black text-[#8E717D]">الجوال</th>
                <th className="text-start px-4 py-3 text-xs font-black text-[#8E717D]">الدور</th>
                <th className="text-start px-4 py-3 text-xs font-black text-[#8E717D]">الحالة</th>
                <th className="text-start px-4 py-3 text-xs font-black text-[#8E717D]">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-rose-50 hover:bg-rose-50/30">
                  <td className="px-4 py-3 text-sm font-bold text-[#2B151F]">{user.name}</td>
                  <td className="px-4 py-3 text-xs text-[#5A3F4B]" dir="ltr">{user.email || '-'}</td>
                  <td className="px-4 py-3 text-xs text-[#5A3F4B]" dir="ltr">{user.phone || '-'}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-[10px] font-black border border-purple-200">
                      {user.roleRef?.nameAr || user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black ${
                      user.isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-gray-100 text-gray-600 border border-gray-300'
                    }`}>
                      {user.isActive ? 'نشطة' : 'معطلة'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(user)} title="تعديل" className="p-2 rounded-lg text-blue-600 hover:bg-blue-50">
                        <FiEdit2 className="text-sm" />
                      </button>
                      <button onClick={() => handleResetPassword(user)} title="إعادة تعيين كلمة المرور" className="p-2 rounded-lg text-amber-600 hover:bg-amber-50">
                        <FiKey className="text-sm" />
                      </button>
                      <button onClick={() => handleDelete(user)} title="حذف" className="p-2 rounded-lg text-rose-600 hover:bg-rose-50">
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(modal === 'create' || modal === 'edit') && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-[#2B151F]">
                {modal === 'create' ? 'إضافة موظفة جديدة' : 'تعديل بيانات الموظفة'}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-rose-50 rounded-lg text-[#8E717D]">
                <FiX />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-black text-[#2B151F] block mb-1">الاسم *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-sm font-bold focus:outline-none focus:border-[#CF3A69]" />
              </div>
              <div>
                <label className="text-xs font-black text-[#2B151F] block mb-1">البريد الإلكتروني *</label>
                <input type="email" dir="ltr" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-sm font-bold focus:outline-none focus:border-[#CF3A69]" />
              </div>
              <div>
                <label className="text-xs font-black text-[#2B151F] block mb-1">رقم الجوال</label>
                <input type="tel" dir="ltr" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="05XXXXXXXX"
                  className="w-full px-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-sm font-bold focus:outline-none focus:border-[#CF3A69]" />
              </div>
              <div>
                <label className="text-xs font-black text-[#2B151F] block mb-1">الدور *</label>
                <select value={formData.roleId} onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-sm font-bold focus:outline-none focus:border-[#CF3A69]">
                  <option value="">اختر دور</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>{r.nameAr} ({r.key})</option>
                  ))}
                </select>
              </div>

              {modal === 'create' && (
                <div>
                  <label className="text-xs font-black text-[#2B151F] block mb-1">كلمة المرور *</label>
                  <div className="flex gap-2">
                    <input type="text" dir="ltr" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="flex-1 px-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-sm font-bold focus:outline-none focus:border-[#CF3A69]"
                      placeholder="8 أحرف على الأقل" />
                    <button type="button"
                      onClick={() => {
                        const pwd = Math.random().toString(36).slice(-10);
                        setFormData({ ...formData, password: pwd });
                      }}
                      className="px-3 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold">
                      🎲
                    </button>
                  </div>
                </div>
              )}

              {modalError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-2.5 rounded-xl">
                  {modalError}
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              <button onClick={closeModal} className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-bold">
                إلغاء
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#CF3A69] to-[#E65A84] text-white text-sm font-black shadow-md hover:shadow-lg disabled:opacity-50">
                {saving ? 'جاري الحفظ...' : modal === 'create' ? 'إنشاء' : 'حفظ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === 'reset' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
                <FiKey className="text-2xl" />
              </div>
              <h3 className="text-lg font-black text-[#2B151F]">إعادة تعيين كلمة المرور</h3>
              <p className="text-xs text-[#8E717D] mt-1">{selectedUser?.name}</p>
            </div>

            {generatedPassword ? (
              <>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
                  <p className="text-xs font-bold text-emerald-800 mb-2">كلمة المرور الجديدة:</p>
                  <p className="text-lg font-black text-emerald-900 text-center font-mono" dir="ltr">
                    {generatedPassword}
                  </p>
                </div>
                <p className="text-xs text-[#8E717D] text-center mb-4">
                  ⚠️ احفظي كلمة المرور دي — مش هتظهر تاني
                </p>
              </>
            ) : modalError ? (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3 rounded-xl mb-4">
                {modalError}
              </div>
            ) : (
              <p className="text-center text-sm text-[#8E717D] py-4">جاري المعالجة...</p>
            )}

            <button onClick={closeModal} className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-bold">
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagementTab;
