import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiX, 
  FiClock, 
  FiCheckCircle, 
  FiShield, 
  FiHeart, 
  FiStar,
  FiShoppingBag
} from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa6';
import { useBooking } from '../../context/BookingContext';
import { useLanguage } from '../../context/LanguageContext';

const ServiceDetailModal = () => {
  const { 
    activeServiceModal, 
    setActiveServiceModal, 
    addToCart, 
    quickBookService 
  } = useBooking();

  const { lang, t } = useLanguage();

  if (!activeServiceModal) return null;

  const service = activeServiceModal;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setActiveServiceModal(null)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative bg-white rounded-3xl shadow-2xl border border-rose-200 w-full max-w-2xl overflow-hidden z-10 my-8"
      >
        {/* Close Button */}
        <button
          onClick={() => setActiveServiceModal(null)}
          className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-black/50 text-white hover:bg-black/70 flex items-center justify-center backdrop-blur-sm transition-colors"
        >
          <FiX className="text-lg" />
        </button>

        {/* Hero Image */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-rose-100">
          <img
            src={service.image}
            alt={lang === 'ar' ? service.title : service.titleEn}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

          {/* Badges on image */}
          <div className="absolute bottom-4 right-4 left-4 flex items-end justify-between">
            <div>
              <span className="inline-block bg-[#E65A84] text-white text-xs font-bold px-3 py-1 rounded-full mb-2 shadow-sm">
                {lang === 'ar' ? (service.badge || 'خدمة مميزة') : 'Signature Experience'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white drop-shadow-md">
                {lang === 'ar' ? service.title : service.titleEn}
              </h3>
              <p className="text-xs text-rose-200/90 font-serif">
                {lang === 'ar' ? service.titleEn : service.title}
              </p>
            </div>

            <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl text-center shadow-lg">
              <span className="text-lg font-black text-[#CF3A69] block">
                {service.price} {t('currency')}
              </span>
              {service.originalPrice && (
                <span className="text-[11px] text-gray-500 line-through block">
                  {service.originalPrice} {t('currency')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[55vh] overflow-y-auto space-y-5">
          {/* Rating & Duration */}
          <div className="flex items-center justify-between text-xs text-[#5A3F4B] pb-3 border-b border-rose-100">
            <div className="flex items-center gap-1.5 text-amber-500 font-bold">
              <FiStar className="fill-amber-400 text-amber-400" />
              <span>{service.rating || '5.0'}</span>
              <span className="text-[#8E717D]">
                ({service.reviewsCount || '150+'} {lang === 'ar' ? 'تقييم عميلة' : 'Client Reviews'})
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-bold text-[#CF3A69] bg-[#FFF0F3] px-3 py-1 rounded-full">
              <FiClock />
              <span>{lang === 'ar' ? `المدة: ${service.duration}` : `Duration: ${service.duration}`}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-[#2B151F] mb-1.5">
              {lang === 'ar' ? 'عن الجلسة:' : 'About This Treatment:'}
            </h4>
            <p className="text-sm text-[#5A3F4B] leading-relaxed">
              {lang === 'ar' ? service.description : `${service.titleEn} designed to bring ultimate comfort, relieve tension, and restore energy in the serenity of your home.`}
            </p>
          </div>

          {/* Tabby & Tamara Installment */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#2CE5AA]/10 via-[#FFF5F7] to-[#FF855D]/10 border border-rose-200 text-xs flex items-center justify-between">
            <div>
              <p className="font-bold text-[#2B151F]">
                {t('tabbySplit')}
              </p>
              <p className="text-[11px] text-[#8E717D]">
                {t('noInterest')}
              </p>
            </div>
            <span className="font-black text-[#CF3A69] text-sm">
              {(service.price / 4).toFixed(2)} {t('tabbyPerMonth')}
            </span>
          </div>

          {/* Benefits */}
          {service.benefits && service.benefits.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-[#2B151F] mb-2 flex items-center gap-1.5">
                <FiHeart className="text-[#E65A84]" /> {lang === 'ar' ? 'فوائد الجلسة لجسمكِ وعقلكِ:' : 'Treatment Benefits:'}
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {service.benefits.map((b, i) => (
                  <li key={i} className="text-xs text-[#5A3F4B] flex items-center gap-2 bg-[#FFF9FA] p-2 rounded-xl border border-rose-100">
                    <FiCheckCircle className="text-emerald-500 shrink-0 text-sm" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Includes */}
          {service.includes && service.includes.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-[#2B151F] mb-2 flex items-center gap-1.5">
                <FiShield className="text-[#D4AF37]" /> {lang === 'ar' ? 'ما تشمله الجلسة ومستلزمات التعقيم:' : 'Included Equipment & Sterilization:'}
              </h4>
              <ul className="space-y-1.5">
                {service.includes.map((inc, i) => (
                  <li key={i} className="text-xs text-[#5A3F4B] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E65A84]" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="p-4 sm:p-5 border-t border-rose-100 bg-[#FFFDFE] flex items-center gap-3">
          <button
            onClick={() => {
              addToCart(service);
              setActiveServiceModal(null);
            }}
            className="flex-1 py-3 rounded-2xl bg-white border border-[#CF3A69] text-[#CF3A69] hover:bg-rose-50 font-bold text-xs flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
          >
            <FiShoppingBag className="text-base" />
            <span>{t('addToCart')}</span>
          </button>

          <button
            onClick={() => {
              quickBookService(service);
              setActiveServiceModal(null);
            }}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#CF3A69] via-[#E65A84] to-[#CF3A69] text-white font-bold text-xs shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 hover:opacity-95 transition-opacity whitespace-nowrap"
          >
            <FaCrown className="text-[#FFDF78]" />
            <span>{t('quickBook')}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ServiceDetailModal;
