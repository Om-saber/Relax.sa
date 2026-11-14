import React, { useState } from 'react';
import { FiCalendar, FiClock, FiMapPin, FiPhone, FiCheckCircle, FiDollarSign, FiBell, FiActivity, FiNavigation } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import SpecialistBookingModal from './SpecialistBookingModal';


const formatDate = (val) => val ? new Date(val).toLocaleDateString('ar-SA', { timeZone: 'UTC' }) : 'غير محدد';
const SpecialistOverview = ({ bookings, updateBookingStatus, user }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const getArabicStatus = (status) => {
    switch(status?.toUpperCase()) {
      case 'PENDING': return 'قيد الانتظار';
      case 'CONFIRMED': return 'مؤكد';
      case 'ON_WAY': return 'في الطريق';
      case 'IN_PROGRESS': return 'جلسة جارية';
      case 'COMPLETED': return 'مكتملة';
      default: return status;
    }
  };
  const [isAvailable, setIsAvailable] = useState(true);
  const todayStr = new Date().toISOString().split('T')[0];

  const activeBookings = bookings.filter(b => ['CONFIRMED', 'ON_WAY', 'IN_PROGRESS'].includes(b.status?.toUpperCase()));
  const completedBookings = bookings.filter(b => b.status?.toUpperCase() === 'COMPLETED');
  const todayBookings = bookings.filter(b => b.date === todayStr);

  const commissionRate = user?.commissionRate || 20;
  const totalEarnings = completedBookings.reduce((sum, b) => sum + ((Number(b.totalPrice) || 0) * (commissionRate / 100)), 0);

  const nextSession = [...activeBookings].sort((a,b) => new Date(a.date) - new Date(b.date))[0];

  return (
    <div className="space-y-6 pb-10">
      {/* Top Bar (Availability & Notifications) */}
      <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-rose-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          <span className="font-bold text-[#2B151F]">{isAvailable ? 'متاحة لاستقبال الجلسات' : 'غير متاحة (مشغولة)'}</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 bg-rose-50 rounded-xl text-[#CF3A69] hover:bg-rose-100 transition">
            <FiBell size={20} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button
            onClick={() => setIsAvailable(!isAvailable)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${isAvailable ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}
          >
            {isAvailable ? 'تسجيل إجازة / انصراف' : 'تسجيل حضور'}
          </button>
        </div>
      </div>

      {/* Hero Card: Next Session */}
      {nextSession ? (
        <div className="bg-gradient-to-r from-[#CF3A69] to-[#E65A84] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
          <h3 className="text-sm font-bold text-white/80 mb-2 flex items-center gap-2"><FiCalendar /> جلستك القادمة</h3>
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
            <div>
              <h2 className="text-2xl font-black mb-1">{nextSession.customerName}</h2>
              <p className="text-sm font-bold text-white/90 flex items-center gap-4">
                <span><FiClock className="inline mr-1"/> {nextSession.date?.slice(0, 10)}</span>
                <span><FiMapPin className="inline mr-1"/> {nextSession.cityName || nextSession.city || 'غير محدد'}</span>
              </p>
            </div>
            <div className="flex gap-2">
              {nextSession.customerPhone && (
                <a href={`https://wa.me/${nextSession.customerPhone}`} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl font-bold text-sm transition-all flex items-center gap-2">
                  <FaWhatsapp size={18} /> تواصل
                </a>
              )}
              {nextSession.status === 'CONFIRMED' && (
                <button onClick={() => updateBookingStatus(nextSession.id, 'ON_WAY')} className="px-4 py-2 bg-white text-[#CF3A69] rounded-xl font-bold text-sm shadow-md hover:bg-rose-50 transition-all flex items-center gap-2">
                  <FiNavigation /> في الطريق
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-3xl border border-rose-100 shadow-sm text-center">
          <FiCalendar size={40} className="mx-auto text-rose-200 mb-2"/>
          <p className="font-bold text-[#8E717D]">لا توجد جلسات قادمة حالياً</p>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-sm flex flex-col justify-center">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-[#8E717D]">المحفظة (العمولات)</span>
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center"><FiDollarSign /></div>
          </div>
          <div className="text-2xl font-black text-[#2B151F]">{totalEarnings.toFixed(1)} <span className="text-sm text-[#8E717D]">ر.س</span></div>
          <span className="text-[10px] text-[#8E717D] mt-1">من {completedBookings.length} جلسة مكتملة</span>
        </div>
         <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-sm flex flex-col justify-center">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-[#8E717D]">الجلسات المكتملة</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><FiCheckCircle /></div>
          </div>
          <div className="text-2xl font-black text-[#2B151F]">{completedBookings.length}</div>
        </div>
         <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-sm flex flex-col justify-center">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-[#8E717D]">الجلسات النشطة</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><FiActivity /></div>
          </div>
          <div className="text-2xl font-black text-[#2B151F]">{activeBookings.length}</div>
        </div>
         <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-sm flex flex-col justify-center">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-[#8E717D]">مواعيد اليوم</span>
            <div className="w-8 h-8 rounded-full bg-rose-50 text-[#CF3A69] flex items-center justify-center"><FiCalendar /></div>
          </div>
          <div className="text-2xl font-black text-[#2B151F]">{todayBookings.length}</div>
        </div>
      </div>

      {/* Recent Bookings Feed */}
      <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-black text-[#2B151F] flex items-center gap-2">
            <FiClock className="text-[#CF3A69]" />
            <span>أحدث الحجوزات المسندة إليك</span>
          </h3>
        </div>
        <div className="space-y-3">
          {bookings.slice(0, 5).map((b) => (
            <div key={b.id} onClick={() => setSelectedBooking(b)} className="p-4 rounded-2xl bg-[#FFF9FA] border border-rose-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-sm cursor-pointer hover:border-[#CF3A69] transition-all">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-black text-[#CF3A69] bg-rose-100/50 px-2 py-0.5 rounded-md text-xs">{b.bookingNumber}</span>
                  <span className="font-bold text-[#2B151F]">{b.customerName}</span>
                  <span className="text-[10px] bg-rose-50 text-[#CF3A69] px-2 py-0.5 rounded-full font-bold border border-rose-100">{getArabicStatus(b.status)}</span>
                </div>
                <p className="text-[11px] text-[#5A3F4B] font-bold mt-1">
                  {(b.services || b.items || []).map(s => s.titleAr || s.service?.titleAr).filter(Boolean).join(' • ') || 'خدمة غير محددة'}
                </p>
                <p className="text-[11px] text-[#8E717D] font-bold flex items-center gap-3 mt-1">
                  <span><FiCalendar className="inline mr-1"/> {b.date?.slice(0, 10)}</span>
                  {b.customerPhone && <span><FiPhone className="inline mr-1"/> {b.customerPhone}</span>}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {b.customerPhone && (
                  <a href={`https://wa.me/${b.customerPhone}`} target="_blank" rel="noreferrer" className="p-2 bg-[#25D366]/10 text-[#25D366] rounded-lg hover:bg-[#25D366]/20 transition">
                    <FaWhatsapp size={16} />
                  </a>
                )}
                {(b.address || b.city) && (
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(b.address || b.city)}`} target="_blank" rel="noreferrer" className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                    <FiMapPin size={16} />
                  </a>
                )}
                <div className="ml-2 pl-2 border-r border-rose-200">
                  {b.status === 'CONFIRMED' && <button onClick={() => updateBookingStatus(b.id, 'ON_WAY')} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700">في الطريق</button>}
                  {b.status === 'ON_WAY' && <button onClick={() => updateBookingStatus(b.id, 'IN_PROGRESS')} className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700">بدأت</button>}
                  {b.status === 'IN_PROGRESS' && <button onClick={() => updateBookingStatus(b.id, 'COMPLETED')} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700">إنهاء</button>}
                  {b.status === 'COMPLETED' && <span className="text-xs font-bold text-emerald-600">مكتملة ✅</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Notifications Dropdown */}
      {showNotifications && (
        <>
          {/* طبقة شفافة تغطي الشاشة عشان تقفل القائمة لما تدوس برا */}
          <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
          
          <div className="absolute top-20 left-4 w-72 bg-white rounded-2xl shadow-xl border border-rose-100 z-50 p-2">
            <div className="p-2 border-b border-rose-50 mb-1 flex justify-between items-center">
              <h4 className="font-black text-sm text-[#2B151F]">الإشعارات</h4>
              <button onClick={() => setShowNotifications(false)} className="text-xs text-[#CF3A69] font-bold hover:underline">إغلاق</button>
            </div>
            {bookings.slice(0, 3).map((b, i) => (
              <div key={i} className="p-2 hover:bg-rose-50 rounded-xl transition cursor-pointer">
                <p className="text-xs font-bold text-[#2B151F]">تم إسناد حجز جديد ({b.bookingNumber})</p>
                <p className="text-[10px] text-[#8E717D]">{b.date?.slice(0,10)}</p>
              </div>
            ))}
            {bookings.length === 0 && <p className="p-4 text-center text-xs font-bold text-[#8E717D]">لا توجد إشعارات</p>}
          </div>
        </>
      )}

      {/* Booking Details Modal */}
      <SpecialistBookingModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
    </div>
  );
};
export default SpecialistOverview;
