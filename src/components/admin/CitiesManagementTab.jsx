import Swal from 'sweetalert2';
import React, { useState } from 'react';
import {
  FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff,
  FiX, FiRefreshCw, FiMapPin, FiHome, FiTruck,
} from 'react-icons/fi';
import { useAdminCities } from '../../hooks/useAdminCities';

const EMPTY_FORM = {
  key: '',
  nameAr: '',
  nameEn: '',
  deliveryFee: 0,
  surgeMultiplier: 1,
  operatingHours: '10:00 - 23:00',
  maxDailyCapacity: 20,
  isActive: true,
};

const CitiesManagementTab = () => {
  const { cities, loading, error, refetch, createCity, updateCity, toggleCity, deleteCity } = useAdminCities();

  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  const openCreate = () => {
    setModal('create');
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalError('');
  };

  const openEdit = (city) => {
    setModal('edit');
    setEditing(city);
    setForm({
      key: city.key || '',
      nameAr: city.nameAr || '',
      nameEn: city.nameEn || '',
      deliveryFee: Number(city.deliveryFee) || 0,
      surgeMultiplier: Number(city.surgeMultiplier) || 1,
      operatingHours: city.operatingHours || '',
      maxDailyCapacity: city.maxDailyCapacity || 0,
      isActive: city.isActive !== false,
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
      key: form.key.trim(),
      nameAr: form.nameAr.trim(),
      nameEn: form.nameEn.trim(),
      deliveryFee: Number(form.deliveryFee),
      surgeMultiplier: Number(form.surgeMultiplier),
      operatingHours: form.operatingHours?.trim() || undefined,
      maxDailyCapacity: Number(form.maxDailyCapacity),
      isActive: form.isActive,
    };

    let res;
    if (modal === 'create') res = await createCity(payload);
    else res = await updateCity(editing.id, payload);

    setSaving(false);
    if (res.success) closeModal();
    else setModalError(res.error || 'فشل الحفظ');
  };

  const handleToggle = async (city) => {
    const res = await toggleCity(city.id);
    if (!res.success) alert(res.error);
  };

  const handleDelete = async (city) => {
    if (!(await Swal.fire({ text: `حذف "${city.nameAr}"؟ لا يمكن التراجع.`, icon: 'warning', showCancelButton: true, confirmButtonText: 'نعم، متأكد', cancelButtonText: 'إلغاء', confirmButtonColor: '#CF3A69', cancelButtonColor: '#8E717D' })).isConfirmed) return;
    const res = await deleteCity(city.id);
    if (!res.success) alert(res.error || 'فشل الحذف (ممكن تكون مرتبطة بحجوزات)');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center shadow-lg">
            <FiMapPin className="text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#2B151F]">إدارة المدن والفروع</h2>
            <p className="text-xs text-[#8E717D] mt-0.5">{cities.length} مدينة</p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#CF3A69] to-[#E65A84] text-white font-bold text-xs shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <FiPlus /> إضافة مدينة
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      <div className="flex justify-end mb-4">
        <button
          onClick={refetch}
          className="px-3 py-2 rounded-xl border border-rose-200 text-[#CF3A69] hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5"
        >
          <FiRefreshCw /> تحديث
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#8E717D]">جاري التحميل...</div>
      ) : cities.length === 0 ? (
        <div className="text-center py-20 text-[#8E717D]">لا توجد مدن</div>
      ) : (
        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
              <tr>
                <th className="text-start px-4 py-3 text-xs font-black text-[#8E717D]">المدينة</th>
                <th className="text-start px-4 py-3 text-xs font-black text-[#8E717D]">Key</th>
                <th className="text-start px-4 py-3 text-xs font-black text-[#8E717D]">رسوم التنقل</th>
                <th className="text-start px-4 py-3 text-xs font-black text-[#8E717D]">Surge</th>
                <th className="text-start px-4 py-3 text-xs font-black text-[#8E717D]">السعة اليومية</th>
                <th className="text-start px-4 py-3 text-xs font-black text-[#8E717D]">ساعات العمل</th>
                <th className="text-start px-4 py-3 text-xs font-black text-[#8E717D]">الفروع</th>
                <th className="text-start px-4 py-3 text-xs font-black text-[#8E717D]">الحالة</th>
                <th className="text-start px-4 py-3 text-xs font-black text-[#8E717D]">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((city) => (
                <tr key={city.id} className="border-b border-blue-50 hover:bg-blue-50/30">
                  <td className="px-4 py-3">
                    <div className="text-sm font-bold text-[#2B151F]">{city.nameAr}</div>
                    <div className="text-[10px] text-[#8E717D]">{city.nameEn}</div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-[#5A3F4B]">{city.key}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm font-bold text-[#CF3A69]">
                      <FiTruck className="text-xs" />
                      {Number(city.deliveryFee).toFixed(0)} ر.س
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-[#5A3F4B]">
                    ×{Number(city.surgeMultiplier).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-[#5A3F4B]">
                    {city.maxDailyCapacity}
                  </td>
                  <td className="px-4 py-3 text-xs text-[#8E717D]">
                    {city.operatingHours || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg">
                      <FiHome className="text-[10px]" />
                      {city.branchesCount || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black ${
                        city.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-300'
                      }`}
                    >
                      {city.isActive ? 'نشطة' : 'معطلة'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(city)}
                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                        title="تعديل"
                      >
                        <FiEdit2 className="text-sm" />
                      </button>
                      <button
                        onClick={() => handleToggle(city)}
                        className="p-2 rounded-lg text-amber-600 hover:bg-amber-50"
                        title={city.isActive ? 'تعطيل' : 'تفعيل'}
                      >
                        {city.isActive ? <FiEyeOff className="text-sm" /> : <FiEye className="text-sm" />}
                      </button>
                      <button
                        onClick={() => handleDelete(city)}
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
            className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-[#2B151F]">
                {modal === 'create' ? 'إضافة مدينة جديدة' : 'تعديل مدينة'}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-rose-50 rounded-lg">
                <FiX />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-[#2B151F] block mb-1">Key *</label>
                <input
                  type="text"
                  dir="ltr"
                  value={form.key}
                  onChange={(e) => setForm({ ...form, key: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-sm font-bold font-mono focus:outline-none focus:border-[#CF3A69]"
                  placeholder="jeddah"
                />
              </div>

              <div>
                <label className="text-xs font-black text-[#2B151F] block mb-1">الاسم (عربي) *</label>
                <input
                  type="text"
                  value={form.nameAr}
                  onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-sm font-bold focus:outline-none focus:border-[#CF3A69]"
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
                />
              </div>

              <div>
                <label className="text-xs font-black text-[#2B151F] block mb-1">رسوم التنقل (ر.س)</label>
                <input
                  type="number"
                  min={0}
                  value={form.deliveryFee}
                  onChange={(e) => setForm({ ...form, deliveryFee: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-sm font-bold focus:outline-none focus:border-[#CF3A69]"
                />
              </div>

              <div>
                <label className="text-xs font-black text-[#2B151F] block mb-1">Surge Multiplier</label>
                <input
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={form.surgeMultiplier}
                  onChange={(e) => setForm({ ...form, surgeMultiplier: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-sm font-bold focus:outline-none focus:border-[#CF3A69]"
                />
              </div>

              <div>
                <label className="text-xs font-black text-[#2B151F] block mb-1">السعة اليومية</label>
                <input
                  type="number"
                  min={0}
                  value={form.maxDailyCapacity}
                  onChange={(e) => setForm({ ...form, maxDailyCapacity: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-sm font-bold focus:outline-none focus:border-[#CF3A69]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-black text-[#2B151F] block mb-1">ساعات العمل</label>
                <input
                  type="text"
                  value={form.operatingHours}
                  onChange={(e) => setForm({ ...form, operatingHours: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-sm font-bold focus:outline-none focus:border-[#CF3A69]"
                  placeholder="10:00 - 23:00"
                />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isActive" className="text-xs font-black text-[#2B151F] cursor-pointer">
                  نشطة (ظاهرة للعملاء)
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

export default CitiesManagementTab;
