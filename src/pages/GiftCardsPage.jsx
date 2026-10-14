import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  FiGift,
  FiCheckCircle,
  FiZoomIn,
  FiX,
  FiHeart
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { FaCrown, FaWhatsapp, FaGem } from 'react-icons/fa6';
import { SERVICES } from '../data/servicesData';
import { useLanguage } from '../context/LanguageContext';

const THEMES = {
  rosegold: {
    id: 'rosegold',
    nameAr: 'وردي ملكي 🌸',
    nameEn: 'Royal Rose 🌸',
    editionAr: 'الإصدار الوردي الملكي مع علبة مخملية وبتلات الورد الطبيعي',
    editionEn: 'Royal Blush Velvet Edition with fresh rose petals',
    image: '/images/gift-voucher-rose.jpg',
    accent: '#CF3A69',
    badgeClass: 'bg-[#FFEAF0] text-[#CF3A69] border-rose-200',
    ringClass: 'ring-[#CF3A69]',
    glowClass: 'shadow-rose-500/20',
  },
  darkplum: {
    id: 'darkplum',
    nameAr: 'مخملي داكن ✨',
    nameEn: 'Velvet Dark ✨',
    editionAr: 'الإصدار الملوكي الداكن بالساتان والذهب والختم الشمعي',
    editionEn: 'Royal Dark Velvet & Gold Satin Edition with wax seal',
    image: '/images/gift-voucher-dark.jpg',
    accent: '#D4AF37',
    badgeClass: 'bg-[#2B151F] text-[#FFDF78] border-[#D4AF37]/40',
    ringClass: 'ring-[#D4AF37]',
    glowClass: 'shadow-amber-500/25',
  },
  champagne: {
    id: 'champagne',
    nameAr: 'شامبين وذهب 👑',
    nameEn: 'Champagne 👑',
    editionAr: 'إصدار الشامبين واللؤلؤ مع زهور الأوركيد والختم الذهبي',
    editionEn: 'Champagne & Pearl Silk Edition with orchids & gold seal',
    image: '/images/gift-voucher-champagne.jpg',
    accent: '#B8860B',
    badgeClass: 'bg-[#FDF6ED] text-[#997B24] border-[#D4AF37]/50',
    ringClass: 'ring-[#D4AF37]',
    glowClass: 'shadow-amber-400/20',
  },
};

