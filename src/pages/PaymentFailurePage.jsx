import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiXCircle, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';

const PaymentFailurePage = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#FFF9FA]">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-rose-100 shadow-xl text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center text-3xl">
            <FiXCircle />
          </div>

          <h1 className="text-xl font-black text-[#2B151F]">
            تم إلغاء عملية الدفع
          </h1>
          <p className="text-xs sm:text-sm text-[#8E717D] mt-2 leading-relaxed">
            لم يتم خصم أي مبلغ من حسابكِ. يمكنكِ إعادة المحاولة في أي وقت من بوابة
            العميلة، أو اختيار الدفع عند وصول الأخصائية.
          </p>

          {bookingId && (
            <p className="text-[11px] text-[#8E717D] mt-3">
              رقم الحجز المرجعي: {bookingId}
            </p>
          )}

          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/client-portal"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#CF3A69] hover:bg-[#b02652] text-white text-xs font-black shadow-md transition-colors inline-flex items-center justify-center gap-2"
            >
              <FiRefreshCw />
              إعادة المحاولة من البوابة
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

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8E717D] hover:text-[#CF3A69] mt-6 transition-colors"
          >
            <FiArrowLeft />
            العودة إلى المتجر الرئيسي
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailurePage;
