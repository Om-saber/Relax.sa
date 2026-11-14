import Swal from 'sweetalert2';
import React, { useState } from 'react';
import {
  FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiSearch,
  FiX, FiRefreshCw, FiDollarSign, FiClock, FiImage,
} from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa6';
import { useAdminServices } from '../../hooks/useAdminServices';

const CATEGORY_OPTIONS = [
  { key: '', label: 'كل الفئات' },
  { key: 'packages', label: 'الباقات' },
  { key: 'massage', label: 'المساج' },
  { key: 'moroccan', label: 'الحمام المغربي' },
  { key: 'beauty', label: 'العناية والتجميل' },
  { key: 'maternity', label: 'الحوامل' },
];

const EMPTY_FORM = {
  slug: '',
  titleAr: '',
  titleEn: '',
  descriptionAr: '',
  categoryId: '',
  price: 0,
  originalPrice: '',
  durationMinutes: 60,
  maxBeneficiaries: 1,
  badgeAr: '',
  imageUrl: '',
  isActive: true,
  sortOrder: 0,
};

const ServicesManagementTab = ({ categories = [] }) => {
  const [filterCategory, setFilterCategory] = useState('');
  const [search, setSearch] = useState('');
  const { services, loading, error, refetch, createService, updateService, toggleService, deleteService } =
    useAdminServices({ categoryKey: filterCategory || undefined, search: search || undefined });

  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  const openCreate = async () => {
    setModal('create');
    setEditing(null);
    setForm({ ...EMPTY_FORM, categoryId: categories[0]?.id || '' });
    setModalError('');
  };

  const openEdit = (svc) => {
    setModal('edit');
    setEditing(svc);
    setForm({
      slug: svc.slug || '',
      titleAr: svc.titleAr || '',
      titleEn: svc.titleEn || '',
      descriptionAr: svc.descriptionAr || '',
      categoryId: svc.categoryId || svc.category?.id || '',
      price: Number(svc.price) || 0,
      originalPrice: svc.originalPrice ? Number(svc.originalPrice) : '',
      durationMinutes: svc.durationMinutes || 60,
      maxBeneficiaries: svc.maxBeneficiaries || 1,
      badgeAr: svc.badgeAr || '',
      imageUrl: svc.imageUrl || '',
      isActive: svc.isActive !== false,
      sortOrder: svc.sortOrder || 0,
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
      slug: form.slug.trim(),
      titleAr: form.titleAr.trim(),
      titleEn: form.titleEn.trim(),
      descriptionAr: form.descriptionAr?.trim() || undefined,
      categoryId: form.categoryId,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      durationMinutes: Number(form.durationMinutes),
      maxBeneficiaries: Number(form.maxBeneficiaries),
      badgeAr: form.badgeAr?.trim() || undefined,
      imageUrl: form.imageUrl?.trim() || undefined,
      isActive: form.isActive,
      sortOrder: Number(form.sortOrder),
    };

    let res;
    if (modal === 'create') res = await createService(payload);
    else res = await updateService(editing.id, payload);

    setSaving(false);
    if (res.success) closeModal();
    else setModalError(res.error || 'فشل الحفظ');
  };

  const handleToggle = async (svc) => {
    const res = await toggleService(svc.id);
    if (!res.success) alert(res.error);
  };

  const handleDelete = async (svc) => {
    if (!(await Swal.fire({ text: `حذف "${svc.titleAr}"؟ لا يمكن التراجع.`, icon: 'warning', showCancelButton: true, confirmButtonText: 'نعم، متأكد', cancelButtonText: 'إلغاء', confirmButtonColor: '#CF3A69', cancelButtonColor: '#8E717D' })).isConfirmed) return;
    const res = await deleteService(svc.id);
    if (!res.success) alert(res.error || 'فشل الحذف (ممكن تكون مستخدمة في حجوزات)');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-lg">
            <FaCrown className="text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#2B151F]">إدارة الخدمات والباقات</h2>
            <p className="text-xs text-[#8E717D] mt-0.5">{services.length} خدمة</p>
          </div>
        </div>
        <button onClick={openCreate} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#CF3A69] to-[#E65A84] text-white font-bold text-xs shadow-md hover:shadow-lg flex items-center gap-2">
          <FiPlus /> إضافة خدمة
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-rose-100 shadow-sm mb-6 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <FiSearch className="absolute start-3 top-3 text-[#CF3A69] text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو slug..."
            className="w-full ps-9 pe-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-xs font-bold focus:outline-none focus:border-[#CF3A69]"
          />
        </div>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-xs font-bold">
          {CATEGORY_OPTIONS.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
        </select>
        <button onClick={refetch} className="px-3 py-2.5 rounded-xl border border-rose-200 text-[#CF3A69] hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5">
          <FiRefreshCw /> تحديث
        </button>
      </div>

      {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3 rounded-xl mb-4">{error}</div>}

      {loading ? (
        <div className="text-center py-20 text-[#8E717D]">جاري التحميل...</div>
      ) : services.length === 0 ? (
        <div className="text-center py-20 text-[#8E717D]">لا توجد خدمات</div>
      ) : (
        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100">
              <tr>
                <th className="text-start px-4 py-3 text-xs font-black text-[#8E717D]">الصورة</th>
                <th className="text-start px-4 py-3 text-xs font-black text-[#8E717D]">الاسم</th>
                <th className="text-start px-4 py-3 text-xs font-black text-[#8E717D]">الفئة</th>
                <th className="text-start px-4 py-3 text-xs font-black text-[#8E717D]">السعر</th>
                <th className="text-start px-4 py-3 text-xs font-black text-[#8E717D]">المدة</th>
                <th className="text-start px-4 py-3 text-xs font-black text-[#8E717D]">الحالة</th>
                <th className="text-start px-4 py-3 text-xs font-black text-[#8E717D]">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {services.map((svc) => (
                <tr key={svc.id} className="border-b border-rose-50 hover:bg-rose-50/30">
                  <td className="px-4 py-3">
                    {svc.imageUrl ? (
                      <img src={svc.imageUrl} alt={svc.titleAr} className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-rose-100 flex items-center justify-center">
                        <FiImage className="text-rose-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-bold text-[#2B151F]">{svc.titleAr}</div>
                    <div className="text-[10px] text-[#8E717D] font-mono">{svc.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-[10px] font-black border border-purple-200">
                      {svc.category?.nameAr || svc.category?.key || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-black text-[#CF3A69]">{Number(svc.price).toFixed(0)} ر.س</div>
                    {svc.originalPrice && <div className="text-[10px] text-gray-400 line-through">{Number(svc.originalPrice).toFixed(0)}</div>}
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-[#5A3F4B]">{svc.durationMinutes} دقيقة</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black ${svc.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-600 border border-gray-300'}`}>
                      {svc.isActive ? 'نشطة' : 'معطلة'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(svc)} className="p-2 rounded-lg text-blue-600 hover:bg-blue-50" title="تعديل">
                        <FiEdit2 className="text-sm" />
                      </button>
                      <button onClick={() => handleToggle(svc)} className="p-2 rounded-lg text-amber-600 hover:bg-amber-50" title={svc.isActive ? 'تعطيل' : 'تفعيل'}>
                        {svc.isActive ? <FiEyeOff className="text-sm" /> : <FiEye className="text-sm" />}
                      </button>
                      <button onClick={() => handleDelete(svc)} className="p-2 rounded-lg text-rose-600 hover:bg-rose-50" title="حذف">
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-[#2B151F]">
                {modal === 'create' ? 'إضافة خدمة جديدة' : 'تعديل خدمة'}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-rose-50 rounded-lg"><FiX /></button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-black text-[#2B151F] block mb-1">Slug *</label>
                <input type="text" dir="ltr" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-sm font-bold font-mono focus:outline-none focus:border-[#CF3A69]" placeholder="new-massage" />
              </div>

              <div>
                <label className="text-xs font-black text-[#2B151F] block mb-1">الاسم (عربي) *</label>
                <input type="text" value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-sm font-bold focus:outline-none focus:border-[#CF3A69]" />
              </div>

              <div>
                <label className="text-xs font-black text-[#2B151F] block mb-1">الاسم (إنجليزي) *</label>
                <input type="text" dir="ltr" value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-sm font-bold focus:outline-none focus:border-[#CF3A69]" />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-black text-[#2B151F] block mb-1">الوصف (عربي)</label>
                <textarea value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} rows={3} className="w-full px-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-sm font-bold focus:outline-none focus:border-[#CF3A69]" />
              </div>

              <div>
                <label className="text-xs font-black text-[#2B151F] block mb-1">الفئة *</label>
                <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-sm font-bold">
                  <option value="">اختر فئة</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-black text-[#2B151F] block mb-1">السعر (ر.س) *</label>
                <input type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-sm font-bold focus:outline-none focus:border-[#CF3A69]" />
              </div>

              <div>
                <label className="text-xs font-black text-[#2B151F] block mb-1">السعر الأصلي (اختياري)</label>
                <input type="number" min={0} value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-sm font-bold focus:outline-none focus:border-[#CF3A69]" />
              </div>

              <div>
                <label className="text-xs font-black text-[#2B151F] block mb-1">المدة (دقيقة) *</label>
                <input type="number" min={15} value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-sm font-bold focus:outline-none focus:border-[#CF3A69]" />
              </div>

              <div>
                <label className="text-xs font-black text-[#2B151F] block mb-1">الحد الأقصى للمستفيدات</label>
                <input type="number" min={1} value={form.maxBeneficiaries} onChange={(e) => setForm({ ...form, maxBeneficiaries: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-sm font-bold focus:outline-none focus:border-[#CF3A69]" />
              </div>

              <div>
                <label className="text-xs font-black text-[#2B151F] block mb-1">شارة (Badge)</label>
                <input type="text" value={form.badgeAr} onChange={(e) => setForm({ ...form, badgeAr: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-sm font-bold focus:outline-none focus:border-[#CF3A69]" placeholder="الأكثر طلباً" />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-black text-[#2B151F] block mb-1">رابط الصورة</label>
                <input type="url" dir="ltr" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-sm font-bold focus:outline-none focus:border-[#CF3A69]" placeholder="https://images.unsplash.com/..." />
                {form.imageUrl && <img src={form.imageUrl} alt="preview" className="mt-2 w-24 h-24 rounded-lg object-cover" onError={(e) => e.target.style.display='none'} />}
              </div>

              <div>
                <label className="text-xs font-black text-[#2B151F] block mb-1">ترتيب العرض</label>
                <input type="number" min={0} value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-sm font-bold focus:outline-none focus:border-[#CF3A69]" />
              </div>

              <div className="flex items-center gap-2 mt-6">
                <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4" />
                <label htmlFor="isActive" className="text-xs font-black text-[#2B151F] cursor-pointer">نشطة (ظاهرة للعملاء)</label>
              </div>
            </div>

            {modalError && (
              <div className="mt-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-2.5 rounded-xl">{modalError}</div>
            )}

            <div className="flex gap-2 mt-6">
              <button onClick={closeModal} className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-bold">إلغاء</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#CF3A69] to-[#E65A84] text-white text-sm font-black shadow-md hover:shadow-lg disabled:opacity-50">
                {saving ? 'جاري الحفظ...' : modal === 'create' ? 'إنشاء' : 'حفظ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManagementTab;
