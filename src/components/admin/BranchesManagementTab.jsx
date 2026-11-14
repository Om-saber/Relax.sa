import Swal from 'sweetalert2';
import React, { useState } from 'react';
import {
  FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff,
  FiX, FiRefreshCw, FiMapPin, FiUser, FiPhone, FiHome,
} from 'react-icons/fi';
import { useAdminBranches } from '../../hooks/useAdminBranches';
import { useAdminCities } from '../../hooks/useAdminCities';

const EMPTY_FORM = {
  cityId: '',
  nameAr: '',
  nameEn: '',
  managerName: '',
  phone: '',
  isActive: true,
};

const BranchesManagementTab = () => {
  const [filterCity, setFilterCity] = useState('');
  const { cities: apiCities } = useAdminCities();
  const {
    branches, loading, error, refetch,
    createBranch, updateBranch, toggleBranch, deleteBranch,
  } = useAdminBranches(filterCity || undefined);

  const [modal, setModal] = useState(null); // 'create' | 'edit'
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  const openCreate = () => {
    setModal('create');
    setEditing(null);
    setForm({ ...EMPTY_FORM, cityId: apiCities?.[0]?.id || '' });
    setModalError('');
  };

  const openEdit = (branch) => {
    setModal('edit');
    setEditing(branch);
    setForm({
      cityId: branch.cityId || branch.city?.id || '',
      nameAr: branch.nameAr || '',
      nameEn: branch.nameEn || '',
      managerName: branch.managerName || '',
      phone: branch.phone || '',
      isActive: branch.isActive !== false,
    });
    setModalError('');
  };

  const closeModal = () => {
    setModal(null);
    setEditing(null);
    setModalError('');
  };

  const handleSave = async () => {
    setSaving(true);
    setModalError('');

    const payload = {
      cityId: form.cityId,
      nameAr: form.nameAr.trim(),
      nameEn: form.nameEn.trim(),
      managerName: form.managerName?.trim() || undefined,
      phone: form.phone?.trim() || undefined,
      isActive: form.isActive,
    };

    let res;
    if (modal === 'create') res = await createBranch(payload);
    else res = await updateBranch(editing.id, payload);

    setSaving(false);
    if (res.success) closeModal();
    else setModalError(res.error || 'فشل الحفظ');
  };

  const handleToggle = async (branch) => {
    const res = await toggleBranch(branch.id);
    if (!res.success) alert(res.error);
  };

  const handleDelete = async (branch) => {
    if (!(await Swal.fire({ text: `حذف "${branch.nameAr}"؟ لا يمكن التراجع.`, icon: 'warning', showCancelButton: true, confirmButtonText: 'نعم، متأكد', cancelButtonText: 'إلغاء', confirmButtonColor: '#CF3A69', cancelButtonColor: '#8E717D' })).isConfirmed) return;
    const res = await deleteBranch(branch.id);
    if (!res.success) alert(res.error || 'فشل الحذف (ممكن يكون مرتبط بحجوزات)');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center shadow-lg">
            <FiHome className="text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#2B151F]">إدارة الفروع</h2>
            <p className="text-xs text-[#8E717D] mt-0.5">{branches.length} فرع</p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#CF3A69] to-[#E65A84] text-white font-bold text-xs shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <FiPlus /> إضافة فرع
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-rose-100 shadow-sm mb-6 flex flex-col sm:flex-row gap-3">
        <select
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-xs font-bold"
        >
          <option value="">كل المدن</option>
          {(apiCities || []).map((c) => (
            <option key={c.id} value={c.id}>{c.nameAr}</option>
          ))}
        </select>
        <button
          onClick={refetch}
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
      ) : branches.length === 0 ? (
        <div className="text-center py-20 text-[#8E717D]">
          لا توجد فروع. اضغطي "+ إضافة فرع" للبدء.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100">
              <tr>
                <th className="text-start px-4 py-3 text-xs font-black text-[#8E717D]">الفرع</th>
                <th className="text-start px-4 py-3 text-xs font-black text-[#8E717D]">المدينة</th>
                <th className="text-start px-4 py-3 text-xs font-black text-[#8E717D]">المدير</th>
                <th className="text-start px-4 py-3 text-xs font-black text-[#8E717D]">الجوال</th>
                <th className="text-start px-4 py-3 text-xs font-black text-[#8E717D]">الموظفات</th>
                <th className="text-start px-4 py-3 text-xs font-black text-[#8E717D]">الحجوزات</th>
                <th className="text-start px-4 py-3 text-xs font-black text-[#8E717D]">الحالة</th>
                <th className="text-start px-4 py-3 text-xs font-black text-[#8E717D]">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((branch) => (
                <tr key={branch.id} className="border-b border-rose-50 hover:bg-rose-50/30">
                  <td className="px-4 py-3">
                    <div className="text-sm font-bold text-[#2B151F]">{branch.nameAr}</div>
                    <div className="text-[10px] text-[#8E717D]">{branch.nameEn}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg">
                      <FiMapPin className="text-[10px]" />
                      {branch.city?.nameAr || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-[#5A3F4B]">
                    {branch.managerName || '—'}
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-[#5A3F4B]" dir="ltr">
                    {branch.phone || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                      <FiUser className="text-[10px]" />
                      {branch.staffCount || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold text-[#CF3A69]">
                      {branch.bookingsCount || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black ${
                        branch.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-300'
                      }`}
                    >
                      {branch.isActive ? 'نشط' : 'معطّل'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(branch)}
                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                        title="تعديل"
                      >
                        <FiEdit2 className="text-sm" />
                      </button>
                      <button
                        onClick={() => handleToggle(branch)}
                        className="p-2 rounded-lg text-amber-600 hover:bg-amber-50"
                        title={branch.isActive ? 'تعطيل' : 'تفعيل'}
                      >
                        {branch.isActive ? <FiEyeOff className="text-sm" /> : <FiEye className="text-sm" />}
                      </button>
                      <button
                        onClick={() => handleDelete(branch)}
                        className="p-2 rounded-lg text-rose-600 hover:bg-rose-50"
                        title="حذف"
                      >
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

      {/* Modal */}
      {modal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-[#2B151F]">
                {modal === 'create' ? 'إضافة فرع جديد' : 'تعديل فرع'}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-rose-50 rounded-lg">
                <FiX />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-black text-[#2B151F] block mb-1">المدينة *</label>
                <select
                  value={form.cityId}
                  onChange={(e) => setForm({ ...form, cityId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-sm font-bold"
                >
                  <option value="">اختر مدينة</option>
                  {(apiCities || []).map((c) => (
                    <option key={c.id} value={c.id}>{c.nameAr}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-black text-[#2B151F] block mb-1">الاسم (عربي) *</label>
                <input
                  type="text"
                  value={form.nameAr}
                  onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-sm font-bold focus:outline-none focus:border-[#CF3A69]"
                  placeholder="فرع الرياض - الشمال"
                />
              </div>

              <div>
                <label className="text-xs font-black text-[#2B151F] block mb-1">الاسم (إنجليزي) *</label>
                <input
                  type="text"
                  dir="ltr"
                  value={form.nameEn}
                  onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-sm font-bold focus:outline-none focus:border-[#CF3A69]"
                  placeholder="Riyadh North Branch"
                />
              </div>

              <div>
                <label className="text-xs font-black text-[#2B151F] block mb-1">اسم المدير</label>
                <input
                  type="text"
                  value={form.managerName}
                  onChange={(e) => setForm({ ...form, managerName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-sm font-bold focus:outline-none focus:border-[#CF3A69]"
                />
              </div>

              <div>
                <label className="text-xs font-black text-[#2B151F] block mb-1">الجوال</label>
                <input
                  type="text"
                  dir="ltr"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-sm font-bold focus:outline-none focus:border-[#CF3A69]"
                  placeholder="0501234567"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveBranch"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isActiveBranch" className="text-xs font-black text-[#2B151F] cursor-pointer">
                  نشط (يظهر في الحجز)
                </label>
              </div>
            </div>

            {modalError && (
              <div className="mt-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-2.5 rounded-xl">
                {modalError}
              </div>
            )}

            <div className="flex gap-2 mt-6">
              <button
                onClick={closeModal}
                className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-bold"
              >
                إلغاء
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#CF3A69] to-[#E65A84] text-white text-sm font-black shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {saving ? 'جاري الحفظ...' : modal === 'create' ? 'إنشاء' : 'حفظ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchesManagementTab;