const GiftCardsPage = () => {
  const { lang, t } = useLanguage();

  const [recipient, setRecipient] = useState(lang === 'ar' ? ' ' : '');
  const [sender, setSender] = useState(lang === 'ar' ? 'سارة ناصر' : 'Sarah Nasser');
  const [message, setMessage] = useState(
    lang === 'ar'
      ? ''
      : ''
  );
  const [selectedServiceId, setSelectedServiceId] = useState('calm-package');
  const [theme, setTheme] = useState('rosegold');
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const selectedService = SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0];
  const currentTheme = THEMES[theme] || THEMES.rosegold;

  const handleOrderGift = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });

    const themeName = lang === 'ar' ? currentTheme.nameAr : currentTheme.nameEn;

    const giftMessage = `🌸 *Gift Voucher Request - Let's Relax* 🌸
-----------------------------------------
🎁 To: ${recipient}
👤 From: ${sender}
✨ Package: ${selectedService.title} (${selectedService.price} SAR)
🎨 Edition Style: ${themeName}
💌 Message:
"${message}"

Please contact me to arrange voucher delivery and schedule the session. Thank you!`;

    const encoded = encodeURIComponent(giftMessage);
    window.open(`https://wa.me/966537313756?text=${encoded}`, '_blank');
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#FFF9FA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Banner */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFEAF0] text-[#CF3A69] text-xs font-bold border border-rose-200 mb-3 whitespace-nowrap">
            <FiGift />
            <span>{t('giftBadge')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#2B151F]">
            {lang === 'ar' ? 'كروت الإهداء الملكية المخصصة' : 'Custom Royal Spa Gift Vouchers'}
          </h1>
          <p className="text-sm sm:text-base text-[#8E717D] mt-3">
            {t('giftDesc')}
          </p>
        </div>

        {/* Customizer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Controls Form (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-[#2B151F] flex items-center gap-2 border-b border-rose-100 pb-3">
              <FaCrown className="text-[#CF3A69]" />
              <span>{lang === 'ar' ? 'بيانات وتفاصيل كارت الإهداء' : 'Gift Card Details & Options'}</span>
            </h3>

            {/* Recipient */}
            <div>
              <label className="block text-xs font-bold text-[#2B151F] mb-1">
                {lang === 'ar' ? 'اسم المهدى إليها (لمن هذا الكارت؟):' : 'Recipient Name (Gifted To):'}
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder={lang === 'ar' ? 'ادخل اسم المهدى إليها' : 'Enter the recipient name'}
                className="w-full p-3 rounded-xl border border-rose-200 text-xs text-[#2B151F] focus:outline-none focus:border-[#CF3A69]"
              />
            </div>

            {/* Sender */}
            <div>
              <label className="block text-xs font-bold text-[#2B151F] mb-1">
                {lang === 'ar' ? 'اسمكِ (مُقدم الهدية):' : 'Your Name (Sender):'}
              </label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder={lang === 'ar' ? 'اسمكِ الكريم' : 'Your name'}
                className="w-full p-3 rounded-xl border border-rose-200 text-xs text-[#2B151F] focus:outline-none focus:border-[#CF3A69]"
              />
            </div>

            {/* Service selection */}
            <div>
              <label className="block text-xs font-bold text-[#2B151F] mb-1">
                {lang === 'ar' ? 'اختاري باقة أو خدمة الإهداء:' : 'Choose Treatment Package:'}
              </label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full p-3 rounded-xl border border-rose-200 text-xs font-bold text-[#2B151F] focus:outline-none focus:border-[#CF3A69] bg-white"
              >
                {SERVICES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {lang === 'ar' ? s.title : s.titleEn} ({s.price} {t('currency')} - {s.duration})
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-bold text-[#2B151F] mb-1">
                {lang === 'ar' ? 'رسالتكِ الخاصة المكتوبة على الكارت:' : 'Personal Message on the Voucher:'}
              </label>
              <textarea
                rows="3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={lang === 'ar' ? 'اكتبي كلماتكِ اللطيفة لها...' : 'Write your heartfelt message...'}
                className="w-full p-3 rounded-xl border border-rose-200 text-xs text-[#2B151F] focus:outline-none focus:border-[#CF3A69]"
              />
            </div>

            {/* Theme selector */}
            <div>
              <label className="block text-xs font-bold text-[#2B151F] mb-2">
                {lang === 'ar' ? 'اختاري تصميم ولون الكارت والتغليف:' : 'Card & Box Edition Style:'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(THEMES).map((th) => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setTheme(th.id)}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center justify-center gap-1 ${theme === th.id
                      ? `${th.badgeClass} ring-2 ${th.ringClass} font-black shadow-sm`
                      : 'border-rose-100 hover:bg-rose-50/70 text-[#5A3F4B]'
                      }`}
                  >
                    <span>{lang === 'ar' ? th.nameAr : th.nameEn}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Order CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleOrderGift}
                className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
              >
                <FaWhatsapp className="text-xl" />
                <span>{lang === 'ar' ? 'إرسال وطلب كارت الإهداء عبر الواتساب' : 'Order Gift Card via WhatsApp'}</span>
              </button>
            </div>
          </div>

          {/* Luxury Gift Card Photo Showcase (6 cols) */}
          <div className="lg:col-span-6 space-y-4">

            {/* Preview Section Header */}
            <div className="flex items-center justify-between text-xs font-bold text-[#8E717D] px-2">
              <span className="flex items-center gap-1.5 text-[#2B151F]">
                <FaGem className="text-[#CF3A69]" />
                {lang === 'ar' ? 'معاينة كارت وتغليف الإهداء الفاخر:' : 'Luxury Voucher Showcase:'}
              </span>
              <span className="text-[#CF3A69] flex items-center gap-1 whitespace-nowrap bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                <HiSparkles /> {lang === 'ar' ? 'طباعة وتغليف ملكي' : 'Royal Packaging'}
              </span>
            </div>

            {/* The Photo Showcase Frame */}
            <div className={`relative rounded-3xl overflow-hidden border-2 border-rose-200 shadow-2xl bg-[#1E0B14] transition-all duration-500 group ${currentTheme.glowClass}`}>

              {/* Animated Image with Smooth Crossfade */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#2B121D]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentTheme.image}
                    src={currentTheme.image}
                    alt={lang === 'ar' ? currentTheme.editionAr : currentTheme.editionEn}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45 }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </AnimatePresence>

                {/* Subtle vignette gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

                {/* Top Badge: Certified Voucher */}
                <div className="absolute top-3.5 right-3.5 z-10">
                  <div className="px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/25 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-lg">
                    <FaCrown className="text-[#FFDF78]" />
                    <span>Let's Relax • {lang === 'ar' ? 'كارت معتمد' : 'Voucher'}</span>
                  </div>
                </div>

                {/* Top Left: Zoom Lightbox Button */}
                <div className="absolute top-3.5 left-3.5 z-10">
                  <button
                    type="button"
                    onClick={() => setIsZoomOpen(true)}
                    className="p-2 rounded-full bg-black/45 hover:bg-black/70 backdrop-blur-md border border-white/25 text-white hover:text-[#FFDF78] transition-all text-sm shadow-lg flex items-center gap-1 group/btn"
                    title={lang === 'ar' ? 'تكبير الصورة' : 'Zoom Image'}
                  >
                    <FiZoomIn className="text-base" />
                    <span className="text-[10px] pe-1 hidden sm:inline font-bold">
                      {lang === 'ar' ? 'تكبير' : 'Zoom'}
                    </span>
                  </button>
                </div>

                {/* Bottom Overlay: Theme Edition Info */}
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 z-10 text-white">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[10px] font-bold mb-1.5">
                    <HiSparkles className="text-[#FFDF78]" />
                    <span>{lang === 'ar' ? currentTheme.nameAr : currentTheme.nameEn}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-rose-100/95 leading-relaxed drop-shadow">
                    {lang === 'ar' ? currentTheme.editionAr : currentTheme.editionEn}
                  </p>
                </div>
              </div>

              {/* Theme Edition Quick-Switch Selector Bar */}
              <div className="bg-[#2B151F] p-3 border-t border-white/10 flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-rose-200/80 hidden sm:inline">
                  {lang === 'ar' ? 'إصدارات الكارت الفاخرة:' : 'Available Editions:'}
                </span>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
                  {Object.values(THEMES).map((th) => (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => setTheme(th.id)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 ${theme === th.id
                        ? 'bg-gradient-to-r from-[#CF3A69] to-[#E65A84] text-white shadow-md scale-105'
                        : 'bg-white/10 hover:bg-white/20 text-rose-100/80 border border-white/10'
                        }`}
                    >
                      <span>{lang === 'ar' ? th.nameAr : th.nameEn}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Personalized Dedication Preview Card */}
            <div className="bg-gradient-to-br from-white via-[#FFF9FA] to-rose-50/40 rounded-3xl p-5 border border-rose-200 shadow-md space-y-3 relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#CF3A69]/5 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-rose-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <FiHeart className="text-[#CF3A69]" />
                  <span className="text-xs font-black text-[#2B151F]">
                    {lang === 'ar' ? 'تفاصيل الإهداء المطبوعة داخل الكارت' : 'Printed Voucher Dedication Details'}
                  </span>
                </div>
                <span className="text-[10px] text-[#CF3A69] font-bold bg-[#FFEAF0] px-2 py-0.5 rounded-full">
                  {lang === 'ar' ? 'طباعة مذهبة فاخرة' : 'Gold Foil Print'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white/80 p-2.5 rounded-xl border border-rose-100">
                  <span className="text-[10px] text-[#8E717D] block mb-0.5">
                    {lang === 'ar' ? 'إلى العزيزة الغالية:' : 'Gifted To:'}
                  </span>
                  <span className="font-black text-[#2B151F] truncate block">
                    {recipient || (lang === 'ar' ? 'أمي الحبيبة ❤️' : 'Recipient')}
                  </span>
                </div>

                <div className="bg-white/80 p-2.5 rounded-xl border border-rose-100">
                  <span className="text-[10px] text-[#8E717D] block mb-0.5">
                    {lang === 'ar' ? 'مُقدّم الهدية:' : 'From:'}
                  </span>
                  <span className="font-bold text-[#2B151F] truncate block">
                    {sender || (lang === 'ar' ? 'سارة ناصر' : 'Sender')}
                  </span>
                </div>
              </div>

              {/* Selected package */}
              <div className="bg-white/80 p-2.5 rounded-xl border border-rose-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#8E717D]">
                  {lang === 'ar' ? 'الباقة المهداة:' : 'Treatment Package:'}
                </span>
                <span className="font-black text-[#CF3A69]">
                  {lang === 'ar' ? selectedService.title : selectedService.titleEn} ({selectedService.duration})
                </span>
              </div>

              {/* Message quote */}
              <div className="p-3 rounded-xl bg-white/90 border border-rose-100 text-xs text-[#5A3F4B] italic leading-relaxed border-s-4 border-s-[#CF3A69]">
                "{message || (lang === 'ar' ? 'تستاهلين كل الراحة والدلال...' : 'Wishing you utmost relaxation...')}"
              </div>
            </div>

            {/* Note & Luxury Delivery Guarantee */}
            <div className="p-4 rounded-2xl bg-white border border-rose-100 text-xs text-[#5A3F4B] flex items-start gap-2.5 shadow-sm">
              <FiCheckCircle className="text-emerald-500 text-base shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {lang === 'ar'
                  ? 'يُسلّم كارت الإهداء بظرف وعلبة مخملية فاخرة ومختومة بالشمع مع زهور طبيعية، ويتم التنسيق مباشرة مع المهدى إليها بسرية واحترافية تامة.'
                  : 'Delivered in a velvet luxury box with genuine wax seal and flowers, coordinated privately with the recipient.'}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isZoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomOpen(false)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            <div
              className="relative max-w-4xl w-full bg-[#1E0B14] rounded-3xl overflow-hidden border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all border border-white/20"
              >
                <FiX className="text-xl" />
              </button>

              <img
                src={currentTheme.image}
                alt={lang === 'ar' ? currentTheme.editionAr : currentTheme.editionEn}
                className="w-full h-auto max-h-[80vh] object-contain mx-auto"
              />

              <div className="p-4 sm:p-6 bg-gradient-to-t from-black via-black/80 to-transparent text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-white/10">
                <div>
                  <h4 className="text-base sm:text-lg font-black flex items-center gap-2">
                    <FaCrown className="text-[#FFDF78]" />
                    <span>{lang === 'ar' ? currentTheme.nameAr : currentTheme.nameEn}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-rose-200/80 mt-1">
                    {lang === 'ar' ? currentTheme.editionAr : currentTheme.editionEn}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {Object.values(THEMES).map((th) => (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => setTheme(th.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${theme === th.id
                        ? 'bg-[#CF3A69] text-white ring-2 ring-white/50'
                        : 'bg-white/10 hover:bg-white/20 text-white/80'
                        }`}
                    >
                      {lang === 'ar' ? th.nameAr : th.nameEn}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default GiftCardsPage;
