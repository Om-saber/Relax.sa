import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUsers,
  FiClock,
  FiCalendar,
  FiFileText,
  FiMessageSquare,
  FiCheck,
  FiRefreshCw,
  FiSave,
  FiEye,
  FiSliders,
  FiChevronDown,
  FiChevronUp,
  FiAlertCircle,
  FiExternalLink,
  FiSend,
  FiX,
  FiCheckCircle,
  FiInfo,
  FiShield,
  FiKey
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import { useAdmin } from '../../context/AdminContext';
import { useBookingSettings, DEFAULT_BOOKING_SETTINGS } from '../../hooks/useBookingSettings';
import { useAdminStaff } from '../../hooks/useAdminStaff';
import { Link } from 'react-router-dom';

/**
 * Pixel-Perfect Toggle Switch Component
 * Matches the exact design from the dashboard screenshot:
 * - OFF: Light gray track (#CBD5E1) with white knob on left
 * - ON: Dark navy/slate track (#1E293B) with white knob on right
 */
const SwitchToggle = ({ checked, onChange, disabled = false, id }) => {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E293B] focus-visible:ring-offset-2 ${
        checked ? 'bg-[#1E293B]' : 'bg-[#CBD5E1]'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span className="sr-only">تبديل الإعداد</span>
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  );
};

