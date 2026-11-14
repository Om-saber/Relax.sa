import React from 'react';
import { FiX, FiCalendar, FiClock, FiMapPin, FiPhone, FiUser, FiDollarSign } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';

const SpecialistBookingModal = ({ booking, onClose }) => {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-rose-100">
        <div className="flex justify-between items-center p-5 border-b border-rose-50 bg-[#FFF9FA]">
          <h3 className="font-black text-[#2B151F] text-lg flex items-center gap-2">
            تفاصيل الحجز <span className="text-sm font-bold text-[#CF3A69] bg-rose-100/50 px-2 py-0.5 rounded-md">{booking.bookingNumber}</span>
          </h3>
          <button onClick={onClose} className="p-2 bg-rose-100/50 text-[#CF3A69] rounded-full hover:bg-rose-200 transition">
            <FiX size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4 text-sm">
          <div className="flex items-center gap-3 bg-[#FFF9FA] p-3 rounded-2xl border border-rose-50">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-[#CF3A69] flex items-center justify-center font-bold text-lg">
              {booking.customerName?.charAt(0) || 'ع'}
            </div>
            <div>
              <p className="font-black text-[#2B151F]">{booking.customerName}</p>
              <p className="text-xs font-bold text-[#8E717D]">{booking.customerPhone}</p>
            </div>
            {booking.customerPhone && (
              <a href={`https://wa.me/${booking.customerPhone}`} target="_blank" rel="noreferrer" className="ml-auto p-2 bg-[#25D366]/10 text-[#25D366] rounded-xl hover:bg-[#25D366]/20">
                <FaWhatsapp size={18} />
              </a>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-500 block mb-1">التاريخ</span>
              <span className="font-bold text-[#2B151F] flex items-center gap-1"><FiCalendar /> {booking.date?.slice(0,10)}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-500 block mb-1">الوقت</span>
              <span className="font-bold text-[#2B151F] flex items-center gap-1"><FiClock /> {booking.timeSlotLabel || 'غير محدد'}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-xs font-bold text-slate-500 block mb-1">العنوان</span>
            <span className="font-bold text-[#2B151F] flex items-center gap-1"><FiMapPin /> {booking.address || booking.city || 'غير محدد'}</span>
            {(booking.address || booking.city) && (
               <a href={`https://maps.google.com/?q=${encodeURIComponent(booking.address || booking.city)}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 font-bold mt-1 inline-block hover:underline">فتح في الخرائط</a>
            )}
          </div>

          <div className="bg-rose-50 p-3 rounded-xl border border-rose-100">
            <span className="text-xs font-bold text-[#8E717D] block mb-1">الخدمات المطلوبة</span>
            <ul className="list-disc list-inside font-bold text-[#2B151F] space-y-1">
              {booking.items?.length > 0 ? booking.items.map((it, idx) => (
                <li key={idx}>{it.service?.titleAr || it.titleAr || 'خدمة'}</li>
              )) : <li>لا توجد تفاصيل للخدمة</li>}
            </ul>
          </div>

          {booking.notes && (
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
              <span className="text-xs font-bold text-amber-700 block mb-1">ملاحظات العميلة</span>
              <p className="font-bold text-amber-900 text-xs">{booking.notes}</p>
            </div>
          )}

          <div className="flex justify-between items-center pt-2 border-t border-rose-50">
            <span className="text-xs font-bold text-[#8E717D]">إجمالي السعر</span>
            <span className="font-black text-lg text-emerald-600 flex items-center gap-1"><FiDollarSign /> {booking.totalPrice} ر.س</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SpecialistBookingModal;
