import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiCalendar, FiClock, FiMapPin, FiPhone, FiCheckCircle, 
  FiDollarSign, FiLogOut 
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';
import { useStaffBookings } from '../hooks/useStaffBookings';

const StaffDashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { todayBookings: apiToday, upcomingBookings: apiUpcoming, loading, updateStatus } = useStaffBookings();

  const [filterTab, setFilterTab] = useState('all');

  // تغيير المسمى الوظيفي هنا
  const activeStaff = {
    name: user?.name || 'أخصائية',
    role: 'أخصائية ليتس ريلاكس', 
    avatar: user?.avatarUrl || null,
    commissionRate: user?.commissionRate || 20,
  };

  const normalizeBooking = (b) => ({
    ...b,
    date: b.date ? String(b.date).slice(0, 10) : '',
    status: String(b.status || '').toLowerCase(),
  });

  const staffBookings = [...(apiToday || []), ...(apiUpcoming || [])]
    .filter((b, i, arr) => arr.findIndex((x) => x.id === b.id) === i)
    .map(normalizeBooking);

  const todayStr = new Date().toISOString().split('T')[0];
  
  const activeSessions = staffBookings.filter((b) => ['confirmed', 'on_way', 'in_progress'].includes(b.status));
  const completedSessions = staffBookings.filter((b) => b.status === 'completed');
  const todayBookings = staffBookings.filter((b) => b.date === todayStr);

  const displayedBookings = staffBookings.filter((b) => {
    if (filterTab === 'today') return b.date === todayStr;
    if (filterTab === 'active') return ['confirmed', 'on_way', 'in_progress'].includes(b.status);
    if (filterTab === 'completed') return b.status === 'completed';
    return true;
  });

  const handleUpdateStatus = async (bookingId, newStatus) => {
    const res = await updateStatus(bookingId, newStatus.toUpperCase());
    if (res.success) {
      if (newStatus === 'completed') {
        alert('🎉 تم إنهاء الجلسة بنجاح وإضافة عمولتك لرصيدك!');
      }
      window.location.reload(); 
    } else {
      alert('فشل تحديث الحالة: ' + (res.error || 'خطأ غير معروف'));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <span className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-full border border-amber-100">قيد الانتظار</span>;
      case 'confirmed': return <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100">مؤكد</span>;
      case 'on_way': return <span className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-bold rounded-full border border-purple-100">في الطريق</span>;
      case 'in_progress': return <span className="px-3 py-1 bg-rose-50 text-[#CF3A69] text-xs font-bold rounded-full border border-rose-100">جلسة جارية</span>;
      case 'completed': return <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100">مكتملة</span>;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9FA]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CF3A69]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9FA] font-sans text-[#2B151F] pb-12">
      {/* Top Navigation */}
      <header className="bg-white border-b border-rose-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {activeStaff.avatar ? (
              <img src={activeStaff.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover border-2 border-rose-100" />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#CF3A69] flex items-center justify-center font-bold text-xl border border-rose-100">
                {activeStaff.name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-lg font-black text-[#2B151F]">{activeStaff.name}</h1>
              <p className="text-xs font-bold text-[#8E717D]">{activeStaff.role}</p>
            </div>
          </div>
          <button 
            onClick={() => { logout(); navigate('/staff-login'); }}
            className="flex items-center gap-2 text-sm font-bold text-[#8E717D] hover:text-[#CF3A69] transition-colors bg-rose-50 px-4 py-2 rounded-xl"
          >
            <FiLogOut /> خروج
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-rose-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#8E717D] mb-1">مواعيد اليوم</p>
              <h3 className="text-3xl font-black text-[#2B151F]">{todayBookings.length}</h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-[#CF3A69]">
              <FiCalendar size={26} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-rose-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#8E717D] mb-1">الجلسات النشطة</p>
              <h3 className="text-3xl font-black text-[#2B151F]">{activeSessions.length}</h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
              <FiClock size={26} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-rose-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#8E717D] mb-1">الجلسات المنجزة</p>
              <h3 className="text-3xl font-black text-[#2B151F]">{completedSessions.length}</h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <FiCheckCircle size={26} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-rose-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#8E717D] mb-1">العمولات</p>
              <h3 className="text-3xl font-black text-[#2B151F]">0 <span className="text-sm text-[#8E717D] font-bold">ر.س</span></h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500">
              <FiDollarSign size={26} />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-3xl shadow-sm border border-rose-100 overflow-hidden">
          
          {/* Header & Tabs */}
          <div className="p-6 border-b border-rose-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-black text-[#2B151F]">جدول المواعيد</h2>
            <div className="flex bg-rose-50/50 p-1.5 rounded-2xl w-fit border border-rose-100/50">
              {['all', 'today', 'active', 'completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                    filterTab === tab ? 'bg-white text-[#CF3A69] shadow-sm' : 'text-[#8E717D] hover:text-[#2B151F]'
                  }`}
                >
                  {tab === 'all' ? 'الكل' : tab === 'today' ? 'اليوم' : tab === 'active' ? 'نشطة' : 'المكتملة'}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings List */}
          <div className="divide-y divide-rose-50">
            {displayedBookings.length === 0 ? (
              <div className="p-16 text-center text-[#8E717D]">
                <FiCalendar size={48} className="mx-auto text-rose-200 mb-4" />
                <p className="text-lg font-bold text-[#2B151F]">لا توجد حجوزات حالياً</p>
                <p className="text-sm mt-1">عندما يتم إسناد حجوزات إليك، ستظهر هنا.</p>
              </div>
            ) : (
              displayedBookings.map((booking) => (
                <div key={booking.id} className="p-6 hover:bg-rose-50/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold text-[#8E717D] bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100">{booking.bookingNumber}</span>
                      {getStatusBadge(booking.status)}
                    </div>
                    <h4 className="text-lg font-black text-[#2B151F]">{booking.customerName}</h4>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm font-bold text-[#8E717D]">
                      <span className="flex items-center gap-1.5"><FiCalendar /> {booking.date}</span>
                      <span className="flex items-center gap-1.5"><FiPhone /> {booking.customerPhone}</span>
                      {booking.address && <span className="flex items-center gap-1.5"><FiMapPin /> {booking.address}</span>}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <a 
                      href={`https://wa.me/${booking.customerPhone}`} 
                      target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#25D366]/10 text-[#25D366] rounded-xl text-sm font-bold hover:bg-[#25D366]/20 transition-colors"
                    >
                      <FaWhatsapp size={18} /> تواصل
                    </a>

                    {booking.status === 'confirmed' && (
                      <button onClick={() => handleUpdateStatus(booking.id, 'on_way')} className="px-5 py-2.5 bg-[#CF3A69] text-white rounded-xl text-sm font-bold hover:bg-rose-700 shadow-md shadow-rose-200 transition-all">
                        في الطريق
                      </button>
                    )}
                    {booking.status === 'on_way' && (
                      <button onClick={() => handleUpdateStatus(booking.id, 'in_progress')} className="px-5 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 shadow-md shadow-purple-200 transition-all">
                        بدأت الجلسة
                      </button>
                    )}
                    {booking.status === 'in_progress' && (
                      <button onClick={() => handleUpdateStatus(booking.id, 'completed')} className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all flex items-center gap-2">
                        <FiCheckCircle /> إنهاء الجلسة
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffDashboardPage;