const BookingSettingsTab = () => {
  const { staffList: _mockStaff } = useAdmin();

  const {
    settings: apiSettings,
    update: updateSettings,
  } = useBookingSettings();

  const { staff: apiStaffList } = useAdminStaff();

  const [draft, setDraft] = useState(apiSettings);
  useEffect(() => {
    setDraft(apiSettings);
  }, [apiSettings]);

  const bookingSettings = draft;
  const staffList = (apiStaffList && apiStaffList.length > 0)
    ? apiStaffList
    : (_mockStaff || []);

  const updateBookingSetting = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const resetBookingSettings = () => {
    setDraft(DEFAULT_BOOKING_SETTINGS);
  };

  // Local state for feedback toasts & modals
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isTestSmsModalOpen, setIsTestSmsModalOpen] = useState(false);
  const [testPhoneNumber, setTestPhoneNumber] = useState('05XXXXXXXX');
  const [testSmsStatus, setTestSmsStatus] = useState(null); // 'sending' | 'success' | null

  // Show quick toast notification
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Toggle handlers
  const handleToggle = (key) => {
    const newValue = !bookingSettings[key];
    updateBookingSetting(key, newValue);
    setHasUnsavedChanges(true);

    const labels = {
      allowSpecialistSelection: 'اختيار مزوّد الخدمة عند الحجز',
      mandatoryTimeSelection: 'تحديد الوقت إلزامي عند طلب الخدمات',
      timeSelectionOnServicePage: 'اختيار الوقت في صفحة الخدمة',
      requireTermsApproval: 'الموافقة على الشروط والأحكام',
      customOtpSenderEnabled: 'رسائل التحقق من مزوّدك الخاص',
    };

    showToast(
      newValue
        ? `تم تفعيل "${labels[key]}" بنجاح`
        : `تم تعطيل "${labels[key]}" بنجاح`
    );
  };

  // Save changes handler
  const handleSave = async () => {
    const res = await updateSettings(draft);
    if (res.success) {
      setHasUnsavedChanges(false);
      showToast('تم حفظ جميع خيارات وإعدادات الحجز بنجاح ✅');
    } else {
      showToast('فشل الحفظ: ' + (res.error || 'خطأ غير معروف'));
    }
  };

  // Reset to defaults
  const handleReset = async () => {
    if ((await Swal.fire({ text: 'هل أنت متأكد من استعادة كافة إعدادات الحجز والرسائل إلى الحالة الافتراضية؟', icon: 'warning', showCancelButton: true, confirmButtonText: 'نعم، متأكد', cancelButtonText: 'إلغاء', confirmButtonColor: '#CF3A69', cancelButtonColor: '#8E717D' })).isConfirmed) {
      resetBookingSettings();
      setHasUnsavedChanges(true);
      showToast('تمت استعادة القيم الافتراضية — اضغطي حفظ لتأكيدها 🔄');
    }
  };

  // Simulate Sending Test SMS
  const handleSendTestSms = (e) => {
    e.preventDefault();
    setTestSmsStatus('sending');
    setTimeout(() => {
      setTestSmsStatus('success');
      setTimeout(() => {
        setIsTestSmsModalOpen(false);
        setTestSmsStatus(null);
        showToast(`تم إرسال رمز التحقق التجريبي بنجاح عبر بوابة ${bookingSettings.smsGatewayProvider} 📲`);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 select-none font-sans" dir="rtl">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#1E293B] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 text-xs sm:text-sm font-bold"
          >
            <FiCheckCircle className="text-emerald-400 text-lg shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
            <span>لوحة التحكم</span>
            <span>/</span>
            <span>إعدادات النظام</span>
            <span>/</span>
            <span className="text-[#CF3A69]">خيارات وإعدادات الحجز والتحقق</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1E293B] flex items-center gap-2.5">
            <FiSliders className="text-[#CF3A69]" />
            <span>خيارات الحجز وخدمات التحقق</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            التحكم الدقيق في تدفق حجز العملاء، إلزامية المواعيد، اختيار الأخصائيات، وبوابة رسائل التحقق (OTP).
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="معاينة تجربة العميل الحالية"
          >
            <FiEye className="text-base" />
            <span>معاينة تجربة العميل</span>
          </button>

          <button
            onClick={handleReset}
            className="px-3.5 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-[#CF3A69] text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="استعادة الإعدادات الافتراضية"
          >
            <FiRefreshCw className="text-base" />
            <span>استعادة الافتراضي</span>
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-2xl bg-[#1E293B] hover:bg-[#0F172A] text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
          >
            <FiSave className="text-base" />
            <span>حفظ التغييرات</span>
            {hasUnsavedChanges && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping mr-1" />
            )}
          </button>
        </div>
      </div>

      {/* Notice bar if unsaved changes */}
      {hasUnsavedChanges && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-5 py-3 rounded-2xl flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            <FiAlertCircle className="text-amber-600 text-base shrink-0" />
            <span>لديك تغييرات غير محفوظة في إعدادات الحجز، لا تنسَ النقر على "حفظ التغييرات".</span>
          </div>
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-[11px] font-bold"
          >
            حفظ الآن
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 1: BOOKING OPTIONS CARD (Exact match to screenshot top card) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200/90 overflow-hidden divide-y divide-slate-100">
        {/* ROW 1: اختيار مزوّد الخدمة عند الحجز */}
        <div className="p-5 sm:p-7 hover:bg-slate-50/50 transition-colors">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Switch Toggle (OFF in screenshot) */}
            <div className="shrink-0 flex items-center gap-3">
              <SwitchToggle
                id="toggle-specialist"
                checked={bookingSettings.allowSpecialistSelection}
                onChange={() => handleToggle('allowSpecialistSelection')}
              />
            </div>

            {/* Right: Text + Far Right Icon */}
            <div className="flex items-center gap-4 sm:gap-5 flex-1 justify-end text-end">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#1E293B]">
                  اختيار مزوّد الخدمة عند الحجز
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  يختار العميل مزوّد الخدمة الذي يفضّله.
                </p>
              </div>

              {/* Far Right Icon: Group / Users Icon */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0 border border-slate-100">
                <FiUsers className="text-xl sm:text-2xl text-slate-600" />
              </div>
            </div>
          </div>

          {/* Expandable configuration if enabled */}
          {bookingSettings.allowSpecialistSelection && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-slate-100 mr-0 sm:mr-16 space-y-3 bg-slate-50/70 p-4 rounded-2xl text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-bold text-slate-700">طريقة عرض واختيار الأخصائيات للعميلة:</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="specialistMode"
                      checked={bookingSettings.specialistSelectionMode === 'manual'}
                      onChange={() => updateBookingSetting('specialistSelectionMode', 'manual')}
                      className="accent-[#1E293B]"
                    />
                    <span>إتاحة الاختيار اليدوي الكامل مع صور وتقييم كل أخصائية</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="specialistMode"
                      checked={bookingSettings.specialistSelectionMode === 'auto'}
                      onChange={() => updateBookingSetting('specialistSelectionMode', 'auto')}
                      className="accent-[#1E293B]"
                    />
                    <span>اقتراح الأخصائية الأعلى تقييماً مع خيار التبديل</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 text-slate-600">
                <input
                  type="checkbox"
                  id="showRatings"
                  checked={bookingSettings.showStaffRatings}
                  onChange={(e) => updateBookingSetting('showStaffRatings', e.target.checked)}
                  className="rounded accent-[#1E293B]"
                />
                <label htmlFor="showRatings" className="cursor-pointer">
                  عرض عدد سنوات الخبرة والتقييم بالنجوم بجانب اسم كل أخصائية ({staffList.length} أخصائية مسجلة بالنظام)
                </label>
              </div>
            </motion.div>
          )}
        </div>

        {/* ROW 2: تحديد الوقت إلزامي عند طلب الخدمات */}
        <div className="p-5 sm:p-7 hover:bg-slate-50/50 transition-colors">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Switch Toggle (ON in screenshot) */}
            <div className="shrink-0 flex items-center gap-3">
              <SwitchToggle
                id="toggle-mandatory-time"
                checked={bookingSettings.mandatoryTimeSelection}
                onChange={() => handleToggle('mandatoryTimeSelection')}
              />
            </div>

            {/* Right: Text + Far Right Icon */}
            <div className="flex items-center gap-4 sm:gap-5 flex-1 justify-end text-end">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#1E293B]">
                  تحديد الوقت إلزامي عند طلب الخدمات
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  لا يكمل العميل الطلب قبل أن يختار موعدًا.
                </p>
              </div>

              {/* Far Right Icon: Clock Icon */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0 border border-slate-100">
                <FiClock className="text-xl sm:text-2xl text-slate-600" />
              </div>
            </div>
          </div>

          {/* Sub-config details */}
          {bookingSettings.mandatoryTimeSelection && (
            <div className="mt-4 pt-3 border-t border-slate-100 mr-0 sm:mr-16 flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <span className="font-bold text-slate-700">المهلة الزمنية المسبقة:</span>
              <div className="flex items-center gap-2">
                <span>أقل وقت مسبق للحجز:</span>
                <select
                  value={bookingSettings.minAdvanceBookingHours}
                  onChange={(e) => updateBookingSetting('minAdvanceBookingHours', Number(e.target.value))}
                  className="bg-white border border-slate-200 rounded-xl px-2 py-1 text-xs font-bold text-[#1E293B]"
                >
                  <option value={1}>ساعة واحدة قبل الموعد</option>
                  <option value={2}>ساعتان قبل الموعد (موصى به)</option>
                  <option value={4}>4 ساعات قبل الموعد</option>
                  <option value={24}>يوم كامل (24 ساعة مسبقاً)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span>أقصى مدى متاح للحجز:</span>
                <select
                  value={bookingSettings.maxAdvanceBookingDays}
                  onChange={(e) => updateBookingSetting('maxAdvanceBookingDays', Number(e.target.value))}
                  className="bg-white border border-slate-200 rounded-xl px-2 py-1 text-xs font-bold text-[#1E293B]"
                >
                  <option value={7}>أسبوع مقبل (7 أيام)</option>
                  <option value={14}>أسبوعين (14 يوماً)</option>
                  <option value={30}>شهر مقبل (30 يوماً)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* ROW 3: اختيار الوقت في صفحة الخدمة */}
        <div className="p-5 sm:p-7 hover:bg-slate-50/50 transition-colors">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Switch Toggle (OFF in screenshot) */}
            <div className="shrink-0 flex items-center gap-3">
              <SwitchToggle
                id="toggle-time-on-service"
                checked={bookingSettings.timeSelectionOnServicePage}
                onChange={() => handleToggle('timeSelectionOnServicePage')}
              />
            </div>

            {/* Right: Text + Far Right Icon */}
            <div className="flex items-center gap-4 sm:gap-5 flex-1 justify-end text-end">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#1E293B]">
                  اختيار الوقت في صفحة الخدمة
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  يختار العميل وقته أثناء تصفّح الخدمة بدل صفحة الدفع.
                </p>
              </div>

              {/* Far Right Icon: Calendar Icon */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0 border border-slate-100">
                <FiCalendar className="text-xl sm:text-2xl text-slate-600" />
              </div>
            </div>
          </div>
        </div>

        {/* ROW 4: الموافقة على الشروط والأحكام */}
        <div className="p-5 sm:p-7 hover:bg-slate-50/50 transition-colors">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Switch Toggle (ON in screenshot) */}
            <div className="shrink-0 flex items-center gap-3">
              <SwitchToggle
                id="toggle-terms"
                checked={bookingSettings.requireTermsApproval}
                onChange={() => handleToggle('requireTermsApproval')}
              />
            </div>

            {/* Right: Text + Far Right Icon */}
            <div className="flex items-center gap-4 sm:gap-5 flex-1 justify-end text-end">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#1E293B]">
                  الموافقة على الشروط والأحكام
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  يوافق العميل على شروطك قبل إتمام الحجز.
                </p>
              </div>

              {/* Far Right Icon: Document Icon */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0 border border-slate-100">
                <FiFileText className="text-xl sm:text-2xl text-slate-600" />
              </div>
            </div>
          </div>

          {/* Sub-config details */}
          {bookingSettings.requireTermsApproval && (
            <div className="mt-4 pt-3 border-t border-slate-100 mr-0 sm:mr-16 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  id="requireCheckbox"
                  checked={bookingSettings.termsRequireExplicitCheckbox}
                  onChange={(e) => updateBookingSetting('termsRequireExplicitCheckbox', e.target.checked)}
                  className="rounded accent-[#1E293B]"
                />
                <label htmlFor="requireCheckbox" className="cursor-pointer font-medium">
                  إلزام العميلة بوضع علامة (✓) على مربع "أوافق على سياسة الإلغاء والشروط" قبل تفعيل زر الدفع
                </label>
              </div>

              <Link
                to="/terms"
                target="_blank"
                className="text-[#CF3A69] hover:underline font-bold flex items-center gap-1 shrink-0"
              >
                <span>معاينة صفحة الشروط والأحكام</span>
                <FiExternalLink />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: VERIFICATION MESSAGES (Exact match to screenshot bottom section) */}
      {/* ========================================================================= */}
      <div className="space-y-3 pt-4">
        {/* Section Heading */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-[#1E293B]">
            رسائل التحقق
          </h2>
          <span className="text-xs text-slate-500">
            بوابة الرسائل النصية القصيرة (OTP SMS)
          </span>
        </div>

        {/* Second Card: رسائل التحقق من مزوّدك الخاص */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200/90 overflow-hidden divide-y divide-slate-100">
          <div className="p-5 sm:p-7 hover:bg-slate-50/50 transition-colors">
            <div className="flex items-center justify-between gap-4">
              {/* Left: Switch Toggle (ON in screenshot) */}
              <div className="shrink-0 flex items-center gap-3">
                <SwitchToggle
                  id="toggle-custom-otp"
                  checked={bookingSettings.customOtpSenderEnabled}
                  onChange={() => handleToggle('customOtpSenderEnabled')}
                />
              </div>

              {/* Right: Text + Far Right Icon */}
              <div className="flex items-center gap-4 sm:gap-5 flex-1 justify-end text-end">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#1E293B]">
                    رسائل التحقق من مزوّدك الخاص
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    تُرسل رموز تسجيل الدخول في المتجر عبر بوابة الرسائل التي ربطتها.
                  </p>
                </div>

                {/* Far Right Icon: Message Bubble Icon */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0 border border-slate-100">
                  <FiMessageSquare className="text-xl sm:text-2xl text-slate-600" />
                </div>
              </div>
            </div>

            {/* Connected SMS Gateway Details Sub-Card */}
            {bookingSettings.customOtpSenderEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-5 pt-4 border-t border-slate-100 mr-0 sm:mr-16"
              >
                <div className="bg-gradient-to-br from-slate-50 to-slate-100/70 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg font-bold">
                        <FiShield />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-[#1E293B]">
                            بوابة الربط: {bookingSettings.smsGatewayProvider}
                          </span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            متصل ونشط 🟢
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          اسم المرسل المعتمد من هيئة الاتصالات والفضاء والتقنية: <strong className="text-[#1E293B] font-bold">{bookingSettings.senderName}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsTestSmsModalOpen(true)}
                        className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-[#1E293B] shadow-sm flex items-center gap-1.5 transition-colors"
                      >
                        <FiSend className="text-[#CF3A69]" />
                        <span>إرسال رسالة تجريبية (Test SMS)</span>
                      </button>
                    </div>
                  </div>

                  {/* Gateway stats row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 font-bold block">رصيد الرسائل المتبقي</span>
                      <span className="text-sm font-black text-emerald-600 mt-0.5 block">
                        {bookingSettings.smsRemainingBalance.toLocaleString()} رسالة
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 font-bold block">اسم المرسل المعتمد</span>
                      <span className="text-sm font-black text-[#1E293B] mt-0.5 block">
                        {bookingSettings.senderName}
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 font-bold block">زمن إعادة الإرسال</span>
                      <span className="text-sm font-black text-[#1E293B] mt-0.5 block">
                        {bookingSettings.autoResendTimeoutSeconds} ثانية
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 font-bold block">حالة التحقق بالمتجر</span>
                      <span className="text-sm font-black text-blue-600 mt-0.5 block">
                        OTP تلقائي نشط
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: TEST SMS SENDER */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isTestSmsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTestSmsModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 z-10 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#CF3A69] flex items-center justify-center">
                    <FiSend />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-[#1E293B]">
                      إرسال رسالة تحقق تجريبية
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      بوابة: {bookingSettings.smsGatewayProvider} • اسم المرسل: {bookingSettings.senderName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsTestSmsModalOpen(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <FiX className="text-lg" />
                </button>
              </div>

              <form onSubmit={handleSendTestSms} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    أدخلي رقم الجوال للاختبار (السعودية):
                  </label>
                  <input
                    type="tel"
                    required
                    value={testPhoneNumber}
                    onChange={(e) => setTestPhoneNumber(e.target.value)}
                    placeholder="05XXXXXXXX"
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#1E293B]"
                    dir="ltr"
                  />
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                  <span className="font-bold text-[#1E293B] block">معاينة نص الرسالة التي ستصل:</span>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 font-mono text-[11px] text-slate-700">
                    رمز التحقق الخاص بك لمنصة Let's Relax هو: [ <strong>8492</strong> ]. لا تشارك الرمز مع أي شخص.
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsTestSmsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={testSmsStatus === 'sending'}
                    className="px-5 py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#0F172A] text-white text-xs font-bold shadow-md flex items-center gap-2"
                  >
                    {testSmsStatus === 'sending' ? (
                      <>
                        <FiRefreshCw className="animate-spin text-sm" />
                        <span>جارِ إرسال الرسالة...</span>
                      </>
                    ) : testSmsStatus === 'success' ? (
                      <>
                        <FiCheck className="text-emerald-400 text-sm" />
                        <span>تم الإرسال بنجاح!</span>
                      </>
                    ) : (
                      <>
                        <FiSend />
                        <span>إرسال الرسالة الآن</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 2: CUSTOMER BOOKING FLOW EXPERIENCE SIMULATOR */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isPreviewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPreviewOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-[#FFF9FA] rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-rose-200 z-10 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-rose-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#CF3A69] to-[#E65A84] text-white flex items-center justify-center text-lg shadow-sm">
                    <FiEye />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#2B151F]">
                      معاينة تجربة العميل المباشرة
                    </h3>
                    <p className="text-xs text-[#8E717D]">
                      كيف تظهر خطوات الحجز للعميلة وفقاً للإعدادات الحالية
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              {/* Status summary pill */}
              <div className="bg-white p-4 rounded-2xl border border-rose-100 space-y-2.5 text-xs">
                <span className="font-bold text-[#2B151F] block text-sm">
                  ملخص الإعدادات المطبقة حالياً في المتجر:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className={bookingSettings.allowSpecialistSelection ? 'text-emerald-600 font-bold' : 'text-slate-400 font-medium'}>
                      {bookingSettings.allowSpecialistSelection ? '✓ اختيار الأخصائية مفعل' : '✗ اختيار الأخصائية معطل (توزيع تلقائي)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={bookingSettings.mandatoryTimeSelection ? 'text-emerald-600 font-bold' : 'text-slate-400 font-medium'}>
                      {bookingSettings.mandatoryTimeSelection ? '✓ تحديد الوقت إلزامي' : '✗ تحديد الوقت اختياري'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={bookingSettings.timeSelectionOnServicePage ? 'text-emerald-600 font-bold' : 'text-slate-400 font-medium'}>
                      {bookingSettings.timeSelectionOnServicePage ? '✓ اختيار الوقت بصفحة الخدمة' : '✗ اختيار الوقت بنافذة الحجز'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={bookingSettings.requireTermsApproval ? 'text-emerald-600 font-bold' : 'text-slate-400 font-medium'}>
                      {bookingSettings.requireTermsApproval ? '✓ الموافقة على الشروط مطلوبة' : '✗ لا يتطلب موافقة صريحة'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mock Checkout Step Preview */}
              <div className="bg-white rounded-2xl p-5 border border-rose-100 space-y-4">
                <div className="flex items-center justify-between border-b border-rose-100 pb-2">
                  <span className="text-xs font-black text-[#2B151F]">
                    مثال حي: خطوة تأكيد الحجز عند العميل
                  </span>
                  <span className="text-[10px] bg-rose-100 text-[#CF3A69] px-2 py-0.5 rounded-full font-bold">
                    معاينة حية
                  </span>
                </div>

                {/* Simulated Specialist Choice */}
                {bookingSettings.allowSpecialistSelection ? (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="text-xs font-bold text-slate-800 block mb-1.5">
                      اختاري الأخصائية المفضلة:
                    </label>
                    <div className="flex items-center gap-2">
                      <select className="w-full p-2 rounded-lg bg-white border border-slate-200 text-xs font-bold">
                        {staffList.slice(0, 3).map((st) => (
                          <option key={st.id} value={st.id}>
                            {st.name} ({st.city}) ⭐ 4.9
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <FiCheckCircle className="text-emerald-600 shrink-0" />
                    <span>التعيين الذكي نشط: سيتم تعيين أقرب أخصائية فندقية معتمدة تلقائياً بناءً على موقعكِ.</span>
                  </div>
                )}

                {/* Simulated Terms Checkbox */}
                {bookingSettings.requireTermsApproval && (
                  <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 flex items-center gap-2.5 text-xs text-[#2B151F]">
                    <input type="checkbox" defaultChecked readOnly className="accent-[#CF3A69] rounded w-4 h-4" />
                    <span>
                      أوافق على <Link to="/terms" target="_blank" className="text-[#CF3A69] underline font-bold">الشروط والأحكام</Link> وسياسة الإلغاء والاسترجاع لمنصة Let's Relax.
                    </span>
                  </div>
                )}

                {/* Simulated Verification Message */}
                {bookingSettings.customOtpSenderEnabled && (
                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-center gap-2">
                    <FiMessageSquare className="text-blue-600 shrink-0" />
                    <span>
                      سيتم إرسال رمز تسجيل الدخول عبر رسالة SMS فورية باسم المرسل: <strong>{bookingSettings.senderName}</strong>.
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-[#CF3A69] text-white text-xs font-bold hover:bg-[#b02652] transition-colors"
                >
                  إغلاق نافذة المعاينة
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingSettingsTab;
