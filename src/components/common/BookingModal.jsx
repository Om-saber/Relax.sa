import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  FiX,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUser,
  FiPhone,
  FiCheckCircle,
  FiArrowRight,
  FiArrowLeft,
  FiPlus,
  FiShield,
  FiShoppingBag,
  FiUsers
} from 'react-icons/fi';
import {
  FaWhatsapp,
  FaCrown
} from 'react-icons/fa6';
import { useBooking } from '../../context/BookingContext';
import { useLanguage } from '../../context/LanguageContext';
import { bookingsApi } from '../../api/bookingsApi';
import { paymentsApi } from '../../api/paymentsApi';
import { useAdmin } from '../../context/AdminContext';
import { CITIES, TIME_SLOTS, ADDONS } from '../../data/servicesData';

const BookingModal = () => {
  const { addBooking, bookingSettings, staffList } = useAdmin();
  const {
    cart,
    addToCart,
    isBookingModalOpen,
    setIsBookingModalOpen,
    bookingDetails,
    setBookingDetails,
    finalTotal,
    discountAmount,
    tabbyInstallment,
    sendWhatsAppBooking
  } = useBooking();

  const { lang, isRTL, t } = useLanguage();
  const [step, setStep] = useState(1);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [createdBooking, setCreatedBooking] = useState(null);

  if (!isBookingModalOpen) return null;

  const handleNext = async () => {
    if (step === 2) {
      if (bookingSettings?.mandatoryTimeSelection && (!bookingDetails.date || !bookingDetails.timeSlot)) {
        alert(lang === 'ar' ? 'يرجى اختيار تاريخ الجلسة والفترة الزمنية المناسبة للمتابعة' : 'Please select a session date and time slot');
        return;
      }
    }
    if (step === 3) {
      if (!bookingDetails.name.trim() || !bookingDetails.phone.trim()) {
        alert(lang === 'ar' ? 'يرجى كتابة الاسم ورقم الجوال للتواصل' : 'Please provide your name and phone number');
        return;
      }
    }
    if (step === 4) {
      if (bookingSettings?.requireTermsApproval && !agreedToTerms) {
        alert(lang === 'ar' ? 'يرجى الموافقة على الشروط والأحكام لإتمام الحجز' : 'Please agree to terms and conditions to proceed');
        return;
      }
    }
    if (step < 4) {
      setStep(step + 1);
    } else if (step === 4) {
      await submitBooking();
    }
  };

  const submitBooking = async () => {
    if (cart.length === 0) {
      setBookingError(lang === 'ar' ? 'يرجى اختيار خدمة واحدة على الأقل' : 'Please select at least one service');
      return;
    }

    const CITY_NAME_TO_KEY = { 'الرياض': 'riyadh', 'الخبر': 'khobar', 'الدمام': 'dammam', 'جدة': 'jeddah' };
    const cityKey = CITY_NAME_TO_KEY[bookingDetails.city];

    const slotMatch = TIME_SLOTS.find((s) => s.time === bookingDetails.timeSlot);
    const slotKey = slotMatch?.id;

    // P1-8: no silent defaults (riyadh / slot-3) — block submit if city or slot is missing
    if (!cityKey || !slotKey) {
      setBookingError('يرجى اختيار المدينة والموعد');
      return;
    }

    const PAYMENT_METHOD_MAP = {
      tabby: 'TABBY', tamara: 'TAMARA', cash: 'CASH',
      card: 'CARD', applepay: 'APPLE_PAY', apple_pay: 'APPLE_PAY',
      paypal: 'CARD',
    };
    const paymentMethod = PAYMENT_METHOD_MAP[(bookingDetails.paymentMethod || '').toLowerCase()];

    setBookingLoading(true);
    setBookingError(null);

    try {
      console.log('CART DUMP:', JSON.parse(JSON.stringify(cart)));
      const result = await bookingsApi.create({
        customerName: bookingDetails.name.trim(),
        customerPhone: (bookingDetails.phone ?? '').replace(/\D/g, ''),
        city: cityKey,
        district: bookingDetails.district || undefined,
        address: bookingDetails.address || undefined,
        date: bookingDetails.date,
        timeSlotKey: slotKey,
        items: cart
          .filter((ci) => ci.category !== 'addon')
          .map((ci) => {
            // لو العنصر فيه slug يبقى دي باقة، غير كده يبقى خدمة
            if (ci.slug) {
              return { packageSlug: ci.slug, quantity: ci.quantity || 1 };
            }
            return { serviceSlug: ci.id, quantity: ci.quantity || 1 };
          }),
        paymentMethod,
        notes: bookingDetails.specialistNote || undefined,
      });

      setCreatedBooking(result);

      // إذا اختارت العميلة PayPal — نحاول التوجيه للدفع قبل صفحة النجاح
      if (bookingDetails.paymentMethod === 'paypal') {
        try {
          const pp = await paymentsApi.createPayPalOrder(result.id);
          if (pp && pp.approvalUrl) {
            window.location.href = pp.approvalUrl;
            return;
          }
        } catch (ppErr) {
          console.error('[PayPal redirect] failed:', ppErr);
          setBookingError(
            lang === 'ar'
              ? 'تم إنشاء حجزكِ، لكن تعذّر الاتصال بـ PayPal. يمكنكِ الدفع لاحقًا من بوابة العميلة.'
              : 'Booking created, but PayPal failed. You can pay later from your portal.'
          );
        }
      }

      setIsConfirmed(true);
      setStep(5);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (err) {
      console.error('[BookingModal] failed:', err);
      setBookingError(err.message || (lang === 'ar' ? 'فشل إنشاء الحجز. يرجى المحاولة مرة أخرى.' : 'Failed to create booking.'));
    } finally {
      setBookingLoading(false);
    }
  };

  const handlePrev = () => {
    if (step > 1 && step < 5) setStep(step - 1);
  };

  const handleAddonClick = (addon) => {
    addToCart({
      id: addon.id,
      title: addon.name,
      price: addon.price,
      duration: addon.duration,
      category: 'addon',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80',
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsBookingModalOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative bg-white rounded-3xl shadow-2xl border border-rose-200 w-full max-w-2xl overflow-hidden z-10 my-8"
      >
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-[#2A121D] via-[#451A2C] to-[#2A121D] p-5 sm:p-6 text-white flex items-center justify-between border-b border-[#F782A3]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E65A84]/20 border border-[#F782A3]/30 flex items-center justify-center">
              <FaCrown className="text-[#FFDF78] text-base" />
            </div>
            <div>
              <h3 className="font-bold text-lg sm:text-xl text-[#FFF7F9]">
                {t('bookingModalTitle')}
              </h3>
              <p className="text-xs text-rose-200/80">
                {t('bookingModalSub')}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsBookingModalOpen(false)}
            className="p-2 rounded-xl text-rose-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Step Indicator (Steps 1 to 4) */}
        {step < 5 && (
          <div className="bg-[#FFF5F7] px-6 py-3 border-b border-rose-100 flex items-center justify-between text-xs font-bold text-[#8E717D]">
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-[#CF3A69] text-white' : 'bg-rose-200 text-rose-600'}`}>
                1
              </span>
              <span className={step === 1 ? 'text-[#CF3A69]' : ''}>{t('stepServices')}</span>
            </div>
            <div className="w-8 h-0.5 bg-rose-200" />
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-[#CF3A69] text-white' : 'bg-rose-200 text-rose-600'}`}>
                2
              </span>
              <span className={step === 2 ? 'text-[#CF3A69]' : ''}>{t('stepDate')}</span>
            </div>
            <div className="w-8 h-0.5 bg-rose-200" />
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-[#CF3A69] text-white' : 'bg-rose-200 text-rose-600'}`}>
                3
              </span>
              <span className={step === 3 ? 'text-[#CF3A69]' : ''}>{t('stepLocation')}</span>
            </div>
            <div className="w-8 h-0.5 bg-rose-200" />
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 4 ? 'bg-[#CF3A69] text-white' : 'bg-rose-200 text-rose-600'}`}>
                4
              </span>
              <span className={step === 4 ? 'text-[#CF3A69]' : ''}>{t('stepPayment')}</span>
            </div>
          </div>
        )}

        {/* Modal Body with Step Views */}
        <div className="p-6 max-h-[68vh] overflow-y-auto">
          {/* STEP 1: Services in Cart & Add-ons */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h4 className="font-bold text-sm text-[#2B151F] mb-1">
                  {lang === 'ar' ? 'الخدمات المختارة في سلة حجزكِ:' : 'Selected Treatments in Your Bag:'}
                </h4>
                {cart.length === 0 ? (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                    {lang === 'ar' ? 'لم تختاري أي خدمة بعد. يمكنكِ إتمام الموعد وسيساعدكِ فريقنا على اختيار الباقة فور التواصل.' : 'No service selected yet. You can proceed and our coordinator will help you choose your package.'}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-rose-100 bg-[#FFFDFE] text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-bold text-[#2B151F]">{lang === 'ar' ? item.title : (item.titleEn || item.title)}</p>
                            <p className="text-[11px] text-[#8E717D]">
                              {lang === 'ar' ? `المدة: ${item.duration} | العدد: ${item.quantity}` : `Duration: ${item.duration} | Qty: ${item.quantity}`}
                            </p>
                          </div>
                        </div>
                        <span className="font-black text-[#CF3A69]">
                          {item.price * item.quantity} {t('currency')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recommended Add-ons */}
              <div>
                <h4 className="font-bold text-xs text-[#5A3F4B] mb-2 flex items-center gap-1.5">
                  <FiPlus className="text-[#E65A84]" /> {lang === 'ar' ? 'دللي نفسكِ بإضافات مميزة للجلسة:' : 'Enhance your session with optional add-ons:'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ADDONS.map((addon) => (
                    <button
                      key={addon.id}
                      onClick={() => handleAddonClick(addon)}
                      className="p-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] hover:bg-white hover:border-[#CF3A69] transition-all text-start flex items-center justify-between group"
                    >
                      <div>
                        <p className="font-bold text-xs text-[#2B151F] group-hover:text-[#CF3A69]">
                          {addon.name}
                        </p>
                        <p className="text-[10px] text-[#8E717D]">{addon.duration}</p>
                      </div>
                      <span className="text-xs font-black text-[#CF3A69] bg-[#FFEAF0] px-2 py-1 rounded-lg">
                        +{addon.price} {t('currency')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Date & Time Slot Picker */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#2B151F] mb-1.5 flex items-center gap-1.5">
                  <FiCalendar className="text-[#CF3A69]" /> {lang === 'ar' ? 'اختاري تاريخ الجلسة المفضل:' : 'Select preferred date:'}
                </label>
                <input
                  type="date"
                  value={bookingDetails.date}
                  onChange={(e) =>
                    setBookingDetails({ ...bookingDetails, date: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border border-rose-200 text-sm focus:outline-none focus:border-[#CF3A69]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B151F] mb-1.5 flex items-center gap-1.5">
                  <FiClock className="text-[#CF3A69]" /> {lang === 'ar' ? 'اختاري الفترة الزمنية المناسبة:' : 'Select preferred time slot:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = bookingDetails.timeSlot === slot.time;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() =>
                          setBookingDetails({ ...bookingDetails, timeSlot: slot.time })
                        }
                        className={`p-3 rounded-xl border text-start transition-all flex items-center justify-between ${isSelected
                            ? 'border-[#CF3A69] bg-[#FFF0F3] text-[#CF3A69] shadow-sm'
                            : 'border-rose-100 bg-[#FFFDFE] text-[#5A3F4B] hover:border-rose-200'
                          }`}
                      >
                        <div>
                          <p className="text-xs font-bold">{slot.time}</p>
                          <p className="text-[10px] text-[#8E717D]">{slot.period}</p>
                        </div>
                        {isSelected && <FiCheckCircle className="text-base text-[#CF3A69]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Location & Contact Details */}
          {step === 3 && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2B151F] mb-1 flex items-center gap-1">
                    <FiUser className="text-[#CF3A69]" /> {t('clientName')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'ar' ? 'مثال: نورة المحمد' : 'e.g. Sarah Ahmed'}
                    value={bookingDetails.name}
                    onChange={(e) =>
                      setBookingDetails({ ...bookingDetails, name: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-rose-200 text-xs focus:outline-none focus:border-[#CF3A69]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B151F] mb-1 flex items-center gap-1">
                    <FiPhone className="text-[#CF3A69]" /> {t('clientPhone')}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="05XXXXXXXX"
                    value={bookingDetails.phone}
                    onChange={(e) =>
                      setBookingDetails({ ...bookingDetails, phone: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-rose-200 text-xs focus:outline-none focus:border-[#CF3A69]"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2B151F] mb-1 flex items-center gap-1">
                    <FiMapPin className="text-[#CF3A69]" /> {t('city')}
                  </label>
                  <select
                    value={bookingDetails.city}
                    onChange={(e) =>
                      setBookingDetails({ ...bookingDetails, city: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-rose-200 text-xs focus:outline-none focus:border-[#CF3A69] bg-white"
                  >
                    <option value="الرياض">{t('riyadh')}</option>
                    <option value="الخبر">{t('khobar')}</option>
                    <option value="الدمام">{t('dammam')}</option>
                    <option value="جدة (قريباً)">{t('jeddah')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2B151F] mb-1">
                    {t('district')}
                  </label>
                  <input
                    type="text"
                    placeholder={lang === 'ar' ? 'مثال: النرجس، العليا، الشاطئ...' : 'e.g. Al Olaya, Al Narjis...'}
                    value={bookingDetails.district}
                    onChange={(e) =>
                      setBookingDetails({ ...bookingDetails, district: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-rose-200 text-xs focus:outline-none focus:border-[#CF3A69]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B151F] mb-1">
                  {t('address')}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'ar' ? 'الشارع، رقم المبنى (أو سيتم إرسال اللوكيشن)' : 'Street, building number or WhatsApp pin location'}
                  value={bookingDetails.address}
                  onChange={(e) =>
                    setBookingDetails({ ...bookingDetails, address: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-rose-200 text-xs focus:outline-none focus:border-[#CF3A69]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B151F] mb-1">
                  {t('specialistNote')}
                </label>
                <textarea
                  rows="2"
                  placeholder={lang === 'ar' ? 'مثال: ألم بالكتف، تفضيل زيوت لافندر فقط، جلسة هادئة...' : 'e.g. shoulder soreness, prefer lavender oil only...'}
                  value={bookingDetails.specialistNote}
                  onChange={(e) =>
                    setBookingDetails({ ...bookingDetails, specialistNote: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-rose-200 text-xs focus:outline-none focus:border-[#CF3A69]"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Payment Selection */}
          {step === 4 && (
            <div className="space-y-4">
              <h4 className="font-bold text-xs text-[#2B151F]">
                {lang === 'ar' ? 'اختاري طريقة الدفع المفضلة:' : 'Select preferred payment method:'}
              </h4>

              <div className="space-y-2.5">
                {/* Tabby */}
                <label
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${bookingDetails.paymentMethod === 'tabby'
                      ? 'border-[#2CE5AA] bg-[#2CE5AA]/10 ring-1 ring-[#2CE5AA]'
                      : 'border-rose-100 hover:border-rose-200 bg-white'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={bookingDetails.paymentMethod === 'tabby'}
                      onChange={() =>
                        setBookingDetails({ ...bookingDetails, paymentMethod: 'tabby' })
                      }
                      className="accent-[#2CE5AA]"
                    />
                    <div>
                      <p className="font-bold text-xs text-[#2B151F] flex items-center gap-2">
                        <span>{lang === 'ar' ? 'تابي (Tabby) - قسّميها على 4 دفعات' : 'Tabby - Split into 4 monthly payments'}</span>
                        <span className="text-[10px] bg-[#2CE5AA]/20 text-emerald-800 px-2 py-0.5 rounded-md font-black">
                          {lang === 'ar' ? 'بدون فوائد' : '0% Interest'}
                        </span>
                      </p>
                      <p className="text-[11px] text-[#5A3F4B] mt-0.5">
                        {lang === 'ar' ? `ادفعي ${tabbyInstallment} ر.س اليوم والباقي على 3 أشهر` : `Pay ${tabbyInstallment} SAR today, rest later`}
                      </p>
                    </div>
                  </div>
                  <span className="font-black text-[#2CE5AA] text-sm">tabby</span>
                </label>

                {/* Tamara */}
                <label
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${bookingDetails.paymentMethod === 'tamara'
                      ? 'border-[#FF6633] bg-[#FF855D]/10 ring-1 ring-[#FF6633]'
                      : 'border-rose-100 hover:border-rose-200 bg-white'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={bookingDetails.paymentMethod === 'tamara'}
                      onChange={() =>
                        setBookingDetails({ ...bookingDetails, paymentMethod: 'tamara' })
                      }
                      className="accent-[#FF6633]"
                    />
                    <div>
                      <p className="font-bold text-xs text-[#2B151F] flex items-center gap-2">
                        <span>{lang === 'ar' ? 'تمارا (Tamara) - قسّميها على 4 دفعات' : 'Tamara - Split into 4 installments'}</span>
                        <span className="text-[10px] bg-[#FF6633]/20 text-[#C4461C] px-2 py-0.5 rounded-md font-black">
                          Sharia
                        </span>
                      </p>
                      <p className="text-[11px] text-[#5A3F4B] mt-0.5">
                        {lang === 'ar' ? `قسط شهري بقيمة ${tabbyInstallment} ر.س` : `Monthly payment of ${tabbyInstallment} SAR`}
                      </p>
                    </div>
                  </div>
                  <span className="font-black text-[#FF6633] text-sm">tamara</span>
                </label>

                {/* Card / POS */}
                <label
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${bookingDetails.paymentMethod === 'card'
                      ? 'border-[#CF3A69] bg-[#FFF0F3] ring-1 ring-[#CF3A69]'
                      : 'border-rose-100 hover:border-rose-200 bg-white'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={bookingDetails.paymentMethod === 'card'}
                      onChange={() =>
                        setBookingDetails({ ...bookingDetails, paymentMethod: 'card' })
                      }
                      className="accent-[#CF3A69]"
                    />
                    <div>
                      <p className="font-bold text-xs text-[#2B151F]">
                        {lang === 'ar' ? 'بطاقة مدى / أبل باي عند وصول الأخصائية' : 'Mada / Apple Pay / Card with Therapist upon arrival'}
                      </p>
                      <p className="text-[11px] text-[#8E717D] mt-0.5">
                        {lang === 'ar' ? 'جهاز نقاط البيع (POS) متوفر مع الأخصائية' : 'Wireless POS terminal available with therapist'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-[#5A3F4B] font-bold">POS</span>
                </label>

                {/* Cash */}
                <label
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${bookingDetails.paymentMethod === 'cash'
                      ? 'border-[#CF3A69] bg-[#FFF0F3] ring-1 ring-[#CF3A69]'
                      : 'border-rose-100 hover:border-rose-200 bg-white'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={bookingDetails.paymentMethod === 'cash'}
                      onChange={() =>
                        setBookingDetails({ ...bookingDetails, paymentMethod: 'cash' })
                      }
                      className="accent-[#CF3A69]"
                    />
                    <div>
                      <p className="font-bold text-xs text-[#2B151F]">
                        {lang === 'ar' ? 'الدفع نقداً عند انتهاء الجلسة' : 'Cash on Delivery upon session completion'}
                      </p>
                      <p className="text-[11px] text-[#8E717D] mt-0.5">
                        {lang === 'ar' ? 'ادفعي بعد تمام رضاكِ عن الخدمة' : 'Pay after your complete satisfaction'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-rose-500 font-bold">💵 Cash</span>
                </label>

                {/* PayPal */}
                <label
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${bookingDetails.paymentMethod === 'paypal'
                      ? 'border-[#0070BA] bg-[#0070BA]/10 ring-1 ring-[#0070BA]'
                      : 'border-rose-100 hover:border-rose-200 bg-white'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={bookingDetails.paymentMethod === 'paypal'}
                      onChange={() =>
                        setBookingDetails({ ...bookingDetails, paymentMethod: 'paypal' })
                      }
                      className="accent-[#0070BA]"
                    />
                    <div>
                      <p className="font-bold text-xs text-[#2B151F] flex items-center gap-2">
                        <span>{lang === 'ar' ? 'PayPal - ادفعي أونلاين الآن' : 'PayPal - Pay online now'}</span>
                        <span className="text-[10px] bg-[#0070BA]/20 text-[#0070BA] px-2 py-0.5 rounded-md font-black">
                          {lang === 'ar' ? 'آمن' : 'Secure'}
                        </span>
                      </p>
                      <p className="text-[11px] text-[#8E717D] mt-0.5">
                        {lang === 'ar' ? 'ادفعي بأمان عبر PayPal Sandbox (تجريبي)' : 'Pay securely via PayPal (Sandbox - Test)'}
                      </p>
                    </div>
                  </div>
                  <span className="font-black text-[#0070BA] text-sm">PayPal</span>
                </label>
              </div>

              {bookingError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-700 text-xs font-bold">
                  ⚠️ {bookingError}
                </div>
              )}

              {/* Total Summary */}
              <div className="p-3 rounded-xl bg-[#FFF5F7] border border-rose-100 flex items-center justify-between text-xs">
                <span className="font-bold text-[#2B151F]">{lang === 'ar' ? 'إجمالي المبلغ للدفع:' : 'Total Payable Amount:'}</span>
                <span className="text-base font-black text-[#CF3A69]">{finalTotal} {t('currency')}</span>
              </div>
            </div>
          )}

          {/* STEP 5: Success & Instant Confirmation */}
          {step === 5 && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl shadow-md animate-bounce">
                <FiCheckCircle />
              </div>

              <div>
                <h4 className="text-xl font-black text-[#2B151F]">
                  {t('successTitle')}
                </h4>
                <p className="text-xs text-[#5A3F4B] max-w-md mx-auto mt-1 leading-relaxed">
                  {t('successDesc')}
                </p>
              </div>

              {createdBooking && createdBooking.bookingNumber && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#CF3A69] text-white text-sm font-black shadow-md">
                  <FiCheckCircle />
                  <span>{lang === 'ar' ? 'رقم الحجز:' : 'Booking #:'}</span>
                  <span dir="ltr" className="font-mono">{createdBooking.bookingNumber}</span>
                </div>
              )}

              {/* Summary Card */}
              <div className="p-4 rounded-2xl bg-[#FFF5F7] border border-rose-100 text-start text-xs space-y-1.5 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-[#8E717D]">{lang === 'ar' ? 'العميلة:' : 'Client:'}</span>
                  <span className="font-bold text-[#2B151F]">{bookingDetails.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E717D]">{lang === 'ar' ? 'الموعد:' : 'Schedule:'}</span>
                  <span className="font-bold text-[#2B151F]">{bookingDetails.date} ({bookingDetails.timeSlot})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E717D]">{lang === 'ar' ? 'المدينة:' : 'City:'}</span>
                  <span className="font-bold text-[#2B151F]">{bookingDetails.city} - {bookingDetails.district}</span>
                </div>
                <div className="flex justify-between border-t border-rose-200/60 pt-1.5">
                  <span className="text-[#8E717D]">{lang === 'ar' ? 'المبلغ الإجمالي:' : 'Total Amount:'}</span>
                  <span className="font-black text-[#CF3A69]">{Number(createdBooking?.totalPrice ?? finalTotal).toFixed(0)} {t('currency')}</span>
                </div>
              </div>

              {bookingError && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 text-xs font-bold max-w-md mx-auto">
                  ⚠️ {bookingError}
                </div>
              )}

              {/* Direct WhatsApp Confirmation Trigger */}
              <button
                onClick={sendWhatsAppBooking}
                className="w-full max-w-md mx-auto py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
              >
                <FaWhatsapp className="text-xl" />
                <span>{t('confirmViaWhatsapp')}</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer Controls (Steps 1 to 4) */}
        {step < 5 && (
          <div className="bg-[#FFFDFE] p-4 sm:p-5 border-t border-rose-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#5A3F4B] hover:bg-rose-50 transition-colors flex items-center gap-1.5"
              >
                {isRTL ? <FiArrowRight /> : <FiArrowLeft />} {t('prev')}
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={bookingLoading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#CF3A69] to-[#E65A84] text-white font-bold text-xs shadow-md shadow-rose-400/20 hover:opacity-95 transition-opacity flex items-center gap-1.5 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bookingLoading ? (
                <span>{lang === 'ar' ? 'جاري الحجز...' : 'Booking...'}</span>
              ) : (
                <>
                  <span>{step === 4 ? t('confirmBooking') : t('next')}</span>
                  {isRTL ? <FiArrowLeft /> : <FiArrowRight />}
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BookingModal;
