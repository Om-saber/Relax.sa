import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight, FiShield, FiEye, FiEyeOff } from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const StaffLoginPage = () => {
  const navigate = useNavigate();
  const { loginWithPassword } = useAuth();
  const { lang } = useLanguage();

  const isAr = lang === 'ar';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginWithPassword(email.trim().toLowerCase(), password);
      if (res.success) {
        // P1-14: ADMIN → /dashboard, STAFF → /staff (one landing page for staff)
        const isAdmin = res.user?.role === 'admin';
        const dest = isAdmin ? '/dashboard' : '/staff';
        navigate(dest, { replace: true });
      } else {
        setError(res.message || (isAr ? 'فشل تسجيل الدخول' : 'Login failed'));
      }
    } catch (err) {
      setError(err.message || (isAr ? 'حدث خطأ غير متوقع' : 'Unexpected error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden"
    >
      {/* decorative background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 end-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 start-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-2xl shadow-purple-500/40 mb-4">
            <FaCrown className="text-2xl" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {isAr ? 'دخول فريق العمل' : 'Staff Portal'}
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 mt-2 font-bold">
            {isAr ? 'هذه الصفحة مخصصة للموظفات والمدير فقط' : 'For staff and administrators only'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-xs font-black text-slate-700 mb-2 block">
                {isAr ? 'البريد الإلكتروني' : 'Email'}
              </label>
              <div className="relative">
                <FiMail className="absolute start-4 top-1/2 -translate-y-1/2 text-purple-500 text-lg" />
                <input
                  type="email"
                  required
                  dir="ltr"
                  autoComplete="email"
                  placeholder="name@relax.sa"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full ps-12 pe-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-sm font-bold text-slate-800 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-black text-slate-700 mb-2 block">
                {isAr ? 'كلمة المرور' : 'Password'}
              </label>
              <div className="relative">
                <FiLock className="absolute start-4 top-1/2 -translate-y-1/2 text-purple-500 text-lg" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  dir="ltr"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full ps-12 pe-12 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-sm font-bold text-slate-800 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-500 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="text-xs text-rose-700 font-bold bg-rose-50 p-3 rounded-xl border border-rose-200">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-sm shadow-lg shadow-purple-500/30 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>
                {loading
                  ? isAr ? 'جاري الدخول...' : 'Signing in...'
                  : isAr ? 'دخول' : 'Sign In'}
              </span>
              {!loading && <FiArrowRight className={isAr ? 'rotate-180' : ''} />}
            </button>

            {/* Security hint */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-2">
              <FiShield className="text-purple-500" />
              <span>
                {isAr ? 'دخول آمن للموظفات المعتمدات فقط' : 'Secure access for authorized staff only'}
              </span>
            </div>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-[11px] text-purple-200/70 mt-6">
          {isAr
            ? 'إن لم يكن لديكِ حساب، تواصلي مع مدير النظام'
            : 'Contact your administrator to request access'}
        </p>
      </div>
    </div>
  );
};

export default StaffLoginPage;
