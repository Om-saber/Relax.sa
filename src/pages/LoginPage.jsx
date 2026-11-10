import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiPhone,
  FiArrowLeft,
  FiArrowRight,
  FiShield,
  FiCheckCircle,
  FiUser,
  FiKey,
  FiLock,
  FiChevronLeft,
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { FaCrown } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { requestOtp, loginWithPhone, user, isAuthenticated, logout } = useAuth();
  const { lang, isRTL } = useLanguage();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [clientName, setClientName] = useState('');
  const [step, setStep] = useState(1);
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length < 9) {
      setErrorMsg(
        lang === 'ar'
          ? 'يرجى إدخال رقم جوال سعودي صحيح (مثال: 0501234567)'
          : 'Please enter a valid Saudi phone number'
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await requestOtp(phoneNumber, clientName);
      if (!res.success) {
        setErrorMsg(res.message || (lang === 'ar' ? 'فشل إرسال الرمز' : 'Failed to send code'));
        setIsSubmitting(false);
        return;
      }
      if (res.devCode) setSimulatedOtp(res.devCode);
      setStep(2);
    } catch (err) {
      setErrorMsg(err.message || 'حدث خطأ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleAutoFillOtp = () => {
    if (!simulatedOtp) return;
    const digits = simulatedOtp.split('');
    setOtpCode(digits);
  };

  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const code = otpCode.join('');
      if (code.length !== 4) {
        setErrorMsg(lang === 'ar' ? 'يرجى إدخال 4 أرقام' : 'Please enter 4 digits');
        setIsSubmitting(false);
        return;
      }
      const res = await loginWithPhone(phoneNumber, code, clientName);
      if (res.success) {
        navigate('/client-portal', { replace: true });
      } else {
        setErrorMsg(res.message || (lang === 'ar' ? 'رمز خاطئ' : 'Invalid code'));
      }
    } catch {
      setErrorMsg(lang === 'ar' ? 'فشل التحقق، يرجى المحاولة ثانية' : 'Verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setErrorMsg('');
    try {
      const res = await requestOtp(phoneNumber);
      if (res.success && res.devCode) {
        setSimulatedOtp(res.devCode);
        setOtpCode(['', '', '', '']);
      } else if (!res.success) {
        setErrorMsg(res.message || 'فشل إعادة إرسال الرمز');
      }
    } catch (err) {
      setErrorMsg(err.message || 'حدث خطأ');
    }
  };


  return (
    <div className="min-h-screen pt-28 pb-16 px-4 bg-gradient-to-b from-[#FFF5F7] via-[#FFF9FA] to-white flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#CF3A69] to-[#E65A84] text-white shadow-xl shadow-rose-300/40 mb-3">
            <FaCrown className="text-2xl" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2B151F] font-serif">
            Let's Relax
          </h1>
          <p className="text-xs sm:text-sm text-[#8E717D] mt-1 font-bold">
            {lang === 'ar'
              ? 'تسجيل الدخول الفوري برقم الجوال'
              : 'Instant Login with Mobile Number'}
          </p>
        </div>

        {isAuthenticated && user && (
          <div className="mb-6 p-4 rounded-2xl bg-white border border-rose-200/80 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar || user.avatarUrl || 'https://via.placeholder.com/44'}
                  alt={user.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#CF3A69]"
                />
                <div>
                  <h4 className="text-xs font-black text-[#2B151F]">{user.name}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-[#CF3A69] border border-rose-200">
                    {user.roleTitle || user.role}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to={
                    user.role === 'admin'
                      ? '/dashboard'
                      : user.role === 'staff'
                      ? '/staff'
                      : '/client-portal'
                  }
                  className="px-3 py-1.5 rounded-xl bg-[#CF3A69] text-white text-xs font-bold shadow-sm"
                >
                  {lang === 'ar' ? 'الدخول' : 'Enter'}
                </Link>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-xl hover:bg-rose-50 text-xs font-bold text-gray-500"
                >
                  خروج
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="step-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSendOtp}
                className="space-y-5 relative z-10"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-black text-[#2B151F]">
                      {lang === 'ar' ? 'رقم الجوال السعودي' : 'Saudi Mobile Number'}
                    </label>
                    <span className="text-[10px] font-bold text-[#8E717D]">
                      {lang === 'ar' ? 'دخول برقم الهاتف فقط' : 'Phone only'}
                    </span>
                  </div>

                  <div className="relative flex items-center">
                    <div className="absolute start-3 flex items-center gap-1.5 text-xs font-bold text-[#5A3F4B] bg-[#FFF0F3] px-2.5 py-1 rounded-xl border border-rose-200/70 select-none">
                      <span>🇸🇦</span>
                      <span dir="ltr">+966</span>
                    </div>

                    <input
                      type="tel"
                      dir="ltr"
                      required
                      placeholder="05X XXX XXXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full ps-24 pe-4 py-3.5 rounded-2xl bg-[#FFF9FA] border border-rose-200/80 focus:border-[#CF3A69] focus:ring-2 focus:ring-rose-200/50 outline-none text-sm font-bold text-[#2B151F] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-[#2B151F] mb-1.5 block">
                    {lang === 'ar' ? 'اسمك الكريم (اختياري للعميلات الجديدات)' : 'Your Name (Optional)'}
                  </label>
                  <div className="relative">
                    <FiUser className="absolute start-3.5 top-1/2 -translate-y-1/2 text-[#8E717D]" />
                    <input
                      type="text"
                      placeholder={lang === 'ar' ? 'مثال: سارة محمد' : 'e.g. Sarah'}
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full ps-10 pe-4 py-3 rounded-2xl bg-[#FFF9FA] border border-rose-200/80 focus:border-[#CF3A69] focus:ring-2 focus:ring-rose-200/50 outline-none text-xs font-bold text-[#2B151F] transition-all"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#CF3A69] via-[#E65A84] to-[#CF3A69] text-white font-black text-sm shadow-lg shadow-rose-400/25 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>
                    {isSubmitting
                      ? lang === 'ar'
                        ? 'جاري الإرسال...'
                        : 'Sending...'
                      : lang === 'ar'
                      ? 'إرسال رمز التحقق (OTP)'
                      : 'Send Verification Code'}
                  </span>
                  {isRTL ? <FiArrowLeft /> : <FiArrowRight />}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-[#8E717D]">
                  <FiShield className="text-[#CF3A69]" />
                  <span>
                    {lang === 'ar'
                      ? 'دخول مشفر وسريع بأعلى معايير الخصوصية'
                      : 'Secure, encrypted login'}
                  </span>
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifyOtp}
                className="space-y-5 relative z-10"
              >
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-50 text-[#CF3A69] flex items-center justify-center text-xl mb-2">
                    <FiLock />
                  </div>
                  <h3 className="text-sm font-black text-[#2B151F]">
                    {lang === 'ar' ? 'أدخلي رمز التحقق المرسل' : 'Enter Verification Code'}
                  </h3>
                  <p className="text-[11px] text-[#8E717D] mt-1">
                    {lang === 'ar' ? 'تم إرسال الرمز لرقم الجوال:' : 'Code sent to:'}{' '}
                    <span className="font-bold text-[#2B151F]">{phoneNumber}</span>
                  </p>
                </div>

                {simulatedOtp && (
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">💬</span>
                      <div>
                        <span className="font-black text-emerald-900 block text-[11px]">
                          رسالة SMS تجريبية:
                        </span>
                        <span className="text-emerald-700 font-bold">
                          رمز دخول ليتس ريلاكس هو: [{simulatedOtp}]
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAutoFillOtp}
                      className="px-2.5 py-1 rounded-xl bg-emerald-600 text-white font-black text-[10px] hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      تعبئة تلقائية
                    </button>
                  </div>
                )}

                <div className="flex justify-center gap-3" dir="ltr">
                  {[0, 1, 2, 3].map((idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength={1}
                      value={otpCode[idx]}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className="w-12 h-14 rounded-2xl text-center text-xl font-black bg-[#FFF9FA] border-2 border-rose-200/80 focus:border-[#CF3A69] focus:bg-white outline-none text-[#2B151F] shadow-sm transition-all"
                    />
                  ))}
                </div>

                {errorMsg && (
                  <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-center">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#CF3A69] via-[#E65A84] to-[#CF3A69] text-white font-black text-sm shadow-lg shadow-rose-400/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>{lang === 'ar' ? 'جاري التحقق...' : 'Verifying...'}</span>
                  ) : (
                    <>
                      <span>{lang === 'ar' ? 'تأكيد ودخول' : 'Verify & Continue'}</span>
                      <FiCheckCircle />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs font-bold pt-1">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[#8E717D] hover:text-[#CF3A69] flex items-center gap-1"
                  >
                    <FiChevronLeft className="rtl:rotate-180" />
                    <span>{lang === 'ar' ? 'تغيير الرقم' : 'Change number'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-[#CF3A69] hover:underline"
                  >
                    {lang === 'ar' ? 'إعادة إرسال الرمز' : 'Resend code'}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-xs font-bold text-[#8E717D] hover:text-[#CF3A69] transition-colors inline-flex items-center gap-1.5"
          >
            <span>{lang === 'ar' ? 'العودة إلى المتجر الرئيسي' : 'Back to Home'}</span>
            <FiArrowLeft className="rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;