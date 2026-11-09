import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiPhone,
  FiUser,
  FiCheckCircle,
  FiDollarSign,
  FiStar,
  FiAlertCircle,
  FiNavigation,
  FiLogOut,
  FiFilter,
  FiTrendingUp,
  FiAward,
} from 'react-icons/fi';
import { FaWhatsapp, FaCrown } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import { useLanguage } from '../context/LanguageContext';

const StaffDashboardPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { bookings, updateBookingStatus, staffList, toggleStaffVacation } = useAdmin();
  const { lang } = useLanguage();

  const [filterTab, setFilterTab] = useState('all');

  const activeStaff =
    user?.role === 'staff'
      ? staffList.find((s) => s.id === user.id) || staffList[0]
      : staffList[0];

  const staffBookings = bookings.filter((b) => b.specialistId === activeStaff.id);
  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookings = staffBookings.filter((b) => b.date === todayStr);
  const activeSessions = staffBookings.filter((b) =>
    ['confirmed', 'on_way', 'in_progress'].includes(b.status)
  );
  const completedSessions = staffBookings.filter((b) => b.status === 'completed');

  const displayedBookings = staffBookings.filter((b) => {
    if (filterTab === 'today') return b.date === todayStr;
    if (filterTab === 'active') return ['confirmed', 'on_way', 'in_progress'].includes(b.status);
    if (filterTab === 'completed') return b.status === 'completed';
    return true;
  });

  const totalEarnedCommissions = completedSessions.reduce(
    (sum, b) => sum + (b.commissionAmount || (b.totalPrice || 200) * 0.2),
    0
  );

  const handleUpdateStatus = (bookingId, newStatus) => {
    updateBookingStatus(bookingId, newStatus);
    if (newStatus === 'completed') {
      alert('🎉 تم إنهاء الجلسة بنجاح وإضافة عمولتك لرصيدك!');
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFF5F7] via-[#FFF9FA] to-white">
      <div className="max-w-6xl mx-auto">
        {/* Top Staff Identity Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-100 mb-8 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="relative">
                <img
                  src={activeStaff.avatar}
                  alt={activeStaff.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-4 border-rose-100 shadow-lg"
                />
                <span
                  className={`absolute bottom-0 end-0 w-5 h-5 rounded-full border-2 border-white ${
                    activeStaff.status === 'available'
                      ? 'bg-emerald-500'
                      : activeStaff.status === 'busy'
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-[#2B151F]">
                    {activeStaff.name}
                  </h1>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-50 text-[#CF3A69] border border-rose-200">
                    {activeStaff.role}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[#5A3F4B] font-bold">
                  <span className="flex items-center gap-1">
                    <FiMapPin className="text-[#CF3A69]" />
                    <span>{activeStaff.city}</span>
                  </span>
                  <span className="flex items-center gap-1 text-amber-500">
                    <FiStar className="fill-amber-400" />
                    <span>{activeStaff.rating} ({activeStaff.reviewsCount} تقييم)</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <FiClock className="text-[#CF3A69]" />
                    <span>الدوام: {activeStaff.shift}</span>
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {activeStaff.specialties?.map((spec, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#FFF0F3] text-[#CF3A69]"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => toggleStaffVacation(activeStaff.id)}
                className={`px-4 py-3 rounded-2xl text-xs font-black border transition-all ${
                  activeStaff.status === 'on_leave'
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                }`}
              >
                {activeStaff.status === 'on_leave' ? '🏖️ في إجازة (انقري للعودة)' : '🟢 جاهزة لاستقبال الجلسات'}
              </button>

              <button
                onClick={logout}
                className="px-4 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-[#CF3A69] text-xs font-bold border border-rose-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <FiLogOut />
                <span>خروج</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-md">
            <span className="text-[11px] font-black text-[#8E717D] block mb-1">مواعيد اليوم</span>
            <div className="text-2xl font-black text-[#2B151F]">{todayBookings.length}</div>
            <span className="text-[10px] font-bold text-rose-500 mt-1 block">
              {todayBookings.length > 0 ? 'جلسات مجدولة لليوم' : 'لا توجد جلسات اليوم'}
            </span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-md">
            <span className="text-[11px] font-black text-[#8E717D] block mb-1">الجلسات النشطة</span>
            <div className="text-2xl font-black text-blue-700">{activeSessions.length}</div>
            <span className="text-[10px] font-bold text-blue-500 mt-1 block">
              قيد التنفيذ أو في الطريق
            </span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-md">
            <span className="text-[11px] font-black text-[#8E717D] block mb-1">عمولات هذا الشهر</span>
            <div className="text-2xl font-black text-emerald-700">
              {totalEarnedCommissions.toFixed(0)} ر.س
            </div>
            <span className="text-[10px] font-bold text-emerald-600 mt-1 block">
              نسبتك: {activeStaff.commissionRate}%
            </span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-md">
            <span className="text-[11px] font-black text-[#8E717D] block mb-1">الجلسات المنجزة</span>
            <div className="text-2xl font-black text-purple-700">
              {activeStaff.completedBookingsCount + completedSessions.length}
            </div>
            <span className="text-[10px] font-bold text-purple-500 mt-1 block">
              تقييم فندقي 5.0 ⭐
            </span>
          </div>
        </div>

        {/* Schedule & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-black text-[#2B151F] flex items-center gap-2">
              <FiCalendar className="text-[#CF3A69]" />
              <span>جدول المواعيد والعميلات المسندة إليكِ</span>
            </h2>
            <p className="text-xs text-[#8E717D] mt-0.5">
              تابعي حالة كل موعد وحدثي مسار وصولك للعميلة بضغطة زر
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-rose-100 shadow-sm overflow-x-auto">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterTab === 'all'
                  ? 'bg-[#CF3A69] text-white shadow-sm'
                  : 'text-[#5A3F4B] hover:bg-rose-50'
              }`}
            >
              الكل ({staffBookings.length})
            </button>
            <button
              onClick={() => setFilterTab('today')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterTab === 'today'
                  ? 'bg-[#CF3A69] text-white shadow-sm'
                  : 'text-[#5A3F4B] hover:bg-rose-50'
              }`}
            >
              اليوم ({todayBookings.length})
            </button>
            <button
              onClick={() => setFilterTab('active')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterTab === 'active'
                  ? 'bg-[#CF3A69] text-white shadow-sm'
                  : 'text-[#5A3F4B] hover:bg-rose-50'
              }`}
            >
              نشطة ({activeSessions.length})
            </button>
            <button
              onClick={() => setFilterTab('completed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterTab === 'completed'
                  ? 'bg-[#CF3A69] text-white shadow-sm'
                  : 'text-[#5A3F4B] hover:bg-rose-50'
              }`}
            >
              المكتملة ({completedSessions.length})
            </button>
          </div>
        </div>

        {/* Appointment Cards */}
        <div className="space-y-4">
          {displayedBookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-rose-100">
              <p className="text-xs font-bold text-[#8E717D]">
                لا توجد مواعيد في هذا التصنيف حالياً
              </p>
            </div>
          ) : (
            displayedBookings.map((booking) => {
              const commissionVal =
                booking.commissionAmount || (booking.totalPrice || 200) * (activeStaff.commissionRate / 100);

              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-3xl p-6 shadow-md border border-rose-100/90 relative overflow-hidden transition-all hover:shadow-lg"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-rose-100">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-rose-50 text-[#CF3A69] border border-rose-200">
                          {booking.bookingNumber}
                        </span>
                        <span className="text-xs font-black text-[#2B151F]">
                          العميلة: {booking.customerName}
                        </span>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            booking.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : booking.status === 'in_progress'
                              ? 'bg-purple-50 text-purple-700 animate-pulse'
                              : booking.status === 'on_way'
                              ? 'bg-blue-50 text-blue-700 animate-pulse'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {booking.status === 'completed'
                            ? 'مكتمل بنجاح'
                            : booking.status === 'in_progress'
                            ? 'الجلسة جارية'
                            : booking.status === 'on_way'
                            ? 'في الطريق'
                            : 'مؤكد'}
                        </span>
                      </div>

                      <p className="text-xs text-[#5A3F4B] font-bold">
                        {booking.services?.map((s) => s.title).join(' + ')}
                      </p>

                      {booking.notes && (
                        <div className="mt-2 text-[11px] p-2 rounded-xl bg-amber-50/70 text-amber-900 border border-amber-200/50 max-w-xl">
                          <span className="font-black">ملاحظات العميلة:</span> {booking.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-[#5A3F4B]">
                      <div>
                        <span className="text-[10px] text-[#8E717D] block font-bold">التاريخ والوقت:</span>
                        <span className="font-black text-[#2B151F]">
                          {booking.date} ({booking.timeSlot})
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-[#8E717D] block font-bold">الحي والعنوان:</span>
                        <span className="font-black text-[#2B151F]">
                          {booking.city} - {booking.district || 'غير محدد'}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                        <span className="text-[10px] text-emerald-800 block font-bold">عمولتك:</span>
                        <span className="font-black text-emerald-700 text-sm">
                          +{commissionVal.toFixed(1)} ر.س
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${booking.customerPhone}`}
                        className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#CF3A69] text-xs font-bold border border-rose-200 flex items-center gap-1.5 transition-colors"
                      >
                        <FiPhone />
                        <span dir="ltr">{booking.customerPhone}</span>
                      </a>

                      <a
                        href={`https://wa.me/966${booking.customerPhone.replace(/^0/, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5 transition-colors"
                      >
                        <FaWhatsapp className="text-emerald-600" />
                        <span>واتساب العميلة</span>
                      </a>

                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(
                          `${booking.city} ${booking.district} ${booking.address || ''}`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 flex items-center gap-1.5 transition-colors"
                      >
                        <FiNavigation />
                        <span>خريطة الموقع</span>
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(booking.id, 'on_way')}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-all"
                        >
                          <span>🚗 أنا في الطريق للعميلة</span>
                        </button>
                      )}

                      {booking.status === 'on_way' && (
                        <button
                          onClick={() => handleUpdateStatus(booking.id, 'in_progress')}
                          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-all"
                        >
                          <span>💆‍♀️ وصلت وبدأت الجلسة</span>
                        </button>
                      )}

                      {booking.status === 'in_progress' && (
                        <button
                          onClick={() => handleUpdateStatus(booking.id, 'completed')}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-all"
                        >
                          <span>✅ تم إنهاء الجلسة بنجاح</span>
                        </button>
                      )}

                      {booking.status === 'completed' && (
                        <span className="text-xs font-black text-emerald-700 flex items-center gap-1">
                          <FiCheckCircle />
                          <span>الجلسة منجزة ومسجلة في رصيدك</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboardPage;
