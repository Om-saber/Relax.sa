import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiSearch,
  FiClock,
  FiEye,
  FiShoppingBag,
  FiCheckCircle,
  FiShield,
  FiChevronDown,
  FiGift,
  FiArrowLeft,
  FiArrowRight,
  FiHeart
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { FaCrown, FaStar, FaWhatsapp } from 'react-icons/fa6';
import { useBooking } from '../context/BookingContext';
import { useLanguage } from '../context/LanguageContext';
import { usePackages } from '../hooks/useCatalog';

const PACKAGE_FILTERS = [
  { id: 'all', nameAr: 'جميع الباقات', nameEn: 'All Packages', icon: '👑' },
  { id: 'vip', nameAr: 'باقات VIP الملكية', nameEn: 'Royal VIP Packages', icon: '✨' },
  { id: 'popular', nameAr: 'الأكثر مبيعاً وطلباً', nameEn: 'Best Sellers', icon: '🔥' },
  { id: 'spa-rituals', nameAr: 'الطقوس الشاملة والعرائس', nameEn: 'Bridal & Full Rituals', icon: '🌸' },
];

const PACKAGES_FAQ = [
  {
    qAr: 'هل تشمل الباقة سرير المساج والمناشف أم يجب تحضيرها؟',
    qEn: 'Does the package include the massage bed and towels, or should I prepare them?',
    aAr: 'جميع باقات ليتس ريلاكس متكاملة 100%! تصل الأخصائية ومعها سرير مساج طبي فندقي واسع ومريح، ومفارش ومناشف قطنية معقمة ومغلفة استخدام لمرة واحدة تُفتح أمامكِ، إضافة للزيوت العضوية والشموع والموسيقى.',
    aEn: 'All Let\'s Relax packages are 100% all-inclusive! Our certified therapist arrives with an ergonomic hotel massage bed, single-use medical linens and towels opened in your presence, organic oils, candles, and ambient music.'
  },
  {
    qAr: 'كيف يمكنني تقسيط قيمة الباقة عبر تابي أو تمارا؟',
    qEn: 'How can I split the package cost via Tabby or Tamara?',
    aAr: 'يمكنكِ تقسيط أي باقة على 4 دفعات شهرية ميسرة بدون أي فوائد أو رسوم إضافية. اختاري تابي أو تمارا كطريقة دفع عند إتمام الحجز وادفعي ربع القيمة فقط اليوم.',
    aEn: 'You can split any package into 4 monthly payments with 0% interest and no hidden fees. Select Tabby or Tamara at booking and pay just 25% today.'
  },
  {
    qAr: 'هل يمكنني إهداء إحدى الباقات كهدية لصديقة أو قريبة؟',
    qEn: 'Can I gift one of the packages to a friend or relative?',
    aAr: 'نعم بكل تأكيد! يمكنكِ إهداء أي باقة من خلال صفحة "كروت الإهداء" بتصميم رقمي فاخر يحمل اسم المهدى إليها ورسالتكِ الخاصة، أو حجز الموعد مباشرة بعنوانها.',
    aEn: 'Absolutely! You can gift any package through our "Gift Cards" page with an exquisite digital luxury voucher customized with her name and message.'
  },
  {
    qAr: 'ما هي مدة الجلسات وكيف يتم تنسيق الموعد؟',
    qEn: 'What are the session durations and how is the schedule arranged?',
    aAr: 'تتراوح مدد الباقات بين 90 إلى 180 دقيقة حسب اختيارك. بمجرد اختيار الباقة والوقت المناسب، تتواصل معكِ منسقة المواعيد مباشرة عبر الواتساب لتأكيد وصول الأخصائية بدقة متناهية.',
    aEn: 'Package durations range between 90 to 180 minutes. Once you select your date and time, our coordinator confirms details via WhatsApp to ensure punctual arrival.'
  }
];

const PackagesPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const { addToCart, quickBookService, setActiveServiceModal, setIsBookingModalOpen } = useBooking();
  const { lang, isRTL, t } = useLanguage();

  // All packages from API (with mock fallback)
  const { packages: allPackages } = usePackages(lang);

  // Filtered & sorted packages
  const filteredPackages = useMemo(() => {
    return allPackages
      .filter((pkg) => {
        // Filter tabs
        if (activeFilter === 'vip') {
          if (!pkg.id.includes('vip') && !pkg.badge.includes('VIP') && !pkg.id.includes('bridal')) {
            return false;
          }
        } else if (activeFilter === 'popular') {
          if (!pkg.badge.includes('الأكثر') && !pkg.badge.includes('مميزة')) {
            return false;
          }
        } else if (activeFilter === 'spa-rituals') {
          if (!pkg.id.includes('bridal') && !pkg.id.includes('beauty') && !pkg.id.includes('pure')) {
            return false;
          }
        }

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = pkg.title.toLowerCase().includes(q) || pkg.titleEn.toLowerCase().includes(q);
          const matchDesc = pkg.description.toLowerCase().includes(q);
          const matchBenefits = pkg.benefits?.some((b) => b.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchBenefits) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
        return 0;
      });
  }, [allPackages, activeFilter, searchQuery, sortBy]);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="pt-18 pb-24 min-h-screen bg-[#FFF9FA]">

      {/* 1. ROYAL HERO HEADER */}
      <section className="relative overflow-hidden py-14 md:py-20 bg-gradient-to-b from-[#FFEAF0]/60 via-[#FFF9FA] to-[#FFF9FA]">
        {/* Ambient Luxury Background Lights */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFEAF0] text-[#CF3A69] text-xs font-black border border-rose-200 shadow-xs mb-4"
          >
            <FaCrown className="text-amber-500" />
            <span>{lang === 'ar' ? 'باقات الدلال والتجارب الفندقية الفاخرة' : 'Royal Spa Packages & VIP Experiences'}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#2B151F] tracking-tight font-serif"
          >
            {lang === 'ar' ? 'باقات السبا الملكية في راحة بيتكِ' : 'Royal Spa Packages at Home'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-[#8E717D] mt-4 max-w-2xl mx-auto leading-relaxed"
          >
            {lang === 'ar'
              ? 'صُممت هذه الباقات الشاملة خصيصاً لتمنحكِ تجربة تدليل ملكية متكاملة تجمع بين المساج الفاخر، الحمام المغربي، والعناية بالبشرة بكامل التجهيزات الفندقية المعقمة وأيدي أخصائيات معتمدات.'
              : 'Our curated all-inclusive packages combine signature massages, authentic Moroccan rituals, and skincare with complete 5-star hotel hygiene standards.'}
          </motion.p>

          {/* 4 Core Guarantees Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mt-10 text-xs font-bold text-[#5A3F4B]"
          >
            <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-rose-100/80 shadow-xs flex items-center justify-center gap-2.5">
              <span className="text-lg">🛏️</span>
              <span className="whitespace-nowrap">{lang === 'ar' ? 'سرير مساج فندقي مريح' : 'Hotel Massage Bed'}</span>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-rose-100/80 shadow-xs flex items-center justify-center gap-2.5">
              <span className="text-lg">🛡️</span>
              <span className="whitespace-nowrap">{lang === 'ar' ? 'تعقيم واستخدام فردي مغلف' : 'Medical Single-Use Tools'}</span>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-rose-100/80 shadow-xs flex items-center justify-center gap-2.5">
              <span className="text-lg">🌿</span>
              <span className="whitespace-nowrap">{lang === 'ar' ? 'زيوت فرنسية عضوية 100%' : '100% Organic Oils'}</span>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-rose-100/80 shadow-xs flex items-center justify-center gap-2.5">
              <span className="text-lg">💳</span>
              <span className="whitespace-nowrap">{lang === 'ar' ? 'تقسيط 0% تابي وتمارا' : '0% Tabby & Tamara'}</span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. CONTROLS & FILTER BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-10">
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-rose-100 shadow-lg shadow-rose-900/5 space-y-5">

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {PACKAGE_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeFilter === f.id
                  ? 'bg-gradient-to-r from-[#CF3A69] to-[#E65A84] text-white shadow-md shadow-rose-500/20'
                  : 'bg-[#FFF9FA] text-[#5A3F4B] hover:bg-rose-50 border border-rose-100'
                  }`}
              >
                <span>{f.icon}</span>
                <span>{lang === 'ar' ? f.nameAr : f.nameEn}</span>
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-3 border-t border-rose-100 items-center">
            {/* Search Input */}
            <div className="sm:col-span-8 relative">
              <FiSearch className="absolute start-3.5 top-3.5 text-[#CF3A69] text-base" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'ar' ? 'ابحثي في الباقات (مثلاً: أحجار بركانية، مساج عميق، عروس...)' : 'Search packages (e.g. bridal, hot stone, deep tissue)...'}
                className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-xs sm:text-sm text-[#2B151F] focus:outline-none focus:border-[#CF3A69] transition-all"
              />
            </div>

            {/* Sort Selector */}
            <div className="sm:col-span-4">
              <select
                aria-label="Sort Packages"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-xs sm:text-sm font-bold text-[#5A3F4B] focus:outline-none focus:border-[#CF3A69] transition-all cursor-pointer"
              >
                <option value="default">{lang === 'ar' ? 'الترتيب: الافتراضي والمميز' : 'Sort: Default'}</option>
                <option value="price-low">{lang === 'ar' ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
                <option value="price-high">{lang === 'ar' ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
                <option value="rating">{lang === 'ar' ? 'الأعلى تقييماً' : 'Highest Rated'}</option>
              </select>
            </div>
          </div>

        </div>
      </section>

      {/* 3. PACKAGES SHOWCASE GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">

        {/* Results Count & Current Filter Info */}
        <div className="flex items-center justify-between mb-6 px-1">
          <p className="text-xs sm:text-sm font-bold text-[#8E717D]">
            {lang === 'ar' ? `تم العثور على ${filteredPackages.length} باقة ملكية فاخرة` : `Found ${filteredPackages.length} luxury packages`}
          </p>

          <span className="text-xs font-bold text-[#CF3A69] bg-[#FFF0F3] px-3 py-1 rounded-xl border border-rose-200">
            {lang === 'ar' ? 'شاملة السرير والتجهيزات الفندقية' : 'Hotel Bed & Linens Included'}
          </span>
        </div>

        {/* Grid of Packages */}
        {filteredPackages.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-rose-100 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-[#CF3A69] text-2xl flex items-center justify-center mx-auto mb-4">
              <FiSearch />
            </div>
            <h3 className="text-lg font-bold text-[#2B151F]">
              {lang === 'ar' ? 'لم نعثر على باقة تطابق بحثكِ' : 'No packages matched your search'}
            </h3>
            <p className="text-xs text-[#8E717D] mt-2 mb-5">
              {lang === 'ar' ? 'جرّبي تغيير كلمات البحث أو استعراض جميع الباقات.' : 'Try adjusting your search terms or clearing filters.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#CF3A69] text-white text-xs font-bold hover:bg-[#B02652] transition-colors"
            >
              {lang === 'ar' ? 'إعادة ضبط البحث' : 'Reset Search'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPackages.map((pkg, idx) => {
              const discount = pkg.originalPrice ? pkg.originalPrice - pkg.price : 0;
              const isVip = pkg.id.includes('vip') || pkg.badge.includes('VIP') || pkg.id.includes('bridal');

              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className={`bg-white rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-2xl ${isVip
                    ? 'border-amber-300/80 hover:border-amber-400 ring-1 ring-amber-200/50'
                    : 'border-rose-100 hover:border-rose-300'
                    }`}
                >
                  {/* Top Image Container */}
                  <div className="relative h-64 w-full overflow-hidden bg-rose-50">
                    <img
                      src={pkg.image}
                      alt={lang === 'ar' ? pkg.title : pkg.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 right-3 left-3 flex items-center justify-between gap-2">
                      <span className={`text-white text-[11px] font-black px-3.5 py-1.5 rounded-full shadow-md backdrop-blur-md flex items-center gap-1.5 ${isVip
                        ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 border border-amber-300/60'
                        : 'bg-gradient-to-r from-[#CF3A69] to-[#E65A84]'
                        }`}>
                        <FaCrown className={isVip ? 'text-amber-200' : 'text-amber-300'} />
                        <span>{lang === 'ar' ? pkg.badge : pkg.badge}</span>
                      </span>

                      <div className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl text-[11px] font-bold text-[#2B151F] flex items-center gap-1 shadow-sm">
                        <FiClock className="text-[#CF3A69]" />
                        <span>{lang === 'ar' ? pkg.duration : (pkg.duration ?? '').replace('دقيقة', 'mins').replace('جلسات', 'sessions')}</span>
                      </div>
                    </div>

                    {/* Discount badge */}
                    {discount > 0 && (
                      <div className="absolute top-14 right-3">
                        <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-lg shadow-sm">
                          {lang === 'ar' ? `وفري ${discount} ر.س` : `Save ${discount} SAR`}
                        </span>
                      </div>
                    )}

                    {/* Title & Price overlay on image bottom */}
                    <div className="absolute bottom-3 right-3 left-3 flex items-end justify-between text-white">
                      <div className="max-w-[65%]">
                        <h3 className="font-black text-lg sm:text-xl text-white drop-shadow-sm leading-tight">
                          {lang === 'ar' ? pkg.title : pkg.titleEn}
                        </h3>
                        <p className="text-[11px] text-rose-200/95 font-serif mt-0.5 truncate">
                          {lang === 'ar' ? pkg.titleEn : pkg.title}
                        </p>
                      </div>

                      <div className="text-left bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shrink-0">
                        <span className="text-xl font-black text-[#FFDF78] block leading-tight">
                          {pkg.price} <span className="text-xs font-normal">{t('currency')}</span>
                        </span>
                        {pkg.originalPrice && (
                          <span className="text-[11px] text-gray-300 line-through block leading-none">
                            {pkg.originalPrice} {t('currency')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">

                    {/* Rating & Review Counter */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <FaStar className="text-xs fill-amber-400" />
                        <span className="text-[#2B151F] font-black">{pkg.rating || '5.0'}</span>
                        <span className="text-[11px] text-[#8E717D]">({pkg.reviewsCount || 180}+ {lang === 'ar' ? 'تقييم موثق' : 'reviews'})</span>
                      </div>
                      <span className="text-[11px] font-bold text-[#CF3A69] bg-[#FFEAF0] px-2.5 py-0.5 rounded-lg border border-rose-200/70">
                        {lang === 'ar' ? 'طاقم نسائي معتمد' : 'Female Certified'}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[#5A3F4B] leading-relaxed">
                      {lang === 'ar' ? pkg.description : `${pkg.titleEn} - A complete luxury spa ritual delivering ultimate serenity, hotel bedding, and medical hygiene.`}
                    </p>

                    {/* Inclusions checklist (What's included in this package) */}
                    <div className="p-3.5 rounded-2xl bg-[#FFF9FA] border border-rose-100 space-y-2">
                      <span className="text-[11px] font-black text-[#2B151F] block flex items-center gap-1.5">
                        <HiSparkles className="text-amber-500 text-xs" />
                        {lang === 'ar' ? 'تجهيزات ومشتملات الباقة:' : 'Package Inclusions:'}
                      </span>
                      <div className="space-y-1.5">
                        {(pkg.includes || [
                          'سرير مساج فندقي مريح ومتنقل',
                          'مفارش ومناشف قطنية معقمة ومغلفة استخدام فردي',
                          'زيوت عطرية فرنسية طبيعية 100%',
                          'أجواء شموع وموسيقى استرخاء'
                        ]).slice(0, 3).map((inc, i) => (
                          <div key={i} className="text-[11px] text-[#5A3F4B] flex items-center gap-2">
                            <FiCheckCircle className="text-emerald-500 text-xs shrink-0" />
                            <span className="truncate">{inc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tabby 4 installments calculation */}
                    <div className="p-3 rounded-2xl bg-[#2CE5AA]/10 border border-[#2CE5AA]/30 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[#128a64] font-bold block">
                          {t('tabbySplit')}
                        </span>
                        <span className="text-[10px] text-[#128a64]/80">
                          {t('noInterest')}
                        </span>
                      </div>
                      <span className="font-black text-[#128a64] text-sm">
                        {pkg.tabbyInstallment} {t('tabbyPerMonth')}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveServiceModal(pkg)}
                        className="p-3 rounded-2xl border border-rose-200 hover:border-[#CF3A69] text-[#5A3F4B] hover:text-[#CF3A69] bg-white transition-colors cursor-pointer"
                        title={t('viewDetails')}
                      >
                        <FiEye className="text-base" />
                      </button>

                      <button
                        type="button"
                        onClick={() => addToCart(pkg)}
                        className="p-3 rounded-2xl border border-rose-200 hover:border-[#CF3A69] text-[#5A3F4B] hover:text-[#CF3A69] bg-white transition-colors cursor-pointer"
                        title={t('addToCart')}
                      >
                        <FiShoppingBag className="text-base" />
                      </button>

                      <button
                        type="button"
                        onClick={() => quickBookService(pkg)}
                        className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#CF3A69] via-[#E65A84] to-[#CF3A69] text-white font-black text-xs shadow-md shadow-rose-400/25 hover:shadow-lg hover:scale-[1.01] active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                      >
                        <FaCrown className="text-[#FFDF78] text-xs shrink-0" />
                        <span>{lang === 'ar' ? 'احجزي الباقة الآن' : 'Book Package'}</span>
                      </button>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </section>

      {/* 4. WHY CHOOSE OUR PACKAGES (Perks Banner) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-gradient-to-br from-[#2B151F] via-[#3D1D2B] to-[#2B151F] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl border border-rose-900/40">

          <div className="relative z-10 text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-rose-200 text-xs font-bold border border-white/15 mb-3">
              <FaCrown className="text-[#D4AF37]" />
              <span>{lang === 'ar' ? 'الفخامة في أدق التفاصيل' : 'Luxury in Every Detail'}</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-serif">
              {lang === 'ar' ? 'ما الذي يجعل باقات Let\'s Relax استثنائية؟' : 'Why Are Let\'s Relax Packages Exceptional?'}
            </h2>
            <p className="text-xs sm:text-sm text-rose-200/80 mt-2">
              {lang === 'ar' ? 'نحن لا نقدم مجرد مساج، بل ننقل إليكِ تجربة منتجع 5 نجوم بالكامل داخل خصوصية منزلكِ.' : 'We don’t just provide a massage; we bring a full 5-star spa sanctuary to the comfort of your home.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:border-rose-400/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#CF3A69] to-[#E65A84] flex items-center justify-center text-xl mb-3 shadow-md">
                🛏️
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">
                {lang === 'ar' ? 'سرير مساج فندقي فاخر' : 'Hotel Massage Bed'}
              </h3>
              <p className="text-xs text-rose-200/70 leading-relaxed">
                {lang === 'ar' ? 'سرير طبي مصمم هندسياً لتوفير أقصى درجات الراحة لعمودكِ الفقري وعضلات الرقبة.' : 'Ergonomically designed for supreme neck and spine comfort throughout the session.'}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:border-rose-400/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#CF3A69] to-[#E65A84] flex items-center justify-center text-xl mb-3 shadow-md">
                🛡️
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">
                {lang === 'ar' ? 'مستلزمات مغلفة أحادية' : 'Single-Use Sealed Linens'}
              </h3>
              <p className="text-xs text-rose-200/70 leading-relaxed">
                {lang === 'ar' ? 'مفارش السرير، أرواب الاستحمام، والليفة المغربية تُفتح بحضوركِ وتُستخدم لمرة واحدة فقط.' : 'Linens, bathrobes, and scrub gloves are opened strictly in your presence and used once.'}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:border-rose-400/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#CF3A69] to-[#E65A84] flex items-center justify-center text-xl mb-3 shadow-md">
                🌿
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">
                {lang === 'ar' ? 'زيوت فرنسية ومغربية' : 'Pure Organic Oils'}
              </h3>
              <p className="text-xs text-rose-200/70 leading-relaxed">
                {lang === 'ar' ? 'مستخلصات اللافندر، المسك، والأرجان الأصلي بدون أي مواد كيميائية أو بارابين.' : 'Pure extracts of Lavender, Musk, and authentic Moroccan Argan, completely chemical-free.'}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:border-rose-400/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#CF3A69] to-[#E65A84] flex items-center justify-center text-xl mb-3 shadow-md">
                🕯️
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">
                {lang === 'ar' ? 'طقوس الشموع والموسيقى' : 'Sensory Ambience'}
              </h3>
              <p className="text-xs text-rose-200/70 leading-relaxed">
                {lang === 'ar' ? 'تجهيز الغرفة بالشموع المهدئة وموسيقى السبا لتعيشي تجربة استرخاء تفصلكِ عن صخب اليوم.' : 'Gentle ambient spa music and aromatherapy candles that isolate you from daily stress.'}
              </p>
            </div>
          </div>

          {/* Action button inside banner */}
          <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
            <div>
              <p className="text-sm font-bold text-white">
                {lang === 'ar' ? 'هل تودين الاستفسار أو تنسيق باقة خاصة؟' : 'Need help selecting or customizing a package?'}
              </p>
              <p className="text-xs text-rose-200/70 mt-0.5">
                {lang === 'ar' ? 'منسقة المواعيد متواجدة لمساعدتكِ فوراً عبر الواتساب على مدار الساعة.' : 'Our booking coordinators are available on WhatsApp around the clock.'}
              </p>
            </div>

            <a
              href="https://wa.me/966537313756"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-colors whitespace-nowrap"
            >
              <FaWhatsapp className="text-base" />
              <span>{lang === 'ar' ? 'تواصل مباشر واتساب 0537313756' : 'Chat via WhatsApp'}</span>
            </a>
          </div>

        </div>
      </section>

      {/* 5. PACKAGES FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEAF0] text-[#CF3A69] text-xs font-bold border border-rose-200 mb-2">
            <HiSparkles className="text-amber-500" />
            <span>{lang === 'ar' ? 'إجابات واضحة' : 'FAQ'}</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2B151F]">
            {lang === 'ar' ? 'الأسئلة الشائعة حول الباقات' : 'Frequently Asked Questions about Packages'}
          </h2>
        </div>

        <div className="space-y-3">
          {PACKAGES_FAQ.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-rose-100 overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-start font-bold text-sm sm:text-base text-[#2B151F] flex items-center justify-between gap-4 cursor-pointer hover:bg-rose-50/50 transition-colors"
                >
                  <span>{lang === 'ar' ? item.qAr : item.qEn}</span>
                  <FiChevronDown
                    className={`text-[#CF3A69] text-lg shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-[#5A3F4B] leading-relaxed border-t border-rose-50 pt-3"
                    >
                      {lang === 'ar' ? item.aAr : item.aEn}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. BOTTOM CTA BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#FFEAF0] via-white to-[#FFEAF0] border border-rose-200 p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#CF3A69] to-[#E65A84] text-white flex items-center justify-center text-xl shadow-md">
            <FaCrown className="text-amber-300" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#2B151F]">
            {lang === 'ar' ? 'جاهزة لتجربة الدلال التي تستحقينها؟' : 'Ready for the Royal Pampering You Deserve?'}
          </h3>
          <p className="text-xs sm:text-sm text-[#8E717D] max-w-xl">
            {lang === 'ar'
              ? 'احجزي باقتكِ المفضلة الآن في الرياض أو الخبر أو الدمام، ودعي فريقنا المتخصص يعتني بكل تفاصيل راحتكِ.'
              : 'Book your favorite package in Riyadh, Khobar, or Dammam, and let our specialists pamper you.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsBookingModalOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#CF3A69] via-[#E65A84] to-[#CF3A69] text-white font-black text-xs sm:text-sm shadow-md shadow-rose-400/25 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            >
              <FaCrown className="text-[#FFDF78]" />
              <span>{t('bookNow')}</span>
            </button>

            <Link
              to="/services"
              className="px-6 py-3.5 rounded-2xl bg-white border border-rose-200 text-[#4A2838] font-bold text-xs sm:text-sm hover:border-[#CF3A69] hover:bg-rose-50 transition-all flex items-center gap-2"
            >
              <span>{lang === 'ar' ? 'تصفح الخدمات الفردية' : 'Explore Individual Services'}</span>
              {isRTL ? <FiArrowLeft /> : <FiArrowRight />}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default PackagesPage;
