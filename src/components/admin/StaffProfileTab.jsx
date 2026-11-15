import React, { useState, useEffect } from 'react';
import { FiUser, FiPhone, FiLock, FiSave, FiMail } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext'; // استخدام الـ Context لجلب البيانات

const StaffProfileTab = () => {
  const { user } = useAuth() || {}; // جلب بيانات المستخدم الحالي
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        password: '',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('letsrelax_access_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'}/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          ...(form.password ? { password: form.password } : {}),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'فشل تحديث البيانات');

      toast.success('تم حفظ التغييرات بنجاح! ✅');
      setForm(prev => ({ ...prev, password: '' }));
    } catch (err) {
      toast.error(err.message || 'حدث خطأ أثناء الحفظ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 bg-white rounded-3xl p-6 border border-rose-100 shadow-sm">
      <h2 className="text-xl font-black text-[#2B151F] mb-6 flex items-center gap-2">
        <FiUser className="text-[#CF3A69]" /> الملف الشخصي
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#8E717D] mb-1">البريد الإلكتروني (لا يمكن تغييره)</label>
          <div className="relative">
            <FiMail className="absolute right-3 top-3 text-slate-400" />
            <input type="email" disabled value={form.email} className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-bold text-sm" dir="ltr" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#8E717D] mb-1">الاسم بالكامل</label>
          <div className="relative">
            <FiUser className="absolute right-3 top-3 text-slate-400" />
            <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-rose-100 bg-[#FFF9FA] focus:outline-none focus:border-[#CF3A69] font-bold text-sm" />
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-bold text-[#8E717D] mb-1">رقم الجوال</label>
          <div className="relative">
            <FiPhone className="absolute right-3 top-3 text-slate-400" />
            <input required type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-rose-100 bg-[#FFF9FA] focus:outline-none focus:border-[#CF3A69] font-bold text-sm" dir="ltr" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#8E717D] mb-1">كلمة المرور الجديدة (اختياري)</label>
          <div className="relative">
            <FiLock className="absolute right-3 top-3 text-slate-400" />
            <input type="password" placeholder="اتركه فارغاً إذا لم ترغب بتغييره" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-rose-100 bg-[#FFF9FA] focus:outline-none focus:border-[#CF3A69] font-bold text-sm" />
          </div>
        </div>

        <button disabled={loading} type="submit" className="w-full py-3 bg-[#CF3A69] text-white rounded-xl font-black shadow-md shadow-rose-200 hover:bg-rose-700 transition flex items-center justify-center gap-2 disabled:opacity-50">
          <FiSave /> {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </form>
    </div>
  );
};
export default StaffProfileTab;
