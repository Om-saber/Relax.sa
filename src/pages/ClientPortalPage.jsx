import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiPhone,
  FiUser,
  FiCheckCircle,
  FiRefreshCw,
  FiEdit2,
  FiX,
  FiShield,
  FiLogOut,
} from 'react-icons/fi';
import { FaWhatsapp, FaCrown } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';
import { useMyBookings } from '../hooks/useBookings';
import { adaptBookings } from '../api/bookingAdapter';
import { bookingsApi } from '../api/bookingsApi';
import { paymentsApi } from '../api/paymentsApi';
import { useAdmin } from '../context/AdminContext';
import { useBooking } from '../context/BookingContext';
import { useLanguage } from '../context/LanguageContext';
import { TIME_SLOTS } from '../data/servicesData';

const ClientPortalPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const { bookings: mockBookings, cancelBooking, rescheduleBooking } = useAdmin();
  const { bookings: apiBookings, loading: bookingsLoading, error: bookingsError, refetch: refetchBookings } = useMyBookings();

  // API is source of truth. Mock is used ONLY if API errored.
  const bookings = bookingsLoading
    ? []
    : bookingsError
      ? mockBookings
      : adaptBookings(apiBookings);
  const { setIsBookingModalOpen } = useBooking();
  const { lang } = useLanguage();

  const [lookupPhone, setLookupPhone] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [payingBookingId, setPayingBookingId] = useState(null);
  const [paymentNotice, setPaymentNotice] = useState(null);
  
  const [rescheduleModal, setRescheduleModal] = useState({
    isOpen: false,
    booking: null,
    newDate: '',
    newSlot: '',
    error: '',
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    city: user?.city || 'الرياض',
    district: user?.district || '',
    address: user?.address || '',
  });

  const currentPhone = user?.phone || lookupPhone;

  const clientBookings = bookings.filter((b) => {
    if (!currentPhone) return false;
    const cleanCurrent = currentPhone.replace(/\D/g, '');
    const cleanBooking = (b.customerPhone || '').replace(/\D/g, '');
    return cleanBooking.includes(cleanCurrent) || cleanCurrent.includes(cleanBooking);
  });

  const upcomingBookings = clientBookings.filter(
    (b) => !['completed', 'cancelled'].includes(b.status)
  );
  const pastBookings = clientBookings.filter((b) =>
    ['completed', 'cancelled'].includes(b.status)
  );

  // Auto-switch to 'past' tab if no upcoming but there are past bookings
  React.useEffect(() => {
    if (!bookingsLoading && upcomingBookings.length === 0 && pastBookings.length > 0 && activeTab === 'upcoming') {
      setActiveTab('history');
    }
  }, [bookingsLoading, upcomingBookings.length, pastBookings.length, activeTab]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return { label: 'مؤكد وجاري التجهيز', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'on_way':
        return { label: 'الأخصائية في طريقها إليكِ 🚗', color: 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse' };
      case 'in_progress':
        return { label: 'الجلسة جارية الآن 💆‍♀️', color: 'bg-purple-50 text-purple-700 border-purple-200 animate-pulse' };
      case 'completed':
        return { label: 'مكتمل بنجاح ✨', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' };
      case 'cancelled':
        return { label: 'ملغي', color: 'bg-rose-50 text-rose-700 border-rose-200' };
      case 'pending':
      default:
        return { label: 'قيد المراجعة والتأكيد', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
  };

  const getProgressStepIndex = (status) => {
    if (status === 'pending') return 0;
    if (status === 'confirmed') return 1;
    if (status === 'on_way') return 2;
    if (status === 'in_progress') return 3;
    if (status === 'completed') return 4;
    return 0;
  };

  const handleOpenReschedule = (booking) => {
    setRescheduleModal({
      isOpen: true,
      booking,
      newDate: booking.date,
      newSlot: booking.timeSlot,
      error: '',
    });
  };

  const handleConfirmReschedule = () => {
    if (!rescheduleModal.newDate || !rescheduleModal.newSlot) {
      setRescheduleModal((prev) => ({ ...prev, error: 'يرجى اختيار التاريخ والوقت الجديد' }));
      return;
    }

    const res = rescheduleBooking(
      rescheduleModal.booking.id,
      rescheduleModal.newDate,
      rescheduleModal.newSlot
    );

    if (res.success) {
      setRescheduleModal({ isOpen: false, booking: null, newDate: '', newSlot: '', error: '' });
      alert('تمت إعادة جدولة موعدك بنجاح! 🌸');
    } else {
      setRescheduleModal((prev) => ({ ...prev, error: res.error }));
    }
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('هل أنتِ متأكدة من رغبتك بإلغاء هذا الموعد؟')) {
      cancelBooking(bookingId, 'إلغاء من خلال صفحة العميل');
    }
  };

  const handlePayWithPayPal = async (booking) => {
    setPaymentNotice(null);
    setPayingBookingId(booking.id);

    try {
      const data = await paymentsApi.createPayPalOrder(booking.id);

      // طلب سابق تم تأكيده/تحصيله بالفعل
      if (data?.alreadyPaid || data?.captured) {
        await refetchBookings();
        setPaymentNotice({
          type: 'success',
          text: data?.captured
            ? 'تم تأكيد دفعتكِ بنجاح ✅'
            : 'هذا الحجز مدفوع بالفعل ✅',
        });
        return;
      }

      if (!data?.approvalUrl) {
        throw new Error('تعذّر الحصول على رابط الدفع من PayPal. حاولي مرة أخرى.');
      }

      // الانتقال إلى صفحة الموافقة على PayPal
      window.location.href = data.approvalUrl;
    } catch (err) {
      setPaymentNotice({
        type: 'error',
        text: err?.message || 'تعذّر بدء عملية الدفع. حاولي مرة أخرى.',
      });
    } finally {
      setPayingBookingId(null);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUser(profileForm);
    setIsEditingProfile(false);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFF5F7] via-[#FFF9FA] to-white">
      <div className="max-w-5xl mx-auto">
        {/* Welcome & Profile Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-100/80 mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative">
                <img
                  src={
                    user?.avatar ||
                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'
                  }
                  alt={user?.name || 'Client'}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#CF3A69] shadow-md shadow-rose-200"
                />
                <span className="absolute -bottom-1 -right-1 p-1 bg-amber-400 text-white rounded-full text-xs shadow-sm">
                  <FaCrown />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-[#2B151F]">
                    {lang === 'ar' ? 'مرحباً بكِ،' : 'Welcome,'}{' '}
                    {user?.name || (currentPhone ? `عميلة ريلاكس` : 'ضيفتنا الكريمة')} 🌸
                  </h1>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-50 text-[#CF3A69] border border-rose-200">
                    {user?.roleTitle || 'عميلة مميزة'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 text-xs text-[#5A3F4B] font-bold">
                  {currentPhone && (
                    <span className="flex items-center gap-1">
                      <FiPhone className="text-[#CF3A69]" />
                      <span dir="ltr">{currentPhone}</span>
                    </span>
                  )}
                  {user?.city && (
                    <span className="flex items-center gap-1">
                      <FiMapPin className="text-[#CF3A69]" />
                      <span>{user.city} {user.district ? `- ${user.district}` : ''}</span>
                    </span>
                  )}
                  {isAuthenticated && (
                    <button
                      onClick={() => {
                        setProfileForm({
                          name: user?.name || '',
                          phone: user?.phone || '',
                          city: user?.city || 'الرياض',
                          district: user?.district || '',
                          address: user?.address || '',
                        });
                        setIsEditingProfile(true);
                      }}
                      className="text-[#CF3A69] hover:underline flex items-center gap-1"
                    >
                      <FiEdit2 />
                      <span>تعديل البيانات</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#CF3A69] via-[#E65A84] to-[#CF3A69] text-white font-black text-xs sm:text-sm shadow-lg shadow-rose-300/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <FaCrown className="text-amber-300" />
                <span>حجز جلسة استرخاء جديدة</span>
              </button>

              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="px-4 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-[#CF3A69] text-xs font-bold border border-rose-200 transition-colors flex items-center gap-1.5"
                >
                  <FiLogOut />
                  <span>خروج</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-3 rounded-2xl bg-white hover:bg-rose-50 text-[#CF3A69] text-xs font-bold border border-rose-200 shadow-sm transition-colors"
                >
                  تسجيل دخول
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Guest phone lookup */}
        {!currentPhone && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-rose-100 mb-8 text-center max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#CF3A69] flex items-center justify-center text-xl mx-auto mb-3">
              <FiPhone />
            </div>
            <h3 className="text-base font-black text-[#2B151F]">
              استعراض مواعيدكِ برقم الجوال
            </h3>
            <p className="text-xs text-[#8E717D] mt-1 mb-4">
              أدخلي رقم الجوال المسجل به الحجز لمتابعة حالة أخصائيتك ومواعيدك فوراً
            </p>
            <div className="flex gap-2">
              <input
                type="tel"
                placeholder="05X XXX XXXX"
                value={lookupPhone}
                onChange={(e) => setLookupPhone(e.target.value)}
                className="flex-1 px-4 py-3 rounded-2xl bg-[#FFF9FA] border border-rose-200 outline-none text-xs font-bold"
              />
              <button
                type="button"
                className="px-5 py-3 rounded-2xl bg-[#CF3A69] text-white text-xs font-bold"
              >
                بحث
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-rose-100 pb-3">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 ${
              activeTab === 'upcoming'
                ? 'bg-[#CF3A69] text-white shadow-md shadow-rose-300/30'
                : 'bg-white text-[#5A3F4B] hover:bg-rose-50 border border-rose-100'
            }`}
          >
            <FiCalendar />
            <span>المواعيد القادمة والحالية</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeTab === 'upcoming' ? 'bg-white/20 text-white' : 'bg-rose-100 text-[#CF3A69]'
              }`}
            >
              {upcomingBookings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-[#CF3A69] text-white shadow-md shadow-rose-300/30'
                : 'bg-white text-[#5A3F4B] hover:bg-rose-50 border border-rose-100'
            }`}
          >
            <FiRefreshCw />
            <span>سجل الجلسات السابقة</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeTab === 'history' ? 'bg-white/20 text-white' : 'bg-rose-100 text-[#CF3A69]'
              }`}
            >
              {pastBookings.length}
            </span>
          </button>
        </div>

        {paymentNotice && (
          <div
            className={`mb-5 flex items-start justify-between gap-3 text-xs font-bold px-4 py-3 rounded-2xl border ${
              paymentNotice.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            <span className="leading-relaxed">{paymentNotice.text}</span>
            <button
              type="button"
              onClick={() => setPaymentNotice(null)}
              className="shrink-0 hover:opacity-70"
              aria-label="إغلاق"
            >
              <FiX />
            </button>
          </div>
        )}

        {/* UPCOMING APPOINTMENTS */}
        {activeTab === 'upcoming' && (
          <div className="space-y-6">
            {upcomingBookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-rose-100 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-[#CF3A69] flex items-center justify-center text-2xl mx-auto mb-4">
                  <FiCalendar />
                </div>
                <h3 className="text-base font-black text-[#2B151F]">
                  لا توجد حجوزات حالية قادمة
                </h3>
                <p className="text-xs text-[#8E717D] max-w-sm mx-auto mt-1 mb-5">
                  دللي نفسكِ الآن واختاري من بين باقات المساج الفاخر والحمام المغربي في راحة منزلك
                </p>
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="px-6 py-3 rounded-2xl bg-[#CF3A69] text-white text-xs font-black shadow-md hover:bg-[#b02652]"
                >
                  احجزي جلستكِ الأولى الآن 🌸
                </button>
              </div>
            ) : (
              upcomingBookings.map((booking) => {
                const statusBadge = getStatusBadge(booking.status);
                const stepIdx = getProgressStepIndex(booking.status);

                return (
                  <div
                    key={booking.id}
                    className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-100/90 relative overflow-hidden"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-rose-100">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-[#FFF0F3] text-[#CF3A69] border border-rose-200">
                          {booking.bookingNumber}
                        </span>
                        <span className="text-xs text-[#8E717D]">
                          حجز مؤكد عبر الموقع
                        </span>
                        {booking.paymentStatus === 'paid' && (
                          <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                            مدفوع ✅
                          </span>
                        )}
                      </div>

                      <span className={`text-xs font-black px-3 py-1.5 rounded-xl border ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                    </div>

                    {/* Progress Tracker */}
                    <div className="py-6 border-b border-rose-100">
                      <h4 className="text-xs font-black text-[#2B151F] mb-4 flex items-center gap-1.5">
                        <FiClock className="text-[#CF3A69]" />
                        <span>مسار متابعة الموعد لحظة بلحظة:</span>
                      </h4>

                      <div className="grid grid-cols-4 gap-2 relative">
                        <div className="absolute top-4 left-6 right-6 h-1 bg-rose-100 -z-0">
                          <div
                            className="h-full bg-gradient-to-r from-[#CF3A69] to-[#E65A84] transition-all duration-500"
                            style={{
                              width: `${Math.min(100, (stepIdx / 3) * 100)}%`,
                            }}
                          />
                        </div>

                        <div className="flex flex-col items-center text-center relative z-10">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                              stepIdx >= 1
                                ? 'bg-[#CF3A69] text-white shadow-md'
                                : 'bg-rose-100 text-[#8E717D]'
                            }`}
                          >
                            ✓
                          </div>
                          <span className="text-[10px] sm:text-xs font-bold text-[#2B151F] mt-1.5">
                            تأكيد الحجز
                          </span>
                        </div>

                        <div className="flex flex-col items-center text-center relative z-10">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                              stepIdx >= 2
                                ? 'bg-[#CF3A69] text-white shadow-md'
                                : 'bg-white border-2 border-rose-200 text-[#8E717D]'
                            }`}
                          >
                            🚗
                          </div>
                          <span className="text-[10px] sm:text-xs font-bold text-[#2B151F] mt-1.5">
                            في الطريق إليك
                          </span>
                        </div>

                        <div className="flex flex-col items-center text-center relative z-10">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                              stepIdx >= 3
                                ? 'bg-[#CF3A69] text-white shadow-md'
                                : 'bg-white border-2 border-rose-200 text-[#8E717D]'
                            }`}
                          >
                            💆‍♀️
                          </div>
                          <span className="text-[10px] sm:text-xs font-bold text-[#2B151F] mt-1.5">
                            بدء الجلسة
                          </span>
                        </div>

                        <div className="flex flex-col items-center text-center relative z-10">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                              stepIdx >= 4
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'bg-white border-2 border-rose-200 text-[#8E717D]'
                            }`}
                          >
                            ✨
                          </div>
                          <span className="text-[10px] sm:text-xs font-bold text-[#2B151F] mt-1.5">
                            اكتمال الدلال
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-5">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FFF9FA] border border-rose-100/70">
                          <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#CF3A69] flex items-center justify-center text-lg shrink-0">
                            <FiCalendar />
                          </div>
                          <div>
                            <span className="text-[11px] text-[#8E717D] block font-bold">التاريخ المحدد:</span>
                            <span className="text-xs sm:text-sm font-black text-[#2B151F]">{booking.date}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FFF9FA] border border-rose-100/70">
                          <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#CF3A69] flex items-center justify-center text-lg shrink-0">
                            <FiClock />
                          </div>
                          <div>
                            <span className="text-[11px] text-[#8E717D] block font-bold">فترة الزيارة:</span>
                            <span className="text-xs sm:text-sm font-black text-[#2B151F]">{booking.timeSlot}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FFF9FA] border border-rose-100/70">
                          <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#CF3A69] flex items-center justify-center text-lg shrink-0">
                            <FiMapPin />
                          </div>
                          <div>
                            <span className="text-[11px] text-[#8E717D] block font-bold">عنوان الزيارة المنزلية:</span>
                            <span className="text-xs sm:text-sm font-black text-[#2B151F]">
                              {booking.city} {booking.district ? `- ${booking.district}` : ''} ({booking.address || 'العنوان المسجل'})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FFF5F7] to-[#FFF0F3] border border-rose-200/70">
                          <span className="text-[10px] font-black uppercase text-[#CF3A69] block mb-2">
                            الأخصائية المخصصة لخدمتكِ:
                          </span>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img
                                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
                                alt="Specialist"
                                className="w-12 h-12 rounded-xl object-cover border border-[#CF3A69]/30 shadow-sm"
                              />
                              <div>
                                <h5 className="text-xs sm:text-sm font-black text-[#2B151F]">
                                  {booking.specialistName || 'أخصائية ليتس ريلاكس المعتمدة'}
                                </h5>
                                <span className="text-[11px] text-[#8E717D] font-bold block">
                                  أخصائية معتمدة فندقياً
                                </span>
                              </div>
                            </div>

                            <a
                              href={`https://wa.me/966537313756?text=${encodeURIComponent(
                                `مرحباً، بخصوص موعدي رقم ${booking.bookingNumber} (${booking.date})`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-base shadow-sm"
                              title="تواصل مباشر عبر واتساب"
                            >
                              <FaWhatsapp />
                            </a>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-[#FFF9FA] border border-rose-100/70 space-y-2">
                          <span className="text-[10px] font-black uppercase text-[#8E717D] block">
                            الخدمات المطلوبة:
                          </span>
                          {booking.services?.map((svc, sIdx) => (
                            <div key={sIdx} className="flex justify-between text-xs font-bold">
                              <span className="text-[#2B151F]">
                                • {svc.title} {svc.quantity > 1 ? `(×${svc.quantity})` : ''}
                              </span>
                              <span className="text-[#CF3A69]">{svc.price * (svc.quantity || 1)} ر.س</span>
                            </div>
                          ))}
                          <div className="flex justify-between text-xs font-black pt-2 border-t border-rose-100 text-[#2B151F]">
                            <span>المجموع الإجمالي:</span>
                            <span className="text-sm text-[#CF3A69]">{booking.totalPrice} ر.س</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-rose-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs text-[#8E717D]">
                        <FiShield className="text-[#CF3A69]" />
                        <span>معايير تعقيم فندقية وأدوات استخدام لمرة واحدة</span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {booking.paymentStatus !== 'paid' && (
                          <button
                            onClick={() => handlePayWithPayPal(booking)}
                            disabled={payingBookingId === booking.id}
                            className="px-4 py-2 rounded-xl bg-[#0070BA] hover:bg-[#005c99] disabled:opacity-60 disabled:cursor-wait text-white text-xs font-black shadow-sm transition-colors"
                          >
                            {payingBookingId === booking.id
                              ? 'جاري التحويل إلى PayPal...'
                              : 'ادفعي الآن عبر PayPal'}
                          </button>
                        )}

                        {booking.status !== 'in_progress' && (
                          <button
                            onClick={() => handleOpenReschedule(booking)}
                            className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#CF3A69] text-xs font-black border border-rose-200 transition-colors"
                          >
                            إعادة جدولة الموعد
                          </button>
                        )}

                        {booking.status === 'pending' || booking.status === 'confirmed' ? (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="px-3 py-2 rounded-xl text-rose-500 hover:bg-rose-50 text-xs font-bold transition-colors"
                          >
                            إلغاء الموعد
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* PAST BOOKINGS */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {pastBookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-rose-100">
                <p className="text-xs font-bold text-[#8E717D]">
                  لا يوجد سجل حجوزات سابقة حتى الآن
                </p>
              </div>
            ) : (
              pastBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl p-5 border border-rose-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#2B151F]">
                        {booking.bookingNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          booking.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {booking.status === 'completed' ? 'مكتمل بنجاح' : 'تم الإلغاء'}
                      </span>
                      <span className="text-xs text-[#8E717D]">({booking.date})</span>
                    </div>

                    <p className="text-xs text-[#5A3F4B] font-bold">
                      {booking.services?.map((s) => s.title).join(' + ')}
                    </p>

                    <div className="text-[11px] text-[#8E717D] flex items-center gap-3">
                      <span>الأخصائية: {booking.specialistName || 'ليتس ريلاكس'}</span>
                      <span>•</span>
                      <span>المبلغ: {booking.totalPrice} ر.س</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#CF3A69] to-[#E65A84] text-white text-xs font-black shadow-sm flex items-center gap-1.5"
                  >
                    <FiRefreshCw className="text-xs" />
                    <span>إعادة الحجز</span>
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* RESCHEDULE MODAL */}
        <AnimatePresence>
          {rescheduleModal.isOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setRescheduleModal({ isOpen: false, booking: null, newDate: '', newSlot: '', error: '' })}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              />

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-rose-100 z-10"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-black text-[#2B151F]">إعادة جدولة الموعد</h3>
                  <button
                    onClick={() => setRescheduleModal({ isOpen: false, booking: null, newDate: '', newSlot: '', error: '' })}
                    className="p-1.5 rounded-full hover:bg-rose-50 text-[#8E717D]"
                  >
                    <FiX />
                  </button>
                </div>

                {rescheduleModal.error && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                    {rescheduleModal.error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-black text-[#2B151F] block mb-1">التاريخ الجديد:</label>
                    <input
                      type="date"
                      value={rescheduleModal.newDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) =>
                        setRescheduleModal((prev) => ({ ...prev, newDate: e.target.value, error: '' }))
                      }
                      className="w-full px-4 py-3 rounded-2xl bg-[#FFF9FA] border border-rose-200 outline-none text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-[#2B151F] block mb-1">الفترة الزمنية المناسبة:</label>
                    <select
                      value={rescheduleModal.newSlot}
                      onChange={(e) =>
                        setRescheduleModal((prev) => ({ ...prev, newSlot: e.target.value, error: '' }))
                      }
                      className="w-full px-4 py-3 rounded-2xl bg-[#FFF9FA] border border-rose-200 outline-none text-xs font-bold"
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot.id} value={slot.time}>
                          {slot.time} ({slot.period})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={handleConfirmReschedule}
                      className="flex-1 py-3 rounded-2xl bg-[#CF3A69] text-white text-xs font-black shadow-md hover:bg-[#b02652]"
                    >
                      تأكيد الموعد الجديد
                    </button>
                    <button
                      type="button"
                      onClick={() => setRescheduleModal({ isOpen: false, booking: null, newDate: '', newSlot: '', error: '' })}
                      className="px-4 py-3 rounded-2xl bg-rose-50 text-[#5A3F4B] text-xs font-bold hover:bg-rose-100"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* EDIT PROFILE MODAL */}
        <AnimatePresence>
          {isEditingProfile && (
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsEditingProfile(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              />

              <motion.form
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onSubmit={handleSaveProfile}
                className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-rose-100 z-10 space-y-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-base font-black text-[#2B151F]">تعديل بيانات العميلة</h3>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="p-1.5 rounded-full hover:bg-rose-50 text-[#8E717D]"
                  >
                    <FiX />
                  </button>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#2B151F] block mb-1">الاسم الكامل</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9FA] border border-rose-200 outline-none text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#2B151F] block mb-1">المدينة</label>
                  <select
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9FA] border border-rose-200 outline-none text-xs font-bold"
                  >
                    <option value="الرياض">الرياض</option>
                    <option value="الخبر">الخبر</option>
                    <option value="الدمام">الدمام</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#2B151F] block mb-1">الحي</label>
                  <input
                    type="text"
                    value={profileForm.district}
                    placeholder="مثال: حي الملقا"
                    onChange={(e) => setProfileForm({ ...profileForm, district: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9FA] border border-rose-200 outline-none text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#2B151F] block mb-1">العنوان بالتفصيل</label>
                  <input
                    type="text"
                    value={profileForm.address}
                    placeholder="اسم الشارع ورقم الفيلا / العمارة"
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9FA] border border-rose-200 outline-none text-xs font-bold"
                  />
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-2xl bg-[#CF3A69] text-white text-xs font-black shadow-md hover:bg-[#b02652]"
                  >
                    حفظ التغييرات
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-3 rounded-2xl bg-rose-50 text-[#5A3F4B] text-xs font-bold hover:bg-rose-100"
                  >
                    إلغاء
                  </button>
                </div>
              </motion.form>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ClientPortalPage;
