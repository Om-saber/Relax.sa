import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiX, FiClock, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { useBooking } from '../../context/BookingContext';
import { useLanguage } from '../../context/LanguageContext';
import { SERVICES } from '../../data/servicesData';

const SearchModal = () => {
  const { isSearchOpen, setIsSearchOpen, setActiveServiceModal } = useBooking();
  const { lang, isRTL, t } = useLanguage();
  const [query, setQuery] = useState('');

  const filteredServices = useMemo(() => {
    if (!query.trim()) return SERVICES.slice(0, 6);
    const q = query.toLowerCase();
    return SERVICES.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.titleEn.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }, [query]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center p-4 pt-16 sm:pt-24">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsSearchOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: -20 }}
        className="relative bg-white rounded-3xl shadow-2xl border border-rose-200 w-full max-w-xl overflow-hidden z-10"
      >
        {/* Search Bar Input */}
        <div className="p-4 border-b border-rose-100 flex items-center gap-3 bg-[#FFF9FA]">
          <FiSearch className="text-[#CF3A69] text-xl shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === 'ar' ? 'ابحثي عن خدمة، باقة، أو نوع مساج (مثلاً: سويدي، حمام مغربي، لافندر)...' : 'Search for a massage, package, or treatment (e.g. Swedish, Moroccan, Lavender)...'}
            className="w-full text-sm bg-transparent border-none focus:outline-none text-[#2B151F] placeholder-rose-300 font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#8E717D] hover:text-[#2B151F] whitespace-nowrap"
            >
              {lang === 'ar' ? 'مسح' : 'Clear'}
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-lg text-[#8E717D] hover:text-[#2B151F] hover:bg-rose-100/50"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2.5">
          <p className="text-xs font-bold text-[#8E717D] px-1">
            {query.trim()
              ? (lang === 'ar' ? `نتائج البحث (${filteredServices.length}):` : `Search Results (${filteredServices.length}):`)
              : (lang === 'ar' ? 'الخدمات المقترحة لكِ:' : 'Suggested Treatments:')}
          </p>

          {filteredServices.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#8E717D]">
              {lang === 'ar' ? 'لم نجد خدمات مطابقة لبحثكِ. جربي كلمة أخرى مثل "مساج" أو "باقة".' : 'No treatments match your search. Try another keyword.'}
            </div>
          ) : (
            filteredServices.map((service) => (
              <div
                key={service.id}
                onClick={() => {
                  setIsSearchOpen(false);
                  setActiveServiceModal(service);
                }}
                className="p-3 rounded-2xl border border-rose-100 hover:border-[#CF3A69] hover:bg-[#FFF5F7] transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={service.image}
                    alt={lang === 'ar' ? service.title : service.titleEn}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-[#2B151F] group-hover:text-[#CF3A69] transition-colors">
                      {lang === 'ar' ? service.title : service.titleEn}
                    </h4>
                    <p className="text-[11px] text-[#8E717D] flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1">
                        <FiClock className="text-[#CF3A69]" /> {service.duration}
                      </span>
                      <span className="text-[#CF3A69] font-black">{service.price} {t('currency')}</span>
                    </p>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-rose-50 group-hover:bg-[#CF3A69] group-hover:text-white flex items-center justify-center transition-colors">
                  {isRTL ? <FiArrowLeft className="text-xs" /> : <FiArrowRight className="text-xs" />}
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SearchModal;
