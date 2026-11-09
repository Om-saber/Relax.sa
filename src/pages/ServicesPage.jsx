import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiSearch, 
  FiClock, 
  FiEye, 
  FiShoppingBag, 
  FiCheckCircle 
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { FaCrown } from 'react-icons/fa6';
import { useBooking } from '../context/BookingContext';
import { useLanguage } from '../context/LanguageContext';
import { useServices, useCategories } from '../hooks/useCatalog';

const ServicesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialCategory = searchParams.get('cat') || 'all';

  const [activeCategory, setActiveCategory] = useState(
    initialCategory === 'packages' ? 'all' : initialCategory
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [durationFilter, setDurationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  const { addToCart, quickBookService, setActiveServiceModal } = useBooking();
  const { lang, t } = useLanguage();

  // --- Catalog from API (auto-fallback to mock) ---
  const { services: apiServices } = useServices({}, lang);
  const { categories: apiCategories } = useCategories(lang);
  const SERVICES = apiServices;
  const CATEGORIES = apiCategories;

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat === 'packages') {
      navigate('/packages', { replace: true });
    } else if (cat) {
      setActiveCategory(cat);
    }
  }, [searchParams, navigate]);

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setSearchParams(catId === 'all' ? {} : { cat: catId });
  };

  // Filter out 'packages' category for the Services page
  const servicesCategories = useMemo(() => {
    const rawCategories = CATEGORIES.filter((c) => c.id !== 'packages');
    const individualCount = SERVICES.filter((s) => s.category !== 'packages').length;
    return rawCategories.map((c) => {
      if (c.id === 'all') {
        return { ...c, count: individualCount };
      }
      return c;
    });
  }, [apiCategories, apiServices]);

  const getCategoryName = (id, fallback) => {
    switch (id) {
      case 'all': return t('catAll');
      case 'massage': return t('catMassage');
      case 'moroccan': return t('catMoroccan');
      case 'beauty': return t('catBeauty');
      case 'maternity': return t('catMaternity');
      default: return fallback;
    }
  };

  // Strictly filter out any package from Services page
  const filteredServices = useMemo(() => {
    return SERVICES.filter((s) => {
      // Exclude all packages (packages have their dedicated page /packages)
      if (s.category === 'packages') {
        return false;
      }

      if (activeCategory !== 'all' && s.category !== activeCategory) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = s.title.toLowerCase().includes(q) || s.titleEn.toLowerCase().includes(q);
        const matchesDesc = s.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc) return false;
      }

      if (durationFilter !== 'all') {
        if (!s.duration.includes(durationFilter)) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });
  }, [apiServices, activeCategory, searchQuery, durationFilter, sortBy]);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#FFF9FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Banner */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFEAF0] text-[#CF3A69] text-xs font-bold border border-rose-200 mb-3 whitespace-nowrap">
            <HiSparkles className="text-amber-500" />
            <span>{lang === 'ar' ? 'قائمة جلسات السبا الفردية' : 'Individual Spa Treatments Catalog'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#2B151F]">
            {lang === 'ar' ? "جلسات وخدمات Let's Relax" : "Let's Relax Spa Services"}
          </h1>
          <p className="text-sm sm:text-base text-[#8E717D] mt-3">
            {lang === 'ar' ? 'اختاري الجلسة المناسبة لاحتياج جسمكِ من المساج التخصصي، الحمام المغربي، أو العناية بالبشرة، وتصلكِ أخصائيتنا بكامل التجهيزات والتعقيم في منزلكِ.' : 'Explore our individual massages, Moroccan bath rituals, and skincare treatments delivered to your home by certified female therapists.'}
          </p>
        </div>

        {/* Packages Promo Callout Bar */}
        <div className="mb-8 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-rose-50/80 to-amber-500/10 border border-amber-300/50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3.5 text-center sm:text-start">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
              <FaCrown className="text-amber-500 text-xl" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-black text-[#2B151F]">
                {lang === 'ar' ? 'هل تبحثين عن باقات الدلال وتجارب الـ VIP المتكاملة؟' : 'Looking for Royal Indulgence & VIP Packages?'}
              </p>
              <p className="text-[11px] text-[#8E717D] mt-0.5">
                {lang === 'ar' ? 'تفضلي بزيارة صفحة الباقات الخاصة لتجربة شاملة مع سرير مساج فندقي ومناشف معقمة مشمولة مجاناً.' : 'Visit our dedicated packages page for all-inclusive rituals with hotel bedding.'}
              </p>
            </div>
          </div>
          <Link
            to="/packages"
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#CF3A69] via-[#E65A84] to-[#CF3A69] text-white text-xs font-black shadow-md shadow-rose-400/25 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap flex items-center gap-2"
          >
            <FaCrown className="text-amber-300 text-xs" />
            <span>{lang === 'ar' ? 'استعراض صفحة الباقات' : 'Visit Packages Page'}</span>
          </Link>
        </div>

        {/* Filters and Controls Card */}
        <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-lg mb-10 space-y-6">
          
          {/* Category Tabs (Packages Excluded) */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {servicesCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-[#CF3A69] to-[#E65A84] text-white shadow-md shadow-rose-500/20'
                    : 'bg-[#FFF9FA] text-[#5A3F4B] hover:bg-rose-50 border border-rose-100'
                }`}
              >
                <span>{getCategoryName(cat.id, cat.name)}</span>
                <span className="opacity-80 text-[11px] mx-1">({cat.count})</span>
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-rose-100 items-center">
            {/* Search Input (6 cols) */}
            <div className="sm:col-span-6 relative">
              <FiSearch className="absolute start-3.5 top-3 text-[#CF3A69] text-sm" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'ar' ? 'ابحثي عن خدمة بالاسم أو الفائدة...' : 'Search treatment by name or benefit...'}
                className="w-full ps-10 pe-3 py-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-xs text-[#2B151F] focus:outline-none focus:border-[#CF3A69]"
              />
            </div>

            {/* Duration filter (3 cols) */}
            <div className="sm:col-span-3">
              <select
                aria-label="Duration"
                value={durationFilter}
                onChange={(e) => setDurationFilter(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-xs font-bold text-[#5A3F4B] focus:outline-none focus:border-[#CF3A69] cursor-pointer"
              >
                <option value="all">{lang === 'ar' ? 'كل المدد الزمنية' : 'All Durations'}</option>
                <option value="60">{lang === 'ar' ? '60 دقيقة' : '60 Minutes'}</option>
                <option value="75">{lang === 'ar' ? '75 دقيقة' : '75 Minutes'}</option>
                <option value="90">{lang === 'ar' ? '90 دقيقة' : '90 Minutes'}</option>
                <option value="120">{lang === 'ar' ? '120 دقيقة' : '120 Minutes'}</option>
              </select>
            </div>

            {/* Sort filter (3 cols) */}
            <div className="sm:col-span-3">
              <select
                aria-label="Sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-rose-200 bg-[#FFF9FA] text-xs font-bold text-[#5A3F4B] focus:outline-none focus:border-[#CF3A69] cursor-pointer"
              >
                <option value="default">{lang === 'ar' ? 'الترتيب الافتراضي' : 'Default Sorting'}</option>
                <option value="price-low">{lang === 'ar' ? 'الأقل سعراً أولاً' : 'Price: Low to High'}</option>
                <option value="price-high">{lang === 'ar' ? 'الأعلى سعراً أولاً' : 'Price: High to Low'}</option>
              </select>
            </div>
          </div>

        </div>

        {/* Services Results Grid (Only Individual Services) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredServices.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.04 }}
              className="bg-white rounded-3xl border border-rose-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-rose-300 transition-all flex flex-col justify-between group"
            >
              {/* Image & Badges */}
              <div className="relative h-56 w-full overflow-hidden bg-rose-50">
                <img
                  src={service.image}
                  alt={lang === 'ar' ? service.title : service.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                <div className="absolute top-3 right-3">
                  <span className="bg-[#CF3A69] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                    {lang === 'ar' ? (service.badge || 'خدمة مميزة') : 'Featured'}
                  </span>
                </div>

                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-bold text-[#2B151F] flex items-center gap-1 whitespace-nowrap">
                  <FiClock className="text-[#CF3A69]" />
                  <span>{lang === 'ar' ? service.duration : service.duration.replace('دقيقة', 'mins')}</span>
                </div>

                <div className="absolute bottom-3 right-3 left-3 flex items-end justify-between text-white">
                  <div>
                    <h3 className="font-black text-base sm:text-lg text-white leading-tight">
                      {lang === 'ar' ? service.title : service.titleEn}
                    </h3>
                    <p className="text-[11px] text-rose-200/90 font-serif">
                      {lang === 'ar' ? service.titleEn : service.title}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-[#5A3F4B] leading-relaxed line-clamp-2">
                  {lang === 'ar' ? service.description : `${service.titleEn} designed to provide complete comfort, tension relief, and radiant energy in your home.`}
                </p>

                {/* Benefits */}
                {service.benefits && (
                  <div className="space-y-1 pt-1">
                    {service.benefits.slice(0, 2).map((b, i) => (
                      <div key={i} className="text-[11px] text-[#5A3F4B] flex items-center gap-2">
                        <FiCheckCircle className="text-emerald-500 text-xs shrink-0" />
                        <span className="truncate">{b}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Price & Tabby */}
                <div className="pt-2 border-t border-rose-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-[#CF3A69]">
                        {service.price} {t('currency')}
                      </span>
                      {service.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          {service.originalPrice} {t('currency')}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold block whitespace-nowrap">
                      {lang === 'ar' ? `أو ${service.tabbyInstallment} ر.س / شهرياً عبر تابي` : `Or ${service.tabbyInstallment} SAR / mo via Tabby`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setActiveServiceModal(service)}
                      className="p-2.5 rounded-xl border border-rose-200 text-[#5A3F4B] hover:text-[#CF3A69] hover:bg-rose-50 transition-colors cursor-pointer"
                      title={t('viewDetails')}
                    >
                      <FiEye className="text-base" />
                    </button>
                    <button
                      onClick={() => addToCart(service)}
                      className="p-2.5 rounded-xl border border-rose-200 text-[#5A3F4B] hover:text-[#CF3A69] hover:bg-rose-50 transition-colors cursor-pointer"
                      title={t('addToCart')}
                    >
                      <FiShoppingBag className="text-base" />
                    </button>
                  </div>
                </div>

                {/* Quick Book CTA */}
                <button
                  onClick={() => quickBookService(service)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#CF3A69] to-[#E65A84] text-white font-bold text-xs shadow-md shadow-rose-400/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <FaCrown className="text-[#FFDF78] text-xs" />
                  <span>{t('quickBook')}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ServicesPage;
