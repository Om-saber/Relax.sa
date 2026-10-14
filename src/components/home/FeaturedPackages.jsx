import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiClock, 
  FiCheckCircle, 
  FiEye, 
  FiShoppingBag,
  FiChevronRight,
  FiChevronLeft,
  FiArrowLeft,
  FiArrowRight,
  FiStar
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { FaCrown, FaStar } from 'react-icons/fa6';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { useBooking } from '../../context/BookingContext';
import { useLanguage } from '../../context/LanguageContext';
import { SERVICES } from '../../data/servicesData';

const FeaturedPackages = () => {
  const { addToCart, quickBookService, setActiveServiceModal } = useBooking();
  const { lang, isRTL, t } = useLanguage();
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Filter packages only
  const packages = SERVICES.filter((s) => s.category === 'packages');

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#FFF9FA] via-white to-[#FFF9FA] relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-12 right-0 w-80 h-80 bg-rose-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Slider Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFEAF0] text-[#CF3A69] text-xs font-bold border border-rose-200 mb-3 shadow-xs">
              <FaCrown className="text-amber-500" />
              <span>{t('packagesBadge')}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#2B151F] tracking-tight">
              {t('packagesTitle')}
            </h2>
            <p className="text-sm text-[#8E717D] mt-1.5 max-w-xl leading-relaxed">
              {t('packagesDesc')}
            </p>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            {/* Link to dedicated Packages Page */}
            <Link
              to="/packages"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-rose-200 text-[#CF3A69] text-xs font-bold shadow-xs hover:border-[#CF3A69] hover:bg-[#FFF0F3] hover:shadow-md transition-all group whitespace-nowrap"
            >
              <FaCrown className="text-amber-500 text-xs" />
              <span>{lang === 'ar' ? 'عرض كل الباقات' : 'View All Packages'}</span>
              {isRTL ? (
                <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              ) : (
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              )}
            </Link>

            {/* Custom Slider Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => swiperRef.current?.slidePrev()}
                className="w-10 h-10 rounded-2xl bg-white border border-rose-200 text-[#4A2838] hover:text-[#CF3A69] hover:border-[#CF3A69] hover:bg-[#FFF0F3] shadow-xs hover:shadow-md flex items-center justify-center transition-all cursor-pointer disabled:opacity-40"
                aria-label={lang === 'ar' ? 'الباقة السابقة' : 'Previous package'}
              >
                {isRTL ? <FiChevronRight className="text-lg" /> : <FiChevronLeft className="text-lg" />}
              </button>

              <button
                type="button"
                onClick={() => swiperRef.current?.slideNext()}
                className="w-10 h-10 rounded-2xl bg-white border border-rose-200 text-[#4A2838] hover:text-[#CF3A69] hover:border-[#CF3A69] hover:bg-[#FFF0F3] shadow-xs hover:shadow-md flex items-center justify-center transition-all cursor-pointer disabled:opacity-40"
                aria-label={lang === 'ar' ? 'الباقة التالية' : 'Next package'}
              >
                {isRTL ? <FiChevronLeft className="text-lg" /> : <FiChevronRight className="text-lg" />}
              </button>
            </div>
          </div>
        </div>

        {/* Notice Pill */}
        <div className="mb-6 inline-flex items-center gap-2 text-xs font-bold text-[#CF3A69] bg-[#FFF0F3] px-4 py-2 rounded-2xl border border-rose-200 shadow-xs">
          <HiSparkles className="text-amber-500 shrink-0" />
          <span>{t('packagesNotice')}</span>
        </div>

        {/* Swiper Slider */}
        <div className="packages-swiper-wrapper relative">
          <Swiper
            key={lang}
            dir={isRTL ? 'rtl' : 'ltr'}
            modules={[Navigation, Pagination, Autoplay]}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            slidesPerView={1.12}
            spaceBetween={18}
            grabCursor={true}
            loop={packages.length > 3}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              el: '.packages-custom-pagination',
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
            className="pb-4 pt-1"
          >
            {packages.map((pkg, idx) => {
              const discount = pkg.originalPrice ? pkg.originalPrice - pkg.price : 0;
              return (
                <SwiperSlide key={pkg.id} className="h-auto">
                  <div className="h-full bg-white rounded-3xl overflow-hidden border border-rose-100 shadow-sm hover:shadow-xl hover:border-rose-300 transition-all duration-300 flex flex-col group select-none">
                    
                    {/* Card Image Container */}
                    <div className="relative h-60 w-full overflow-hidden bg-rose-50">
                      <img
                        src={pkg.image}
                        alt={lang === 'ar' ? pkg.title : pkg.titleEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                      {/* Top Badges Bar */}
                      <div className="absolute top-3 right-3 left-3 flex items-center justify-between gap-2">
                        {/* Status / Category Badge */}
                        <span className="bg-gradient-to-r from-[#CF3A69] to-[#E65A84] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-xs flex items-center gap-1">
                          <FaCrown className="text-amber-300 text-[10px]" />
                          {lang === 'ar' ? pkg.badge : (pkg.badge === 'الأكثر طلباً' ? 'Most Popular' : pkg.badge === 'باقة مميزة' ? 'Exclusive' : pkg.badge === 'الأكثر مبيعاً' ? 'Best Seller' : 'VIP Experience')}
                        </span>

                        {/* Duration Badge */}
                        <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl text-[11px] font-bold text-[#2B151F] flex items-center gap-1 shadow-sm">
                          <FiClock className="text-[#CF3A69]" />
                          <span>{lang === 'ar' ? pkg.duration : pkg.duration.replace('دقيقة', 'mins').replace('جلسات', 'sessions')}</span>
                        </div>
                      </div>

                      {/* Savings Pill */}
                      {discount > 0 && (
                        <div className="absolute top-12 right-3">
                          <span className="bg-amber-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-lg shadow-sm">
                            {lang === 'ar' ? `وفري ${discount} ر.س` : `Save ${discount} SAR`}
                          </span>
                        </div>
                      )}

                      {/* Title & Price on bottom of image */}
                      <div className="absolute bottom-3 right-3 left-3 flex items-end justify-between text-white">
                        <div className="max-w-[65%]">
                          <h3 className="font-black text-lg text-white drop-shadow-sm leading-snug line-clamp-1">
                            {lang === 'ar' ? pkg.title : pkg.titleEn}
                          </h3>
                          <p className="text-[11px] text-rose-200/90 font-serif truncate">
                            {lang === 'ar' ? pkg.titleEn : pkg.title}
                          </p>
                        </div>

                        <div className="text-left bg-black/50 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20 shrink-0">
                          <span className="text-lg font-black text-[#FFDF78] block leading-tight">
                            {pkg.price} <span className="text-xs font-normal">{t('currency')}</span>
                          </span>
                          {pkg.originalPrice && (
                            <span className="text-[10px] text-gray-300 line-through block leading-none">
                              {pkg.originalPrice} {t('currency')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      
                      {/* Rating & Review Counter */}
                      <div className="flex items-center justify-between text-xs text-[#8E717D]">
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <FaStar className="text-xs fill-amber-400" />
                          <span className="text-[#2B151F] font-black">{pkg.rating || '5.0'}</span>
                          <span className="text-[11px] text-[#8E717D]">({pkg.reviewsCount || 150}+ {lang === 'ar' ? 'تقييم' : 'reviews'})</span>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                          {lang === 'ar' ? 'سرير ومناشف مشمولة' : 'Bed & Linens Included'}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-[#5A3F4B] leading-relaxed line-clamp-2">
                        {lang === 'ar' ? pkg.description : `${pkg.titleEn} - A luxury home spa package offering complete relaxation, organic French oils, and 5-star hotel hygiene standards.`}
                      </p>

                      {/* Benefits sample */}
                      <div className="space-y-1.5 pt-1 border-t border-rose-100/60">
                        {pkg.benefits.slice(0, 2).map((b, i) => (
                          <div key={i} className="text-[11px] text-[#5A3F4B] flex items-center gap-2">
                            <FiCheckCircle className="text-emerald-500 text-xs shrink-0" />
                            <span className="truncate">{b}</span>
                          </div>
                        ))}
                      </div>

                      {/* Tabby 4 installments calculation */}
                      <div className="p-2.5 rounded-xl bg-[#2CE5AA]/10 border border-[#2CE5AA]/30 flex items-center justify-between text-[11px]">
                        <span className="text-[#128a64] font-bold">
                          {t('tabbySplit')}
                        </span>
                        <span className="font-black text-[#128a64]">
                          {pkg.tabbyInstallment} {t('tabbyPerMonth')}
                        </span>
                      </div>

                      {/* Actions: View Details, Add to Cart & Quick Book */}
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveServiceModal(pkg)}
                          className="p-2.5 rounded-xl border border-rose-200 hover:border-[#CF3A69] text-[#5A3F4B] hover:text-[#CF3A69] bg-white transition-colors cursor-pointer"
                          title={t('viewDetails')}
                        >
                          <FiEye className="text-base" />
                        </button>

                        <button
                          type="button"
                          onClick={() => addToCart(pkg)}
                          className="p-2.5 rounded-xl border border-rose-200 hover:border-[#CF3A69] text-[#5A3F4B] hover:text-[#CF3A69] bg-white transition-colors cursor-pointer"
                          title={t('addToCart')}
                        >
                          <FiShoppingBag className="text-base" />
                        </button>

                        <button
                          type="button"
                          onClick={() => quickBookService(pkg)}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#CF3A69] via-[#E65A84] to-[#CF3A69] text-white font-black text-xs shadow-md shadow-rose-400/25 hover:shadow-lg hover:opacity-95 transition-all text-center flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                        >
                          <FaCrown className="text-[#FFDF78] text-xs" />
                          <span>{t('quickBook')}</span>
                        </button>
                      </div>

                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Custom Styled Swiper Pagination Container */}
          <div className="packages-custom-pagination flex items-center justify-center gap-1.5 mt-6 pt-2" />
        </div>

        {/* Bottom Callout Banner to Packages Page */}
        <div className="mt-12 rounded-3xl bg-gradient-to-r from-[#FFF0F3] via-white to-[#FFF5F7] border border-rose-200/80 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4 text-center md:text-start">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#CF3A69] to-[#E65A84] text-white flex items-center justify-center text-2xl shadow-md shrink-0">
              <FaCrown className="text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-[#2B151F]">
                {lang === 'ar' ? 'هل تبحثين عن باقة مخصصة بالكامل؟' : 'Looking for a Fully Customized Package?'}
              </h3>
              <p className="text-xs sm:text-sm text-[#8E717D] mt-1 max-w-xl">
                {lang === 'ar' ? 'اكتشفي صفحة الباقات الكاملة مع عروض الـ VIP والاشتراكات المتعددة وحمام كليوباترا الملكي.' : 'Explore our full packages page featuring VIP rituals, multi-session subscriptions, and Cleopatra royal bath.'}
              </p>
            </div>
          </div>

          <Link
            to="/packages"
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#CF3A69] to-[#E65A84] text-white font-black text-xs sm:text-sm shadow-md shadow-rose-400/25 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <FaCrown className="text-[#FFDF78]" />
            <span>{t('allPackagesBtn')}</span>
            {isRTL ? <FiArrowLeft /> : <FiArrowRight />}
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FeaturedPackages;
