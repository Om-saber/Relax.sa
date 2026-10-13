import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiClock, 
  FiCheckCircle, 
  FiEye, 
  FiShoppingBag
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { FaCrown } from 'react-icons/fa6';
import { useBooking } from '../../context/BookingContext';
import { useLanguage } from '../../context/LanguageContext';
import { SERVICES } from '../../data/servicesData';

const FeaturedPackages = () => {
  const { addToCart, quickBookService, setActiveServiceModal } = useBooking();
  const { lang, t } = useLanguage();

  // Filter packages only
  const packages = SERVICES.filter((s) => s.category === 'packages');

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#FFF9FA] via-white to-[#FFF9FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFEAF0] text-[#CF3A69] text-xs font-bold border border-rose-200 mb-2">
              <FaCrown className="text-[#D4AF37]" />
              <span>{t('packagesBadge')}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#2B151F]">
              {t('packagesTitle')}
            </h2>
            <p className="text-sm text-[#8E717D] mt-1 max-w-xl">
              {t('packagesDesc')}
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs font-bold text-[#CF3A69] bg-[#FFF0F3] px-4 py-2 rounded-2xl border border-rose-200">
            <HiSparkles className="text-amber-500" />
            <span>{t('packagesNotice')}</span>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {packages.map((pkg, idx) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden border border-rose-100 shadow-sm hover:shadow-xl hover:border-rose-300 transition-all duration-300 flex flex-col group"
            >
              {/* Card Image Container */}
              <div className="relative h-56 w-full overflow-hidden bg-rose-50">
                <img
                  src={pkg.image}
                  alt={lang === 'ar' ? pkg.title : pkg.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                {/* Top Badge */}
                <div className="absolute top-3 right-3">
                  <span className="bg-[#CF3A69] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                    {lang === 'ar' ? pkg.badge : (pkg.badge === 'الأكثر طلباً' ? 'Most Popular' : pkg.badge === 'باقة مميزة' ? 'Exclusive' : pkg.badge === 'الأكثر مبيعاً' ? 'Best Seller' : 'VIP Experience')}
                  </span>
                </div>

                {/* Duration Badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-[11px] font-bold text-[#2B151F] flex items-center gap-1">
                  <FiClock className="text-[#CF3A69]" />
                  <span>{lang === 'ar' ? pkg.duration : pkg.duration.replace('دقيقة', 'mins').replace('جلسات', 'sessions')}</span>
                </div>

                {/* Title & Price on bottom of image */}
                <div className="absolute bottom-3 right-3 left-3 flex items-end justify-between text-white">
                  <div>
                    <h3 className="font-black text-lg text-white drop-shadow-sm">
                      {lang === 'ar' ? pkg.title : pkg.titleEn}
                    </h3>
                    <p className="text-[11px] text-rose-200/90 font-serif">
                      {lang === 'ar' ? pkg.titleEn : pkg.title}
                    </p>
                  </div>

                  <div className="text-left bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/20">
                    <span className="text-lg font-black text-[#FFDF78] block">
                      {pkg.price} <span className="text-xs font-normal">{t('currency')}</span>
                    </span>
                    {pkg.originalPrice && (
                      <span className="text-[10px] text-gray-300 line-through block">
                        {pkg.originalPrice} {t('currency')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                
                {/* Description */}
                <p className="text-xs text-[#5A3F4B] leading-relaxed line-clamp-2">
                  {lang === 'ar' ? pkg.description : `${pkg.titleEn} - A luxury home spa package offering complete relaxation, organic French oils, and 5-star hotel hygiene standards.`}
                </p>

                {/* Benefits sample */}
                <div className="space-y-1.5 pt-1">
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

                {/* Actions: View Details & Quick Book */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setActiveServiceModal(pkg)}
                    className="p-2.5 rounded-xl border border-rose-200 hover:border-[#CF3A69] text-[#5A3F4B] hover:text-[#CF3A69] bg-white transition-colors"
                    title={t('viewDetails')}
                  >
                    <FiEye className="text-base" />
                  </button>

                  <button
                    onClick={() => addToCart(pkg)}
                    className="p-2.5 rounded-xl border border-rose-200 hover:border-[#CF3A69] text-[#5A3F4B] hover:text-[#CF3A69] bg-white transition-colors"
                    title={t('addToCart')}
                  >
                    <FiShoppingBag className="text-base" />
                  </button>

                  <button
                    onClick={() => quickBookService(pkg)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#CF3A69] to-[#E65A84] text-white font-bold text-xs shadow-md shadow-rose-400/20 hover:opacity-95 transition-opacity text-center flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <FaCrown className="text-[#FFDF78] text-xs" />
                    <span>{t('quickBook')}</span>
                  </button>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedPackages;
