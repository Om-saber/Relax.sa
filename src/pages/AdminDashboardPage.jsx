import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import BookingSettingsTab from '../components/admin/BookingSettingsTab';
import StaffManagementTab from '../components/admin/StaffManagementTab';
import ServicesManagementTab from '../components/admin/ServicesManagementTab';
import CitiesManagementTab from '../components/admin/CitiesManagementTab';
import ClientsManagementTab from '../components/admin/ClientsManagementTab';
import { useAdminStaff } from '../hooks/useAdminStaff';
import { useAdminRoles } from '../hooks/useAdminRoles';
import { adminApi } from '../api/adminApi';
import { catalogApi } from '../api/catalogApi';
import RolesPermissionsTab from '../components/admin/RolesPermissionsTab';
import {
  FiGrid,
  FiCalendar,
  FiUsers,
  FiUserCheck,
  FiMapPin,
  FiPackage,
  FiLifeBuoy,
  FiBarChart2,
  FiShield,
  FiSearch,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiPhone,
  FiFileText,
  FiDownload,
  FiLogOut,
  FiRefreshCw,
  FiChevronLeft,
  FiStar,
  FiAward,
  FiMenu,
  FiX,
  FiBell,
  FiSliders,
  FiExternalLink,
  FiCheck,
  FiTag,
  FiMail,
  FiUserPlus,
  FiLock,
} from 'react-icons/fi';
import { FaCrown, FaWhatsapp } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import { useAdminBookings } from '../hooks/useAdminBookings';
import { useAdminOverview } from '../hooks/useAdminOverview';
import { useLanguage } from '../context/LanguageContext';
import { TIME_SLOTS } from '../data/servicesData';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const {
    staffList,
    clients,
    complaints,
    cityConfigs,
    servicesList,
    blackouts,
    cmsContent,
    totalRevenue,
    completedCount,
    activeCount,
    pendingCount,
    cancelledCount,
    totalCommissionsPaid,
    checkDoubleBooking,
    addBooking,
    updateBookingStatus: mockUpdateBookingStatus,
    reassignSpecialist,
    rescheduleBooking,
    cancelBooking,
    addStaff,
    updateStaff,
    deleteStaff,
    toggleStaffVacation,
    updateClient,
    addClientNote,
    addComplaint,
    updateComplaintStatus,
    updateCity,
    updateServicePrice,
    addBlackoutDate,
    removeBlackoutDate,
    updateCmsContent,
  } = useAdmin();

  // ── Admin Bookings from API (source of truth) ─────────────
  const {
    bookings: apiBookings,
    updateStatus: apiUpdateBookingStatus,
    loading: adminBookingsLoading,
    error: adminBookingsError,
    refetch: refetchBookings,
  } = useAdminBookings();

  // ── Admin Staff from API (for reassignment) ─────────────
  const { staff: apiStaffList } = useAdminStaff();

  // ── Admin Roles & Permissions from API ──────────────────
  const {
    roles: apiRoles,
    permissions: apiPermissions,
    loading: adminRolesLoading,
    togglePermission: apiTogglePermission,
  } = useAdminRoles();

  // Alias للأسماء القديمة المستخدمة في JSX
  const roles = apiRoles;
  const togglePermission = apiTogglePermission;

  // الـ API هو المصدر الوحيد للحقيقة — لا رجوع لبيانات تجريبية عند الخطأ.
  const bookings = adminBookingsLoading || adminBookingsError ? [] : apiBookings;

  const updateBookingStatus = async (id, status) => {
    const res = await apiUpdateBookingStatus(id, status);
    if (!res.success) {
      console.error('[AdminDashboard] updateBookingStatus failed:', res.error);
    }
    return res;
  };

  // ── Overview stats from API (source of truth) ─────────────
  const { overview, loading: overviewLoading } = useAdminOverview();

  // Derived values with safe fallbacks
  const displayRevenue = overview?.revenue?.total ?? 0;
  const displayTodayRevenue = overview?.revenue?.today ?? 0;
  const displayMonthRevenue = overview?.revenue?.thisMonth ?? 0;
  const displayActiveBookings = overview?.bookings?.active ?? 0;
  const displayPendingBookings = overview?.bookings?.pending ?? 0;
  const displayTotalBookings = overview?.bookings?.total ?? 0;
  const displayCompletedBookings = overview?.bookings?.completed ?? 0;
  const displayCancelledBookings = overview?.bookings?.cancelled ?? 0;
  const displayStaffAvailable = overview?.staff?.available ?? 0;
  const displayStaffTotal = overview?.staff?.total ?? 0;
  const displayCommissions = overview?.commissions?.totalPaid ?? 0;
  const displayClientsTotal = overview?.clients?.total ?? 0;

  const { lang, isRTL } = useLanguage();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Sidebar Page Tab
  const [activeTab, setActiveTab] = useState(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) return tabFromUrl;
    if (location.pathname.includes('settings') || location.pathname.includes('booking-options')) {
      return 'booking-settings';
    }
    return 'overview';
  });

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Filters & Search
  const [bookingFilterCity, setBookingFilterCity] = useState('all');
  const [adminCategories, setAdminCategories] = useState([]);

  useEffect(() => {
    catalogApi.getCategories()
      .then((data) => setAdminCategories(data || []))
      .catch((err) => console.error('categories fetch failed:', err));
  }, []);

  const [bookingFilterStatus, setBookingFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [conflictAlert, setConflictAlert] = useState(null);
  const [reassignModal, setReassignModal] = useState({ isOpen: false, booking: null, staffId: '' });
  const WEEK_DAYS = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

  const [newStaffModal, setNewStaffModal] = useState(false);
  const [staffForm, setStaffForm] = useState({
    name: '',
    role: 'أخصائية مساج وعناية',
    phone: '',
    email: '',
    city: 'الرياض',
    commissionRate: 20,
    specialties: 'المساج السويدي, الحمام المغربي الملكي',
    offDays: ['الجمعة', 'السبت'],
    isPartOfTeam: false,
  });

  const [offDaysModal, setOffDaysModal] = useState({
    isOpen: false,
    staffId: null,
    staffName: '',
    offDays: [],
  });

  const [staffSearchQuery, setStaffSearchQuery] = useState('');
  const [staffCityFilter, setStaffCityFilter] = useState('all');
  const [staffTeamFilter, setStaffTeamFilter] = useState('all');
  const [newTicketModal, setNewTicketModal] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    customerName: '',
    customerPhone: '',
    category: 'استفسار عن موعد',
    priority: 'medium',
    subject: '',
    description: '',
  });
  const [newBlackoutModal, setNewBlackoutModal] = useState(false);
  const [blackoutForm, setBlackoutForm] = useState({ title: '', date: '', city: 'الكل' });

  // Reassignment with Double-Booking check (API-backed)
  const handleConfirmReassign = async () => {
    if (!reassignModal.booking || !reassignModal.staffId) return;

    try {
      const res = await adminApi.assignBooking(
        reassignModal.booking.id,
        reassignModal.staffId,
      );
      if (res) {
        setReassignModal({ isOpen: false, booking: null, staffId: '' });
        if (refetchBookings) await refetchBookings();
        alert('تم تعيين الأخصائية بنجاح وبدون أي تعارض في الجداول! ✅');
      }
    } catch (err) {
      const msg =
        err?.code === 'DOUBLE_BOOKING' || /DOUBLE_BOOKING|محجوزة/.test(err?.message || '')
          ? '⚠️ تعارض: هذه الأخصائية محجوزة في نفس الموعد. اختاري أخصائية بديلة أو توقيتاً آخر.'
          : err?.message || 'فشل التعيين. حاولي مرة أخرى.';
      setConflictAlert(msg);
    }
  };

  // Add new staff
  const handleAddStaffSubmit = (e) => {
    e.preventDefault();
    if (!staffForm.name || !staffForm.phone) return;

    addStaff({
      name: staffForm.name,
      role: staffForm.role,
      phone: staffForm.phone,
      email: staffForm.email.trim() || `${staffForm.name.replace(/\s+/g, '.').toLowerCase()}@relax.sa`,
      city: staffForm.city,
      branches: [staffForm.city],
      commissionRate: Number(staffForm.commissionRate) || 20,
      specialties: staffForm.specialties.split(',').map((s) => s.trim()).filter(Boolean),
      offDays: staffForm.offDays.length > 0 ? staffForm.offDays : ['الجمعة', 'السبت'],
      isPartOfTeam: Boolean(staffForm.isPartOfTeam),
    });

    setStaffForm({
      name: '',
      role: 'أخصائية مساج وعناية',
      phone: '',
      email: '',
      city: 'الرياض',
      commissionRate: 20,
      specialties: 'المساج السويدي, الحمام المغربي الملكي',
      offDays: ['الجمعة', 'السبت'],
      isPartOfTeam: false,
    });
    setNewStaffModal(false);
  };

  const handleSaveOffDays = () => {
    if (offDaysModal.staffId) {
      updateStaff(offDaysModal.staffId, { offDays: offDaysModal.offDays });
      setOffDaysModal({ isOpen: false, staffId: null, staffName: '', offDays: [] });
    }
  };

  // Add new ticket
  const handleAddTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketForm.customerName || !ticketForm.subject) return;

    addComplaint(ticketForm);
    setTicketForm({
      customerName: '',
      customerPhone: '',
      category: 'استفسار عن موعد',
      priority: 'medium',
      subject: '',
      description: '',
    });
    setNewTicketModal(false);
  };

  // Add blackout date
  const handleAddBlackoutSubmit = (e) => {
    e.preventDefault();
    if (!blackoutForm.title || !blackoutForm.date) return;
    addBlackoutDate({ ...blackoutForm, active: true });
    setBlackoutForm({ title: '', date: '', city: 'الكل' });
    setNewBlackoutModal(false);
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    if (bookingFilterCity !== 'all' && b.city !== bookingFilterCity) return false;
    if (bookingFilterStatus !== 'all' && b.status !== bookingFilterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (b.customerName || '').toLowerCase().includes(q);
      const matchPhone = (b.customerPhone || '').includes(q);
      const matchId = (b.bookingNumber || '').toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchId) return false;
    }
    return true;
  });

  // Filtered Clients
  const filteredClients = clients.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.city.toLowerCase().includes(q);
  });

  // Filtered Staff
  const filteredStaffList = (apiStaffList || []).filter((st) => {
    if (staffCityFilter !== 'all' && st.city !== staffCityFilter) return false;
    if (staffTeamFilter === 'team' && !st.isPartOfTeam) return false;
    if (staffTeamFilter === 'individual' && st.isPartOfTeam) return false;
    if (!staffSearchQuery.trim()) return true;
    const q = staffSearchQuery.toLowerCase();
    const nameMatch = (st.name || '').toLowerCase().includes(q);
    const phoneMatch = (st.phone || '').includes(q);
    const emailMatch = (st.email || '').toLowerCase().includes(q);
    const specMatch = st.specialties?.some((sp) => sp.toLowerCase().includes(q));
    const roleMatch = (st.role || '').toLowerCase().includes(q);
    return nameMatch || phoneMatch || emailMatch || specMatch || roleMatch;
  });

  // Sidebar Menu Items
  const menuItems = [
    { id: 'overview', label: 'نظرة عامة والعمليات', icon: FiGrid },
    { id: 'roles', label: 'إدارة الصلاحيات والأدوار', icon: FiShield, requiredPermission: 'manageRoles' },
    { id: 'clients', label: 'إدارة بيانات العملاء CRM', icon: FiUsers, count: clients.length, requiredPermission: 'manageClients' },
    { id: 'staff', label: 'إدارة الموظفات والعمولات', icon: FiUserCheck, count: apiStaffList.length, requiredPermission: 'manageStaff' },
    { id: 'bookings', label: 'إدارة الحجوزات والعمليات', icon: FiCalendar, count: bookings.length, requiredPermission: 'viewBookings' },
    { id: 'booking-settings', label: 'خيارات وإعدادات الحجز', icon: FiSliders, requiredPermission: 'manageServices' },
    { id: 'capacity', label: 'المواعيد والطاقة الاستيعابية', icon: FiClock, requiredPermission: 'manageStaff' },
    { id: 'cities', label: 'المدن، الفروع ورسوم التنقل', icon: FiMapPin, requiredPermission: 'manageCities' },
    { id: 'services', label: 'الخدمات، الباقات والأسعار', icon: FiPackage, requiredPermission: 'manageServices' },
    { id: 'cms', label: 'إدارة المحتوى والبنرات', icon: FiFileText, requiredPermission: 'manageContent' },
    { id: 'reports', label: 'التقارير والمبيعات الشاملة', icon: FiBarChart2, requiredPermission: 'viewReports' },
    { id: 'crm', label: 'خدمة العملاء والشكاوى', icon: FiLifeBuoy, count: complaints.filter(c => c.status !== 'resolved').length, requiredPermission: 'manageComplaints' },
  ];

  // Filter menu items by user's permissions
  const userPermissions = Array.isArray(user?.permissions) ? user.permissions : [];
  const visibleMenuItems = menuItems.filter((item) => {
    if (!item.requiredPermission) return true;
    return userPermissions.includes(item.requiredPermission);
  });

  // Redirect to first allowed tab if current tab is forbidden
  useEffect(() => {
    const allowedIds = visibleMenuItems.map((m) => m.id);
    if (activeTab && !allowedIds.includes(activeTab) && visibleMenuItems.length > 0) {
      setActiveTab(visibleMenuItems[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, visibleMenuItems.map((m) => m.id).join(',')]);

  return (
    <div className="flex h-screen w-full bg-[#FFF9FA] text-[#2B151F] overflow-hidden font-sans" dir="rtl">
      {/* ============================================================== */}
      {/* DOUBLE BOOKING WARNING BANNER / MODAL */}
      {/* ============================================================== */}
      <AnimatePresence>
        {conflictAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConflictAlert(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border-2 border-rose-400 z-10 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce">
                <FiAlertTriangle />
              </div>
              <h3 className="text-lg font-black text-rose-700 mb-2">
                نظام منع الحجز المزدوج (Double-Booking Conflict Guard)
              </h3>
              <p className="text-xs sm:text-sm text-[#4A2838] leading-relaxed mb-6 bg-rose-50 p-4 rounded-2xl border border-rose-200">
                {conflictAlert}
              </p>
              <button
                onClick={() => setConflictAlert(null)}
                className="px-6 py-3 rounded-2xl bg-[#CF3A69] text-white font-black text-xs shadow-md hover:bg-[#b02652]"
              >
                فهمت ذلك، سأختار أخصائية بديلة أو توقيت متاح
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* 1. SIDEBAR (السايد بار الفاخر) */}
      {/* ============================================================== */}
      <aside
        className={`${
          isSidebarOpen ? 'w-72' : 'w-20'
        } transition-all duration-300 bg-white border-l border-rose-100/90 shadow-lg flex flex-col shrink-0 h-full z-30 select-none`}
      >
        {/* Brand Logo & Title */}
        <div className="p-4 sm:p-5 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#CF3A69] via-[#E65A84] to-[#CF3A69] text-white flex items-center justify-center text-xl shadow-md shadow-rose-300/40 shrink-0">
              <FaCrown />
            </div>
            {isSidebarOpen && (
              <div>
                <span className="text-base font-serif font-black text-[#2B151F] block leading-none">
                  Let's Relax
                </span>
                <span className="text-[10px] font-bold text-[#CF3A69] block mt-1 tracking-wider uppercase">
                  لوحة التحكم الإدارية
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-xl hover:bg-rose-50 text-[#8E717D] hover:text-[#CF3A69] transition-colors"
            title="تبديل حجم السايد بار"
          >
            <FiMenu className="text-lg" />
          </button>
        </div>

        {/* Current Active User Card */}
        {isSidebarOpen && (
          <div className="p-3 mx-3 my-2.5 rounded-2xl bg-gradient-to-br from-[#FFF5F7] to-[#FFF0F3] border border-rose-200/80 flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
              alt="Admin"
              className="w-10 h-10 rounded-xl object-cover border-2 border-[#CF3A69] shadow-sm shrink-0"
            />
            <div className="overflow-hidden flex-1">
              <span className="text-xs font-black text-[#2B151F] block truncate">
                {user?.name || 'مستخدم'}
              </span>
              <span className="text-[10px] font-bold text-[#CF3A69] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {user?.roleTitle || (user?.role === 'admin' ? 'مدير النظام' : user?.role === 'staff' ? 'موظفة' : 'مستخدمة')}
              </span>
            </div>
          </div>
        )}

        {/* Sidebar Nav Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin scrollbar-thumb-rose-200">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#CF3A69] to-[#E65A84] text-white shadow-md shadow-rose-400/25'
                    : 'text-[#4A2838] hover:bg-[#FFF0F3] hover:text-[#CF3A69]'
                }`}
                title={item.label}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`text-base shrink-0 ${isActive ? 'text-white' : 'text-[#CF3A69]'}`} />
                  {isSidebarOpen && <span className="truncate">{item.label}</span>}
                </div>

                {isSidebarOpen && item.count !== undefined && (
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-rose-100 text-[#CF3A69]'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Sidebar Controls */}
        <div className="p-3 border-t border-rose-100 space-y-1">
          <Link
            to="/"
            className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold text-[#8E717D] hover:text-[#CF3A69] hover:bg-rose-50 transition-colors"
          >
            <FiExternalLink className="text-sm shrink-0" />
            {isSidebarOpen && <span>العودة للمتجر الرئيسي</span>}
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <FiLogOut className="text-sm shrink-0" />
            {isSidebarOpen && <span>تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* 2. MAIN DASHBOARD WORKSPACE */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-[#FFF9FA]">
        {/* TOP BAR */}
        <header className="h-16 shrink-0 bg-white border-b border-rose-100/80 px-6 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <div>
              <span className="text-[10px] font-bold text-[#8E717D] block">لوحة تحكم الإدارة /</span>
              <h2 className="text-sm sm:text-base font-black text-[#2B151F]">
                {visibleMenuItems.find((m) => m.id === activeTab)?.label}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Double Booking Guard Status Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
              <FiShield className="text-emerald-600" />
              <span>نظام منع الحجز المزدوج نشط 🟢</span>
            </div>

            {/* Quick Link to Staff & Client Portals */}
            <Link
              to="/staff"
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-colors"
            >
              بوابة الموظفات 💆‍♀️
            </Link>
            <Link
              to="/client-portal"
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#CF3A69] border border-rose-200 text-xs font-bold transition-colors"
            >
              صفحة العميلة 🌸
            </Link>
          </div>
        </header>

        {/* SCROLLABLE MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">

        {/* ============================================================== */}
        {/* TAB 1: OVERVIEW & KPIs */}
        {/* ============================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 4 KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-[#8E717D]">إجمالي الإيرادات</span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <FiDollarSign />
                  </div>
                </div>
                <div className="text-2xl font-black text-emerald-700">
                  {overviewLoading ? '...' : `${displayRevenue.toLocaleString()} ر.س`}
                </div>
                <span className="text-[10px] text-emerald-600 font-bold block mt-1">
                  +18% نمو المبيعات
                </span>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-[#8E717D]">الحجوزات النشطة اليوم</span>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FiCalendar />
                  </div>
                </div>
                <div className="text-2xl font-black text-blue-700">{overviewLoading ? '...' : displayActiveBookings}</div>
                <span className="text-[10px] text-blue-600 font-bold block mt-1">
                  {displayPendingBookings} حجز قيد التأكيد الفوري
                </span>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-[#8E717D]">طاقم الأخصائيات</span>
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <FiUserCheck />
                  </div>
                </div>
                <div className="text-2xl font-black text-purple-700">
                  {overviewLoading ? '...' : `${displayStaffAvailable} / ${displayStaffTotal}`}
                </div>
                <span className="text-[10px] text-purple-600 font-bold block mt-1">
                  متاحة للزيارات المنزلية
                </span>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-[#8E717D]">عمولات الموظفات</span>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <FiAward />
                  </div>
                </div>
                <div className="text-2xl font-black text-amber-700">
                  {overviewLoading ? '...' : `${displayCommissions.toFixed(0)} ر.س`}
                </div>
                <span className="text-[10px] text-amber-600 font-bold block mt-1">
                  مستحقات الجلسات المنجزة
                </span>
              </div>
            </div>

            {/* City Capacity Overview */}
            <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-sm">
              <h3 className="text-sm font-black text-[#2B151F] mb-4 flex items-center gap-2">
                <FiMapPin className="text-[#CF3A69]" />
                <span>الطاقة الاستيعابية وحجوزات الفروع اليوم</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cityConfigs.filter(c => c.active).map(city => (
                  <div key={city.id} className="p-4 rounded-2xl bg-[#FFF9FA] border border-rose-100/70">
                    <div className="flex justify-between text-xs font-black mb-1">
                      <span>{city.name}</span>
                      <span className="text-[#CF3A69]">{city.currentBookingsToday} / {city.maxDailyCapacity} حجز</span>
                    </div>
                    <div className="h-2 rounded-full bg-rose-100 overflow-hidden mt-2">
                      <div
                        className="h-full bg-gradient-to-r from-[#CF3A69] to-[#E65A84] rounded-full"
                        style={{ width: `${Math.min(100, (city.currentBookingsToday / city.maxDailyCapacity) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-[#8E717D] mt-1.5 block">
                      ساعات العمل: {city.operatingHours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Bookings Feed */}
            <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black text-[#2B151F] flex items-center gap-2">
                  <FiClock className="text-[#CF3A69]" />
                  <span>أحدث الحجوزات اليوم (Live Stream)</span>
                </h3>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs text-[#CF3A69] font-bold hover:underline"
                >
                  إدارة كل الحجوزات ({bookings.length})
                </button>
              </div>

              <div className="space-y-3">
                {bookings.slice(0, 4).map((b) => (
                  <div
                    key={b.id}
                    className="p-3.5 rounded-2xl bg-[#FFF9FA] border border-rose-100 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-[#CF3A69]">{b.bookingNumber}</span>
                        <span className="font-bold text-[#2B151F]">{b.customerName}</span>
                        <span className="text-[10px] text-[#8E717D]">({b.city})</span>
                      </div>
                      <p className="text-[11px] text-[#5A3F4B] mt-0.5 font-bold">
                        {b.services?.map((s) => s.title).join(' • ')}
                      </p>
                    </div>

                    <div className="text-end shrink-0">
                      <span className="font-black text-[#2B151F] block">{b.totalPrice} ر.س</span>
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                          b.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'in_progress'
                            ? 'bg-purple-100 text-purple-800'
                            : b.status === 'on_way'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: ROLES & PERMISSIONS */}
        {/* ============================================================== */}
        {activeTab === 'roles' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-black text-[#2B151F]">
                إدارة الصلاحيات والأدوار (Roles & Security Permissions)
              </h3>
              <p className="text-xs text-[#8E717D]">
                توزيع الصلاحيات بدقة: (مدير النظام، الإدارة، خدمة العملاء، المحاسب، المشرف، مدير الفرع)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-rose-100 space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-black text-[#2B151F]">{role.name}</h4>
                      <span className="text-[11px] text-[#8E717D]">{role.nameEn}</span>
                    </div>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-xl border ${role.badgeColor}`}>
                      {role.usersCount} مستخدمين
                    </span>
                  </div>

                  <p className="text-xs text-[#5A3F4B] leading-relaxed">
                    {role.description}
                  </p>

                  <div className="pt-3 border-t border-rose-100 space-y-2">
                    <span className="text-[10px] font-black uppercase text-[#8E717D] block mb-1">
                      الصلاحيات المفعلة لهذا الدور:
                    </span>

                    {Object.entries(role.permissions).map(([permKey, hasPerm]) => (
                      <div
                        key={permKey}
                        className="flex items-center justify-between text-xs py-1"
                      >
                        <span className="font-bold text-[#2B151F]">
                          {permKey === 'viewBookings' && 'عرض الحجوزات'}
                          {permKey === 'editBookings' && 'تعديل وتأكيد المواعيد'}
                          {permKey === 'cancelBookings' && 'إلغاء الحجوزات'}
                          {permKey === 'manageStaff' && 'إدارة الموظفات وجداول العمل'}
                          {permKey === 'manageClients' && 'إدارة بيانات العملاء'}
                          {permKey === 'manageServices' && 'تسعير الخدمات والباقات'}
                          {permKey === 'manageCities' && 'إدارة الفروع والمدن'}
                          {permKey === 'viewReports' && 'التقارير والمبيعات'}
                          {permKey === 'manageRoles' && 'تعديل الأدوار والصلاحيات'}
                          {permKey === 'manageComplaints' && 'خدمة العملاء والشكاوى'}
                          {permKey === 'manageFinance' && 'المحاسبة والعمولات'}
                          {permKey === 'manageContent' && 'إدارة محتوى الموقع والبنرات'}
                        </span>

                        <button
                          onClick={() => togglePermission(role.id, permKey)}
                          className={`w-9 h-5 rounded-full transition-colors relative ${
                            hasPerm ? 'bg-[#CF3A69]' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                              hasPerm ? 'right-0.5' : 'left-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: CLIENTS CRM */}
        {/* ============================================================== */}
        {activeTab === 'clients' && (
          <ClientsManagementTab />
        )}

        {activeTab === 'staff' && (
          <div className="space-y-6">
            {/* Header with Title and Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#2B151F] flex items-center gap-2">
                  <FiUsers className="text-[#CF3A69]" />
                  <span>إدارة الموظفات، التخصصات، والإجازات الأسبوعية</span>
                </h3>
                <p className="text-xs text-[#8E717D] mt-0.5">
                  جدول بيانات الموظفات، أرقام التواصل، الإيميل، الخدمات المعتمدة، وتحديد أيام الإجازة الخاصة بكل موظفة
                </p>
              </div>
              <button
                onClick={() => setNewStaffModal(true)}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#CF3A69] to-[#E65A84] text-white text-xs font-black shadow-md shadow-rose-300/40 hover:from-[#b02652] hover:to-[#CF3A69] flex items-center gap-2 transition-all shrink-0"
              >
                <FiPlus className="text-base" />
                <span>إضافة موظفة جديدة</span>
              </button>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="bg-white p-4 rounded-3xl border border-rose-100 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <FiSearch className="absolute right-3.5 top-1/2 -translate-y-1/2 text-rose-400 text-sm" />
                <input
                  type="text"
                  placeholder="ابحثي بالاسم، رقم الجوال، الإيميل، أو التخصص..."
                  value={staffSearchQuery}
                  onChange={(e) => setStaffSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2.5 rounded-2xl bg-[#FFF9FA] border border-rose-100 text-xs font-bold text-[#2B151F] focus:outline-none focus:border-[#CF3A69]"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap text-xs font-bold">
                {/* City Filter */}
                <select
                  value={staffCityFilter}
                  onChange={(e) => setStaffCityFilter(e.target.value)}
                  className="px-3 py-2 rounded-2xl bg-[#FFF9FA] border border-rose-100 text-[#2B151F] text-xs font-bold focus:outline-none focus:border-[#CF3A69]"
                >
                  <option value="all">كافة المدن</option>
                  <option value="الرياض">الرياض</option>
                  <option value="الخبر">الخبر</option>
                  <option value="الدمام">الدمام</option>
                </select>

                {/* Team Filter */}
                <select
                  value={staffTeamFilter}
                  onChange={(e) => setStaffTeamFilter(e.target.value)}
                  className="px-3 py-2 rounded-2xl bg-[#FFF9FA] border border-rose-100 text-[#2B151F] text-xs font-bold focus:outline-none focus:border-[#CF3A69]"
                >
                  <option value="all">كل تصنيفات الفرق</option>
                  <option value="team">👥 مع فريق عمل</option>
                  <option value="individual">👤 عمل مستقل</option>
                </select>

                <span className="text-[11px] text-[#8E717D] bg-rose-50 px-3 py-2 rounded-2xl border border-rose-100">
                  الإجمالي: <strong className="text-[#CF3A69]">{filteredStaffList.length}</strong> موظفة
                </span>
              </div>
            </div>

            {/* Staff Data Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-rose-100 overflow-hidden">
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-rose-200">
                <table className="w-full text-right border-collapse text-xs">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#FFF5F7] to-[#FFF0F3] border-b border-rose-100 text-[#4A2838] font-black text-[11px] uppercase tracking-wider">
                      <th className="py-4 px-4 whitespace-nowrap">الموظفة (الاسم والمسمى)</th>
                      <th className="py-4 px-4 whitespace-nowrap">رقم الجوال</th>
                      <th className="py-4 px-4 whitespace-nowrap">البريد الإلكتروني (الإيميل)</th>
                      <th className="py-4 px-4 whitespace-nowrap">الخدمات اللي هتقدمها</th>
                      <th className="py-4 px-4 whitespace-nowrap">أيام الإجازة المخصصة</th>
                      <th className="py-4 px-4 whitespace-nowrap">تصنيف الفريق</th>
                      <th className="py-4 px-4 whitespace-nowrap">الحالة والتوفر</th>
                      <th className="py-4 px-4 whitespace-nowrap">المدينة والعمولة</th>
                      <th className="py-4 px-4 whitespace-nowrap text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rose-50 text-[#2B151F]">
                    {filteredStaffList.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="py-12 text-center text-slate-400">
                          <FiUsers className="text-3xl mx-auto mb-2 text-rose-300" />
                          <p className="font-bold">لا توجد موظفات مطابقات لمعايير البحث</p>
                        </td>
                      </tr>
                    ) : (
                      filteredStaffList.map((st) => {
                        const email = st.email || (st.nameEn ? `${st.nameEn.toLowerCase().replace(/[^a-z]/g, '')}@relax.sa` : `${st.name.replace(/\s+/g, '.')}@relax.sa`);
                        const offDays = st.offDayLabels && st.offDayLabels.length > 0 ? st.offDayLabels : ['الجمعة', 'السبت'];

                        return (
                          <tr key={st.id} className="hover:bg-rose-50/40 transition-colors">
                            {/* 1. Name & Role */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <img
                                  src={st.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'}
                                  alt={st.name}
                                  className="w-11 h-11 rounded-2xl object-cover border-2 border-rose-100 shadow-sm shrink-0"
                                />
                                <div>
                                  <span className="font-black text-sm text-[#2B151F] block">
                                    {st.name}
                                  </span>
                                  <span className="text-[11px] text-[#8E717D] block">
                                    {st.role}
                                  </span>
                                  <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold mt-0.5">
                                    <FiStar className="fill-amber-400 text-xs" />
                                    <span>{st.rating || 5.0} ({st.reviewsCount || 0} تقييم)</span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* 2. Phone */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="space-y-1">
                                <a
                                  href={`tel:${st.phone}`}
                                  dir="ltr"
                                  className="font-mono font-bold text-xs text-[#2B151F] hover:text-[#CF3A69] block"
                                >
                                  {st.phone}
                                </a>
                                <a
                                  href={`https://wa.me/966${st.phone.replace(/^0/, '')}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200"
                                >
                                  <FaWhatsapp className="text-xs" />
                                  <span>واتساب مباشر</span>
                                </a>
                              </div>
                            </td>

                            {/* 3. Email */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <a
                                href={`mailto:${email}`}
                                dir="ltr"
                                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-700 hover:text-[#CF3A69]"
                              >
                                <FiMail className="text-[#CF3A69] shrink-0" />
                                <span>{email}</span>
                              </a>
                            </td>

                            {/* 4. Services / Specialties */}
                            <td className="py-3.5 px-4 max-w-xs">
                              <div className="flex flex-wrap gap-1">
                                {st.specialties?.map((sp, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#FFF0F3] text-[#CF3A69] border border-rose-100"
                                  >
                                    {sp}
                                  </span>
                                ))}
                              </div>
                            </td>

                            {/* 5. Weekly Off Days */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="space-y-1.5">
                                <div className="flex flex-wrap gap-1">
                                  {offDays.map((day, idx) => (
                                    <span
                                      key={idx}
                                      className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 shadow-2xs"
                                    >
                                      {day}
                                    </span>
                                  ))}
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setOffDaysModal({
                                      isOpen: true,
                                      staffId: st.id,
                                      staffName: st.name,
                                      offDays: [...offDays],
                                    })
                                  }
                                  className="text-[10px] font-bold text-[#CF3A69] hover:underline flex items-center gap-1"
                                >
                                  <FiCalendar className="text-xs" />
                                  <span>تحديد أيام الإجازة ✏️</span>
                                </button>
                              </div>
                            </td>

                            {/* 6. Team Member Classification */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              {st.isPartOfTeam ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                                  <FiUsers className="text-xs" />
                                  <span>مع فريق عمل</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-50 text-slate-600 border border-slate-200">
                                  <span>عمل مستقل</span>
                                </span>
                              )}
                            </td>

                            {/* 7. Status */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <button
                                onClick={() => toggleStaffVacation(st.id)}
                                title="اضغطي لتبديل الحالة"
                                className={`text-[10px] font-black px-3 py-1.5 rounded-xl border transition-all ${
                                  st.status === 'on_leave'
                                    ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                                    : 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                                }`}
                              >
                                {st.status === 'on_leave' ? '🏖️ في إجازة حالياً' : '🟢 متاحة للعمل'}
                              </button>
                            </td>

                            {/* 8. City & Commission */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="space-y-0.5 text-xs font-bold">
                                <span className="text-[#2B151F] block">{st.city}</span>
                                <span className="text-[11px] text-[#CF3A69] block">
                                  {st.commissionRate}% عمولة
                                </span>
                                <span className="text-[10px] text-emerald-700 font-black block">
                                  {st.totalEarningsMonth ? st.totalEarningsMonth.toLocaleString() : 0} ر.س
                                </span>
                              </div>
                            </td>

                            {/* 9. Actions */}
                            <td className="py-3.5 px-4 whitespace-nowrap text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() =>
                                    alert(
                                      `كشف حساب الموظفة (${st.name}):\n- الجلسات المنجزة: ${st.completedBookingsCount || 0}\n- نسبة العمولة: ${st.commissionRate}%\n- العمولات المستحقة: ${st.totalEarningsMonth || 0} ر.س\n- التقييم العام: ${st.rating || 5}/5\n- أيام الإجازة: ${offDays.join('، ')}\n- تصنيف الفريق: ${st.isPartOfTeam ? 'ضمن فريق عمل' : 'عمل مستقل'}`
                                    )
                                  }
                                  className="p-1.5 rounded-xl bg-rose-50 text-[#CF3A69] hover:bg-rose-100 text-xs font-bold"
                                  title="كشف حساب العمولات"
                                >
                                  📊
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`هل أنت متأكد من حذف الموظفة (${st.name})؟`)) {
                                      deleteStaff(st.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-xl hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-colors"
                                  title="حذف الموظفة"
                                >
                                  <FiTrash2 className="text-sm" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: BOOKINGS & OPERATIONS (مع منع الحجز المزدوج تماماً) */}
        {/* ============================================================== */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {adminBookingsError && (
              <div className="text-xs font-bold px-4 py-3 rounded-2xl border bg-amber-50 text-amber-800 border-amber-200">
                تعذّر تحميل الحجوزات من الخادم. أعيدي تحميل الصفحة أو تحققي من الاتصال.
              </div>
            )}
            <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 flex-wrap">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <FiSearch className="absolute start-3.5 top-1/2 -translate-y-1/2 text-[#8E717D]" />
                  <input
                    type="text"
                    placeholder="ابحث برقم الحجز، اسم العميلة، أو رقم الجوال..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-[#FFF9FA] border border-rose-200 outline-none text-xs font-bold text-[#2B151F]"
                  />
                </div>

                <select
                  value={bookingFilterCity}
                  onChange={(e) => setBookingFilterCity(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-[#FFF9FA] border border-rose-200 text-xs font-bold text-[#2B151F] outline-none"
                >
                  <option value="all">كل المدن</option>
                  <option value="الرياض">الرياض</option>
                  <option value="الخبر">الخبر</option>
                  <option value="الدمام">الدمام</option>
                </select>

                <select
                  value={bookingFilterStatus}
                  onChange={(e) => setBookingFilterStatus(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-[#FFF9FA] border border-rose-200 text-xs font-bold text-[#2B151F] outline-none"
                >
                  <option value="all">كل الحالات</option>
                  <option value="pending">قيد التأكيد</option>
                  <option value="confirmed">مؤكد</option>
                  <option value="on_way">في الطريق 🚗</option>
                  <option value="in_progress">جاري التنفيذ 💆‍♀️</option>
                  <option value="completed">مكتمل ✅</option>
                  <option value="cancelled">ملغي ❌</option>
                </select>
              </div>

              <div className="text-xs text-[#8E717D] font-bold">
                عرض ({filteredBookings.length}) حجز
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-rose-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs">
                  <thead className="bg-[#FFF5F7] border-b border-rose-100 text-[#5A3F4B] font-black">
                    <tr>
                      <th className="p-4 text-start">رقم الحجز</th>
                      <th className="p-4 text-start">العميلة والجوال</th>
                      <th className="p-4 text-start">المدينة والحي</th>
                      <th className="p-4 text-start">الموعد والتوقيت</th>
                      <th className="p-4 text-start">الأخصائية المكلفة</th>
                      <th className="p-4 text-start">المبلغ والدفع</th>
                      <th className="p-4 text-start">الحالة</th>
                      <th className="p-4 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rose-50 font-bold">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-[#FFFDFE] transition-colors">
                        <td className="p-4 font-black text-[#CF3A69] whitespace-nowrap">
                          {b.bookingNumber}
                        </td>
                        <td className="p-4">
                          <div className="font-black text-[#2B151F]">{b.customerName}</div>
                          <span className="text-[11px] text-[#8E717D] font-mono" dir="ltr">
                            {b.customerPhone}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <div>{b.city}</div>
                          <span className="text-[10px] text-[#8E717D]">{b.district || 'حي عام'}</span>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <div className="text-[#2B151F] font-black">{b.date}</div>
                          <span className="text-[10px] text-[#8E717D]">{b.timeSlot}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#2B151F]">
                              {b.specialistName || 'لم تعين بعد'}
                            </span>
                            <button
                              onClick={() => setReassignModal({ isOpen: true, booking: b, staffId: b.specialistId || '' })}
                              className="text-[10px] px-2 py-0.5 rounded-lg bg-rose-50 text-[#CF3A69] hover:bg-rose-100 font-bold"
                              title="تغيير الأخصائية مع منع الحجز المزدوج"
                            >
                              تغيير
                            </button>
                          </div>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className="font-black text-[#2B151F]">{b.totalPrice} ر.س</span>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border ${
                              String(b.paymentStatus).toUpperCase() === 'PAID'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-gray-100 text-gray-500 border-gray-200'
                            }`}>
                              {String(b.paymentStatus).toUpperCase() === 'PAID' ? '✓ مدفوع' : 'غير مدفوع'}
                            </span>
                            <span className="text-[10px] text-[#8E717D] font-mono">
                              {b.paymentMethod || '—'}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <select
                            value={b.status}
                            onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                            className="text-[11px] font-black px-2.5 py-1 rounded-xl border border-rose-200 outline-none bg-white text-[#2B151F]"
                          >
                            <option value="pending">قيد التأكيد</option>
                            <option value="confirmed">مؤكد</option>
                            <option value="on_way">في الطريق 🚗</option>
                            <option value="in_progress">جاري التنفيذ 💆‍♀️</option>
                            <option value="completed">مكتمل بنجاح ✅</option>
                            <option value="cancelled">ملغي ❌</option>
                          </select>
                        </td>
                        <td className="p-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => cancelBooking(b.id, 'إلغاء من قبل الإدارة')}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                              title="إلغاء الحجز"
                            >
                              <FiXCircle />
                            </button>
                            <a
                              href={`https://wa.me/966${(b.customerPhone || '').replace(/^0/, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                              title="تواصل واتساب"
                            >
                              <FaWhatsapp />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: CAPACITY, WORK HOURS & BLACKOUT DATES */}
        {/* ============================================================== */}
        {activeTab === 'capacity' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-black text-[#2B151F]">
                  مواعيد العمل، الإجازات، الحجوزات المغلقة والحد الأقصى
                </h3>
                <p className="text-xs text-[#8E717D]">
                  التحكم في فترات العمل، أوقات الذروة، وأيام الصيانة والإغلاق لمنع الضغط
                </p>
              </div>

              <button
                onClick={() => setNewBlackoutModal(true)}
                className="px-4 py-2.5 rounded-2xl bg-[#CF3A69] text-white text-xs font-black shadow-md hover:bg-[#b02652] flex items-center gap-1.5"
              >
                <FiPlus />
                <span>إضافة فترة / تاريخ مغلق</span>
              </button>
            </div>

            {/* Operating Hours & Caps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {cityConfigs.map((city) => (
                <div key={city.id} className="bg-white rounded-3xl p-6 border border-rose-100 shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-black text-[#2B151F]">{city.name}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      مفعل
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-bold text-[#5A3F4B]">
                    <div>
                      <label className="text-[11px] text-[#8E717D] block mb-1">ساعات العمل:</label>
                      <input
                        type="text"
                        defaultValue={city.operatingHours}
                        onBlur={(e) => updateCity(city.id, { operatingHours: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#FFF9FA] border border-rose-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#8E717D] block mb-1">الحد الأقصى للحجوزات اليومية:</label>
                      <input
                        type="number"
                        defaultValue={city.maxDailyCapacity}
                        onBlur={(e) => updateCity(city.id, { maxDailyCapacity: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-[#FFF9FA] border border-rose-200 outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Blackout Dates List */}
            <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-sm space-y-4">
              <h4 className="text-sm font-black text-[#2B151F]">
                قائمة التواريخ والأيام المغلقة للحجوزات (Blackout Dates)
              </h4>
              <div className="space-y-2">
                {blackouts.map((blk) => (
                  <div
                    key={blk.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#FFF9FA] border border-rose-100 text-xs font-bold"
                  >
                    <div>
                      <span className="text-[#2B151F] block">{blk.title}</span>
                      <span className="text-[10px] text-[#8E717D]">
                        التاريخ: {blk.date} • الفرع المشمول: {blk.city}
                      </span>
                    </div>

                    <button
                      onClick={() => removeBlackoutDate(blk.id)}
                      className="text-rose-500 hover:text-rose-700"
                      title="حذف"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 7: CITIES & PRICING */}
        {/* ============================================================== */}
        {activeTab === 'cities' && (
          <CitiesManagementTab />
        )}

        {activeTab === 'services' && (
          <ServicesManagementTab categories={adminCategories} />
        )}

        {activeTab === 'cms' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-black text-[#2B151F]">
                إدارة محتوى الموقع، البنرات والأسئلة الشائعة
              </h3>
              <p className="text-xs text-[#8E717D]">
                التحكم بالبنر الإعلاني العلوي، أكواد الخصم، والنصوص الترويجية
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-sm space-y-4 max-w-2xl">
              <div>
                <label className="text-xs font-bold text-[#2B151F] block mb-1">
                  نص البنر الإعلاني العلوي (Announcement Bar):
                </label>
                <textarea
                  rows={2}
                  defaultValue={cmsContent.bannerAnnouncement}
                  onBlur={(e) => updateCmsContent({ bannerAnnouncement: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9FA] border border-rose-200 text-xs font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#2B151F] block mb-1">كود الخصم الفعال:</label>
                  <input
                    type="text"
                    defaultValue={cmsContent.promoCode}
                    onBlur={(e) => updateCmsContent({ promoCode: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9FA] border border-rose-200 text-xs font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#2B151F] block mb-1">نسبة الخصم (%):</label>
                  <input
                    type="number"
                    defaultValue={cmsContent.promoDiscount}
                    onBlur={(e) => updateCmsContent({ promoDiscount: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9FA] border border-rose-200 text-xs font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#2B151F] block mb-1">هاتف خدمة العملاء المباشر:</label>
                <input
                  type="text"
                  defaultValue={cmsContent.supportPhone}
                  onBlur={(e) => updateCmsContent({ supportPhone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9FA] border border-rose-200 text-xs font-bold outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 10: REPORTS & ANALYTICS */}
        {/* ============================================================== */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-black text-[#2B151F]">
                  التقارير المالية والتشغيلية الشاملة
                </h3>
                <p className="text-xs text-[#8E717D]">
                  تحليل الإيرادات، المبيعات حسب المدينة، نسب الإلغاء، وأداء الخدمات
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-2xl bg-white hover:bg-rose-50 text-[#CF3A69] border border-rose-200 text-xs font-black shadow-sm flex items-center gap-2"
              >
                <FiDownload />
                <span>تصدير وطباعة التقرير</span>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-sm">
                <span className="text-xs text-[#8E717D] font-bold block">صافي المبيعات</span>
                <span className="text-2xl font-black text-[#2B151F]">
                  {totalRevenue.toLocaleString()} ر.س
                </span>
              </div>
              <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-sm">
                <span className="text-xs text-[#8E717D] font-bold block">إجمالي العمولات المستحقة</span>
                <span className="text-2xl font-black text-emerald-700">
                  {totalCommissionsPaid.toFixed(0)} ر.س
                </span>
              </div>
              <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-sm">
                <span className="text-xs text-[#8E717D] font-bold block">معدل الإتمام الناجح</span>
                <span className="text-2xl font-black text-purple-700">
                  {bookings.length > 0 ? Math.round((completedCount / bookings.length) * 100) : 100}%
                </span>
              </div>
              <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-sm">
                <span className="text-xs text-[#8E717D] font-bold block">نسبة الإلغاء</span>
                <span className="text-2xl font-black text-rose-600">
                  {bookings.length > 0 ? Math.round((cancelledCount / bookings.length) * 100) : 0}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-sm space-y-4">
                <h4 className="text-sm font-black text-[#2B151F]">توزيع المبيعات حسب المدن</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>الرياض</span>
                      <span>72%</span>
                    </div>
                    <div className="h-2 rounded-full bg-rose-100 overflow-hidden">
                      <div className="h-full bg-[#CF3A69] rounded-full" style={{ width: '72%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>الخبر</span>
                      <span>18%</span>
                    </div>
                    <div className="h-2 rounded-full bg-rose-100 overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '18%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>الدمام</span>
                      <span>10%</span>
                    </div>
                    <div className="h-2 rounded-full bg-rose-100 overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '10%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-sm space-y-4">
                <h4 className="text-sm font-black text-[#2B151F]">الخدمات الأكثر طلباً</h4>
                <div className="space-y-2.5 text-xs font-bold">
                  <div className="flex justify-between p-2 rounded-xl bg-[#FFF9FA]">
                    <span>1. باقة الهدوء - Calm Package</span>
                    <span className="text-[#CF3A69]">42 حجز</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-xl bg-[#FFF9FA]">
                    <span>2. الحمام المغربي الملكي الفاخر</span>
                    <span className="text-[#CF3A69]">31 حجز</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-xl bg-[#FFF9FA]">
                    <span>3. باقة الجمال - Beauty Package</span>
                    <span className="text-[#CF3A69]">25 حجز</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 11: CUSTOMER SUPPORT & TICKETS */}
        {/* ============================================================== */}
        {activeTab === 'crm' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-black text-[#2B151F]">
                  نظام خدمة العملاء والشكاوى (CRM Tickets)
                </h3>
                <p className="text-xs text-[#8E717D]">
                  نظام داخلي للبحث، تسجيل الملاحظات، وتتبع ومتابعة حالات الشكاوى للعملاء
                </p>
              </div>

              <button
                onClick={() => setNewTicketModal(true)}
                className="px-4 py-2.5 rounded-2xl bg-[#CF3A69] text-white text-xs font-black shadow-md hover:bg-[#b02652] flex items-center gap-1.5"
              >
                <FiPlus />
                <span>تسجيل شكوى / بلاغ جديد</span>
              </button>
            </div>

            <div className="space-y-4">
              {complaints.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-rose-100 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-rose-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700">
                        {ticket.ticketNumber}
                      </span>
                      <h4 className="text-sm font-black text-[#2B151F]">{ticket.subject}</h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ticket.priority === 'urgent'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        أولوية: {ticket.priority}
                      </span>
                    </div>

                    <span
                      className={`text-xs font-black px-3 py-1 rounded-xl ${
                        ticket.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ticket.status === 'resolved' ? 'تم الحل والتعويض ✅' : 'قيد المعالجة ⏳'}
                    </span>
                  </div>

                  <div className="text-xs text-[#5A3F4B] leading-relaxed">
                    <span className="font-bold text-[#2B151F]">
                      العميلة: {ticket.customerName} ({ticket.customerPhone})
                    </span>
                    <p className="mt-1">{ticket.description}</p>
                  </div>

                  {ticket.resolutionNotes && (
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-bold">
                      <span>إجراء الحل والتعويض: {ticket.resolutionNotes}</span>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#8E717D]">
                      المسؤول: {ticket.agentName || 'خدمة العملاء'}
                    </span>

                    {ticket.status !== 'resolved' && (
                      <button
                        onClick={() => {
                          const solution = prompt(
                            'اكتبي الإجراء المتخذ لحل الشكوى أو التعويض المقدم للعميلة:',
                            'تم التواصل والاعتذار وإضافة كود خصم 20% للجلسة القادمة'
                          );
                          if (solution) {
                            updateComplaintStatus(ticket.id, 'resolved', solution);
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                      >
                        إغلاق الشكوى وتسجيل الحل ✅
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 12: BOOKING & VERIFICATION SETTINGS (خيارات وإعدادات الحجز والتحقق) */}
        {/* ============================================================== */}
        {activeTab === 'booking-settings' && (
          <BookingSettingsTab />
        )}
          </div>
        </main>
      </div>

      {/* REASSIGN SPECIALIST MODAL */}
      <AnimatePresence>
        {reassignModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReassignModal({ isOpen: false, booking: null, staffId: '' })}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-rose-100 z-10 space-y-4"
            >
              <h3 className="text-base font-black text-[#2B151F]">
                تعيين أخصائية للحجز {reassignModal.booking?.bookingNumber}
              </h3>
              <p className="text-xs text-[#5A3F4B]">
                الموعد: {reassignModal.booking?.date} ({reassignModal.booking?.timeSlot})
              </p>

              <div>
                <label className="text-xs font-bold text-[#2B151F] block mb-2">
                  اختاري الأخصائية المتاحة:
                </label>
                <div className="space-y-2">
                  {apiStaffList.length === 0 ? (
                    <p className="text-xs text-rose-500 font-bold p-3 bg-rose-50 rounded-2xl text-center">
                      لا توجد أخصائيات متاحات حالياً. أضيفي موظفة من تاب "إدارة الموظفات".
                    </p>
                  ) : (
                    apiStaffList.map((st) => (
                      <label
                        key={st.staffProfileId}
                        className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                          reassignModal.staffId === st.staffProfileId
                            ? 'border-[#CF3A69] bg-rose-50/60'
                            : 'border-rose-100 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="staff"
                            value={st.staffProfileId}
                            checked={reassignModal.staffId === st.staffProfileId}
                            onChange={(e) =>
                              setReassignModal((prev) => ({ ...prev, staffId: e.target.value }))
                            }
                            className="text-[#CF3A69]"
                          />
                          <div>
                            <span className="text-xs font-black text-[#2B151F] block">{st.name}</span>
                            <span className="text-[10px] text-[#8E717D]">
                              {st.roleTitle || 'أخصائية'} • {st.staffCode || ''}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-bold ${
                            st.status === 'AVAILABLE' ? 'text-emerald-600' : 'text-amber-600'
                          }`}
                        >
                          {st.status === 'AVAILABLE' ? 'متاحة' : 'مشغولة'}
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={handleConfirmReassign}
                  className="flex-1 py-3 rounded-2xl bg-[#CF3A69] text-white text-xs font-black shadow-md hover:bg-[#b02652]"
                >
                  فحص التعارض وتأكيد التعيين
                </button>
                <button
                  type="button"
                  onClick={() => setReassignModal({ isOpen: false, booking: null, staffId: '' })}
                  className="px-4 py-3 rounded-2xl bg-rose-50 text-[#5A3F4B] text-xs font-bold"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* NEW STAFF MODAL */}
      <AnimatePresence>
        {newStaffModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNewStaffModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.form
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onSubmit={handleAddStaffSubmit}
              className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-rose-100 z-10 space-y-4 max-h-[92vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-2 border-b border-rose-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-[#CF3A69] flex items-center justify-center">
                    <FiUsers />
                  </div>
                  <h3 className="text-base font-black text-[#2B151F]">إضافة أخصائية سبا جديدة</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setNewStaffModal(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <FiX className="text-lg" />
                </button>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#2B151F] block mb-1">اسم الموظفة *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: أسماء الشريف"
                    value={staffForm.name}
                    onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9FA] border border-rose-200 text-xs font-bold text-[#2B151F] focus:outline-none focus:border-[#CF3A69]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#2B151F] block mb-1">رقم الجوال *</label>
                  <input
                    type="tel"
                    required
                    placeholder="05XXXXXXXX"
                    value={staffForm.phone}
                    onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9FA] border border-rose-200 text-xs font-bold text-[#2B151F] focus:outline-none focus:border-[#CF3A69]"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-bold text-[#2B151F] block mb-1">البريد الإلكتروني (الإيميل)</label>
                <div className="relative">
                  <FiMail className="absolute right-3.5 top-1/2 -translate-y-1/2 text-rose-400 text-sm" />
                  <input
                    type="email"
                    placeholder="asmaa.alsharif@relax.sa"
                    value={staffForm.email}
                    onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                    className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-[#FFF9FA] border border-rose-200 text-xs font-mono font-bold text-[#2B151F] focus:outline-none focus:border-[#CF3A69]"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* City & Commission */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#2B151F] block mb-1">المدينة والتغطية</label>
                  <select
                    value={staffForm.city}
                    onChange={(e) => setStaffForm({ ...staffForm, city: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#FFF9FA] border border-rose-200 text-xs font-bold text-[#2B151F] focus:outline-none focus:border-[#CF3A69]"
                  >
                    <option value="الرياض">الرياض</option>
                    <option value="الخبر">الخبر</option>
                    <option value="الدمام">الدمام</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#2B151F] block mb-1">نسبة العمولة (%)</label>
                  <input
                    type="number"
                    value={staffForm.commissionRate}
                    onChange={(e) => setStaffForm({ ...staffForm, commissionRate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#FFF9FA] border border-rose-200 text-xs font-bold text-[#2B151F] focus:outline-none focus:border-[#CF3A69]"
                  />
                </div>
              </div>

              {/* Role & Specialties */}
              <div>
                <label className="text-xs font-bold text-[#2B151F] block mb-1">المسمى الوظيفي</label>
                <input
                  type="text"
                  value={staffForm.role}
                  onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                  placeholder="أخصائية مساج وعناية"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9FA] border border-rose-200 text-xs font-bold text-[#2B151F] focus:outline-none focus:border-[#CF3A69]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#2B151F] block mb-1">الخدمات والتخصصات (مفصولة بفواصل)</label>
                <input
                  type="text"
                  value={staffForm.specialties}
                  onChange={(e) => setStaffForm({ ...staffForm, specialties: e.target.value })}
                  placeholder="المساج السويدي, الحمام المغربي الملكي, فيشل وماسكات"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9FA] border border-rose-200 text-xs font-bold text-[#2B151F] focus:outline-none focus:border-[#CF3A69]"
                />
              </div>

              {/* Weekly Off Days Selection (كل موظفة لها جدول إجازات مخصص) */}
              <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                    <FiCalendar className="text-amber-700" />
                    <span>أيام الإجازة الأسبوعية لهذه الموظفة:</span>
                  </label>
                  <span className="text-[10px] text-amber-800 font-bold">
                    (اختاري الأيام المخصصة لها)
                  </span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                  {WEEK_DAYS.map((day) => {
                    const isSelected = staffForm.offDays?.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          const current = staffForm.offDays || [];
                          const updated = current.includes(day)
                            ? current.filter((d) => d !== day)
                            : [...current, day];
                          setStaffForm({ ...staffForm, offDays: updated });
                        }}
                        className={`py-1.5 px-1 rounded-xl text-[11px] font-black border text-center transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                            : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
                <span className="text-[10px] text-amber-900 block font-medium">
                  الأيام المختارة: <strong className="font-black">{staffForm.offDays?.length > 0 ? staffForm.offDays.join(' و ') : 'لا يوجد إجازة'}</strong>
                </span>
              </div>

              {/* Team Member Checkbox (اتشك بوكس معرفي فقط) */}
              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 cursor-pointer hover:bg-indigo-50 transition-colors">
                <input
                  type="checkbox"
                  checked={staffForm.isPartOfTeam}
                  onChange={(e) => setStaffForm({ ...staffForm, isPartOfTeam: e.target.checked })}
                  className="mt-1 w-4 h-4 accent-indigo-600 rounded cursor-pointer shrink-0"
                />
                <div>
                  <span className="text-xs font-black text-indigo-950 block">
                    هل الموظفة تعمل مع فريق؟ (عضو فريق عمل)
                  </span>
                  <span className="text-[11px] text-indigo-700/90 mt-0.5 block leading-relaxed">
                    علامة تصنيف توضيحية لمعرفة ما إذا كانت الموظفة تابعة لفريق عمل أو تعمل بشكل فردي مستقل.
                  </span>
                </div>
              </label>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#CF3A69] to-[#E65A84] text-white text-xs font-black shadow-md hover:from-[#b02652] hover:to-[#CF3A69]"
                >
                  حفظ وإضافة الموظفة
                </button>
                <button
                  type="button"
                  onClick={() => setNewStaffModal(false)}
                  className="px-4 py-3 rounded-2xl bg-rose-50 text-[#5A3F4B] text-xs font-bold"
                >
                  إلغاء
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* OFF-DAYS MANAGER MODAL FOR INDIVIDUAL STAFF */}
      <AnimatePresence>
        {offDaysModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOffDaysModal({ isOpen: false, staffId: null, staffName: '', offDays: [] })}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-rose-100 z-10 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-rose-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-lg">
                    <FiCalendar />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#2B151F]">
                      تحديد أيام الإجازة الأسبوعية
                    </h3>
                    <p className="text-xs text-[#8E717D]">
                      الموظفة: <strong className="text-[#CF3A69]">{offDaysModal.staffName}</strong>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOffDaysModal({ isOpen: false, staffId: null, staffName: '', offDays: [] })}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              <div>
                <p className="text-xs text-[#5A3F4B] leading-relaxed mb-3">
                  اختاري الأيام المخصصة لإجازة هذه الموظفة (يمكن تخصيص أيام مختلفة لكل موظفة مثل: الجمعة والسبت، أو الأحد فقط):
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {WEEK_DAYS.map((day) => {
                    const isSelected = offDaysModal.offDays?.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          const current = offDaysModal.offDays || [];
                          const updated = current.includes(day)
                            ? current.filter((d) => d !== day)
                            : [...current, day];
                          setOffDaysModal({ ...offDaysModal, offDays: updated });
                        }}
                        className={`p-3 rounded-2xl text-xs font-black border text-center transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
                            : 'bg-[#FFF9FA] text-[#5A3F4B] border-rose-100 hover:border-amber-300 hover:bg-amber-50/50'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs font-bold text-amber-900">
                أيام الإجازة المختارة: {offDaysModal.offDays?.length > 0 ? offDaysModal.offDays.join(' و ') : 'لا يوجد أيام إجازة محددة'}
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveOffDays}
                  className="flex-1 py-3 rounded-2xl bg-[#CF3A69] text-white text-xs font-black shadow-md hover:bg-[#b02652]"
                >
                  حفظ وتطبيق أيام الإجازة
                </button>
                <button
                  type="button"
                  onClick={() => setOffDaysModal({ isOpen: false, staffId: null, staffName: '', offDays: [] })}
                  className="px-4 py-3 rounded-2xl bg-rose-50 text-[#5A3F4B] text-xs font-bold"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* NEW TICKET MODAL */}
      <AnimatePresence>
        {newTicketModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNewTicketModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.form
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onSubmit={handleAddTicketSubmit}
              className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-rose-100 z-10 space-y-4"
            >
              <h3 className="text-base font-black text-[#2B151F]">تسجيل بلاغ أو شكوى جديدة</h3>

              <div>
                <label className="text-xs font-bold text-[#2B151F] block mb-1">اسم العميلة</label>
                <input
                  type="text"
                  required
                  value={ticketForm.customerName}
                  onChange={(e) => setTicketForm({ ...ticketForm, customerName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9FA] border border-rose-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#2B151F] block mb-1">رقم الجوال</label>
                <input
                  type="tel"
                  required
                  value={ticketForm.customerPhone}
                  onChange={(e) => setTicketForm({ ...ticketForm, customerPhone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9FA] border border-rose-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#2B151F] block mb-1">موضوع البلاغ</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: تأخير الأخصائية، طلب تبديل موعد"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9FA] border border-rose-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#2B151F] block mb-1">تفاصيل الملاحظة</label>
                <textarea
                  rows={3}
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9FA] border border-rose-200 text-xs font-bold outline-none"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-[#CF3A69] text-white text-xs font-black shadow-md hover:bg-[#b02652]"
                >
                  تسجيل الشكوى
                </button>
                <button
                  type="button"
                  onClick={() => setNewTicketModal(false)}
                  className="px-4 py-3 rounded-2xl bg-rose-50 text-[#5A3F4B] text-xs font-bold"
                >
                  إلغاء
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* NEW BLACKOUT MODAL */}
      <AnimatePresence>
        {newBlackoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNewBlackoutModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.form
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onSubmit={handleAddBlackoutSubmit}
              className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-rose-100 z-10 space-y-4"
            >
              <h3 className="text-base font-black text-[#2B151F]">إضافة تاريخ / فترة إغلاق للحجوزات</h3>

              <div>
                <label className="text-xs font-bold text-[#2B151F] block mb-1">سبب الإغلاق</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: إجازة عيد، صيانة دورية للمعدات"
                  value={blackoutForm.title}
                  onChange={(e) => setBlackoutForm({ ...blackoutForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9FA] border border-rose-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#2B151F] block mb-1">التاريخ</label>
                <input
                  type="date"
                  required
                  value={blackoutForm.date}
                  onChange={(e) => setBlackoutForm({ ...blackoutForm, date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9FA] border border-rose-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#2B151F] block mb-1">الفرع / المدينة</label>
                <select
                  value={blackoutForm.city}
                  onChange={(e) => setBlackoutForm({ ...blackoutForm, city: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FFF9FA] border border-rose-200 text-xs font-bold"
                >
                  <option value="الكل">كل الفروع</option>
                  <option value="الرياض">الرياض</option>
                  <option value="الخبر">الخبر</option>
                  <option value="الدمام">الدمام</option>
                </select>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-[#CF3A69] text-white text-xs font-black shadow-md hover:bg-[#b02652]"
                >
                  إضافة وإغلاق التاريخ
                </button>
                <button
                  type="button"
                  onClick={() => setNewBlackoutModal(false)}
                  className="px-4 py-3 rounded-2xl bg-rose-50 text-[#5A3F4B] text-xs font-bold"
                >
                  إلغاء
                </button>
              </div>
            </motion.form>
          </div>
        )}

        {activeTab === 'staff-management' && (
          <StaffManagementTab />
        )}

        {activeTab === 'roles-permissions' && (
          <RolesPermissionsTab />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboardPage;
