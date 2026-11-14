import React, { useState } from 'react';
import { FiUser, FiPhone, FiLock, FiSave } from 'react-icons/fi';

const StaffProfileTab = ({ user }) => {
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    password: '',
  });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // هنا هنربط الـ API لاحقاً لتحديث الداتابيز
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 bg-white rounded-3xl p-6 border border-rose-100 shadow-sm">
      <h2 className="text-xl font-black text-[#2B151F] mb-6 flex items-center gap-2">
        <FiUser className="text-[#CF3A69]" /> الملف الشخصي
      </h2>
      
      {saved && (
        <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 font-bold rounded-xl text-sm border border-emerald-100 text-center">
          ✅ تم حفظ التغييرات بنجاح!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#8E717D] mb-1">الاسم بالكامل</label>
          <div className="relative">
            <FiUser className="absolute right-3 top-3 text-slate-400" />
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-rose-100 bg-[#FFF9FA] focus:outline-none focus:border-[#CF3A69] font-bold text-sm" />
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-bold text-[#8E717D] mb-1">رقم الجوال</label>
          <div className="relative">
            <FiPhone className="absolute right-3 top-3 text-slate-400" />
            <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-rose-100 bg-[#FFF9FA] focus:outline-none focus:border-[#CF3A69] font-bold text-sm" dir="ltr" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#8E717D] mb-1">كلمة المرور الجديدة (اختياري)</label>
          <div className="relative">
            <FiLock className="absolute right-3 top-3 text-slate-400" />
            <input type="password" placeholder="اتركه فارغاً إذا لم ترغب بتغييره" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-rose-100 bg-[#FFF9FA] focus:outline-none focus:border-[#CF3A69] font-bold text-sm" />
          </div>
        </div>

        <button type="submit" className="w-full py-3 bg-[#CF3A69] text-white rounded-xl font-black shadow-md shadow-rose-200 hover:bg-rose-700 transition flex items-center justify-center gap-2">
          <FiSave /> حفظ التغييرات
        </button>
      </form>
    </div>
  );
};
export default StaffProfileTab;
