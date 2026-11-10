import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiCheckCircle, FiAlertCircle, FiArrowLeft, FiCalendar } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import { paymentsApi } from '../api/paymentsApi';

/**
 * نمنع تكرار استدعاء الـ capture عند إعادة تركيب المكوّن (React StrictMode)
 * أو عند العودة لنفس الرابط خلال نفس جلسة الصفحة.
 */
const captureCache = new Map();

function captureOnce(token) {
  if (!captureCache.has(token)) {
    captureCache.set(token, paymentsApi.capturePayPalOrder(token));
  }
  return captureCache.get(token);
}

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || searchParams.get('paypalOrderId');
  const bookingId = searchParams.get('bookingId');

  const [state, setState] = useState(() =>
    token
      ? { status: 'loading', message: '', bookingNumber: null }
      : {
          status: 'error',
          message:
            'لم نعثر على رقم عملية الدفع في رابط العودة. إذا تم خصم المبلغ من حسابكِ فتواصلي معنا وسنتحقق فورًا.',
          bookingNumber: null,
        },
  );

  useEffect(() => {
    let cancelled = false;

    if (!token) return;

    captureOnce(token)
      .then((data) => {
        if (cancelled) return;
        setState({
          status: 'success',
          message: 'تم تأكيد دفعتكِ بنجاح، وحجزكِ الآن مدفوع بالكامل.',
          bookingNumber: data?.booking?.bookingNumber || null,
        });
      })
      .catch((err) => {
        if (cancelled) return;
        setState({
          status: 'error',
          message:
            err?.message ||
            'تعذّر تأكيد الدفع. إذا تم خصم المبلغ فتواصلي معنا وسنتحقق فورًا.',
          bookingNumber: null,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#FFF9FA]">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-rose-100 shadow-xl text-center">
          {state.status === 'loading' && (
            <>
              <div className="w-16 h-16 mx-auto mb-5 rounded-full border-4 border-rose-100 border-t-[#CF3A69] animate-spin" />
              <h1 className="text-xl font-black text-[#2B151F]">
                جاري تأكيد الدفع...
              </h1>
              <p className="text-xs sm:text-sm text-[#8E717D] mt-2">
                لحظات من فضلكِ، لا تغلقي الصفحة.
              </p>
            </>
          )}

          {state.status === 'success' && (
            <>
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl">
                <FiCheckCircle />
              </div>
              <h1 className="text-xl font-black text-[#2B151F]">
                تم الدفع بنجاح 🎉
              </h1>
              <p className="text-xs sm:text-sm text-[#8E717D] mt-2 leading-relaxed">
                {state.message}
              </p>

              {state.bookingNumber && (
                <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFF0F3] border border-rose-200 text-xs font-black text-[#CF3A69]">
                  <FiCalendar />
                  <span>رقم الحجز: {state.bookingNumber}</span>
                </div>
              )}

              <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/client-portal"
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#CF3A69] hover:bg-[#b02652] text-white text-xs font-black shadow-md transition-colors"
                >
                  العودة إلى بوابة العميلة
                </Link>
                <a
                  href="https://wa.me/966537313756"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black shadow-md transition-colors inline-flex items-center justify-center gap-2"
                >
                  <FaWhatsapp />
                  تواصلي معنا
                </a>
              </div>
            </>
          )}

          {state.status === 'error' && (
            <>
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-3xl">
                <FiAlertCircle />
              </div>
              <h1 className="text-xl font-black text-[#2B151F]">
                لم يكتمل تأكيد الدفع
              </h1>
              <p className="text-xs sm:text-sm text-[#8E717D] mt-2 leading-relaxed">
                {state.message}
              </p>

              <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/client-portal"
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#CF3A69] hover:bg-[#b02652] text-white text-xs font-black shadow-md transition-colors inline-flex items-center justify-center gap-2"
                >
                  <FiArrowLeft />
                  العودة لبوابة العميلة
                </Link>
                <a
                  href="https://wa.me/966537313756"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black shadow-md transition-colors inline-flex items-center justify-center gap-2"
                >
                  <FaWhatsapp />
                  الدعم عبر واتساب
                </a>
              </div>
            </>
          )}
        </div>

        {bookingId && state.status !== 'loading' && (
          <p className="text-center text-[11px] text-[#8E717D] mt-4">
            رقم الحجز المرجعي: {bookingId}
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
