import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiClock, 
  FiCheckCircle, 
  FiShoppingBag, 
  FiEye 
} from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa6';
import { useBooking } from '../../context/BookingContext';
import { useLanguage } from '../../context/LanguageContext';
import { useServices } from '../../hooks/useCatalog';

const ServicesGrid = () => {
  const { addToCart, quickBookService, setActiveServiceModal } = useBooking();
  const { lang, t } = useLanguage();
  const [filterType, setFilterType] = useState('all');

  // --- Catalog from API (auto-fallback to mock) ---
  const { services } = useServices({}, lang);

  const treatments = services.filter((s) => s.category !== 'packages');

  const filtered = treatments.filter((t) => {
    if (filterType === 'all') return true;
    if (filterType === 'massage') return t.category === 'massage';
    if (filterType === 'moroccan') return t.category === 'moroccan';
    if (filterType === 'beauty') return t.category === 'beauty';
    if (filterType === 'maternity') return t.category === 'maternity';
    return true;
  });

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#CF3A69] tracking-wider uppercase bg-[#FFEAF0] px-3.5 py-1.5 rounded-full border border-rose-200">
            {t('servicesBadge')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#2B151F] mt-3">
            {t('servicesTitle')}
          </h2>
          <p className="text-sm text-[#8E717D] mt-2">
            {t('servicesDesc')}
          </p>

          {/* Sub-filter tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                filterType === 'all'
                  ? 'bg-[#CF3A69] text-white shadow-md'
                  : 'bg-rose-50 text-[#5A3F4B] hover:bg-rose-100'
              }`}
            >
              {lang === 'ar' ? `جميع الخدمات (${treatments.length})` : `All Services (${treatments.length})`}
            </button>
            <button
              onClick={() => setFilterType('massage')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                filterType === 'massage'
                  ? 'bg-[#CF3A69] text-white shadow-md'
                  : 'bg-rose-50 text-[#5A3F4B] hover:bg-rose-100'
              }`}
            >
              {t('catMassage')}
            </button>
            <button
              onClick={() => setFilterType('moroccan')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                filterType === 'moroccan'
                  ? 'bg-[#CF3A69] text-white shadow-md'
                  : 'bg-rose-50 text-[#5A3F4B] hover:bg-rose-100'
              }`}
            >
              {t('catMoroccan')}
            </button>
            <button
              onClick={() => setFilterType('beauty')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                filterType === 'beauty'
                  ? 'bg-[#CF3A69] text-white shadow-md'
                  : 'bg-rose-50 text-[#5A3F4B] hover:bg-rose-100'
              }`}
            >
              {t('catBeauty')}
            </button>
            <button
              onClick={() => setFilterType('maternity')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                filterType === 'maternity'
                  ? 'bg-[#CF3A69] text-white shadow-md'
                  : 'bg-rose-50 text-[#5A3F4B] hover:bg-rose-100'
              }`}
            >
              {t('catMaternity')}
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="bg-[#FFFDFE] rounded-3xl border border-rose-100 p-4 shadow-sm hover:shadow-xl hover:border-rose-300 transition-all flex flex-col justify-between group"
            >
              {/* Image & Badges */}
              <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-4 bg-rose-100">
                <img
                  src={service.image}
                  alt={lang === 'ar' ? service.title : service.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

                <div className="absolute top-2.5 right-2.5">
                  <span className="bg-[#E65A84] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                    {lang === 'ar' ? service.badge : 'Special Treatment'}
                  </span>
                </div>

                <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-bold text-[#2B151F] flex items-center gap-1">
                  <FiClock className="text-[#CF3A69]" />
                  <span>{lang === 'ar' ? service.duration : service.duration.replace('دقيقة', 'mins')}</span>
                </div>

                <div className="absolute bottom-2.5 right-2.5 left-2.5 text-white">
                  <h3 className="font-bold text-sm leading-tight drop-shadow">
                    {lang === 'ar' ? service.title : service.titleEn}
                  </h3>
                </div>
              </div>

              {/* Body Details */}
              <div className="space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs text-[#5A3F4B] leading-relaxed line-clamp-2">
                  {lang === 'ar' ? service.description : `${service.titleEn} tailored for muscle relaxation, revitalization, and soothing care in your home.`}
                </p>

                {/* Price & Tabby */}
                <div className="pt-2 border-t border-rose-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg font-black text-[#CF3A69]">
                        {service.price} {t('currency')}
                      </span>
                      {service.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          {service.originalPrice} {t('currency')}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold block">
                      {lang === 'ar' ? `أو ${service.tabbyInstallment} ر.س / شهرياً عبر تابي` : `Or ${service.tabbyInstallment} SAR / mo via Tabby`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setActiveServiceModal(service)}
                      className="p-2 rounded-xl border border-rose-200 text-[#5A3F4B] hover:text-[#CF3A69] hover:bg-rose-50 transition-colors"
                      title={t('viewDetails')}
                    >
                      <FiEye className="text-sm" />
                    </button>
                    <button
                      onClick={() => addToCart(service)}
                      className="p-2 rounded-xl border border-rose-200 text-[#5A3F4B] hover:text-[#CF3A69] hover:bg-rose-50 transition-colors"
                      title={t('addToCart')}
                    >
                      <FiShoppingBag className="text-sm" />
                    </button>
                  </div>
                </div>

                {/* Quick Book Button */}
                <button
                  onClick={() => quickBookService(service)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#CF3A69] to-[#E65A84] text-white font-bold text-xs shadow-md shadow-rose-400/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <FaCrown className="text-[#FFDF78] text-xs" />
                  <span>{t('quickBook')}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ServicesGrid;
