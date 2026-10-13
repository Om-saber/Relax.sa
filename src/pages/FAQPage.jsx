import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiChevronDown 
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { FaWhatsapp } from 'react-icons/fa6';
import { FAQ_CATEGORIES, FAQ_LIST } from '../data/faqData';
import { useLanguage } from '../context/LanguageContext';

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState([1, 2, 3]);
  const { lang, t } = useLanguage();

  const toggleAccordion = (id) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getCategoryTitle = (cat) => {
    if (lang === 'en') {
      const map = {
        all: 'All Questions',
        general: 'Service & Therapists',
        booking: 'Bookings & Slots',
        tools: 'Equipment & Hygiene',
        payment: 'Payment & Installments',
        privacy: 'Privacy & Policies',
      };
      return map[cat.id] || cat.name;
    }
    return cat.name;
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_LIST.filter((item) => {
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#FFF9FA]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Banner */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFEAF0] text-[#CF3A69] text-xs font-bold border border-rose-200 mb-3 whitespace-nowrap">
            <HiSparkles className="text-amber-500" />
            <span>{t('faqBadge')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#2B151F]">
            {t('faqTitle')}
          </h1>
          <p className="text-sm sm:text-base text-[#8E717D] mt-3">
            {t('faqDesc')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <FiSearch className="absolute start-4 top-3.5 text-[#CF3A69] text-base" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ar' ? 'ابحثي عن سؤالكِ هنا (مثال: التعقيم، الخصوصية، تابي، مدة الجلسة)...' : 'Search questions (e.g. hygiene, privacy, Tabby, duration)...'}
            className="w-full ps-12 pe-4 py-3.5 rounded-2xl border border-rose-200 bg-white text-xs sm:text-sm text-[#2B151F] shadow-sm focus:outline-none focus:border-[#CF3A69]"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {FAQ_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-[#CF3A69] to-[#E65A84] text-white shadow-md shadow-rose-500/20'
                  : 'bg-white text-[#5A3F4B] hover:bg-rose-50 border border-rose-100'
              }`}
            >
              {getCategoryTitle(cat)}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {filteredFaqs.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#8E717D] bg-white rounded-3xl border border-rose-100">
              {lang === 'ar' ? 'لم نجد نتائج مطابقة لبحثكِ. يمكنكِ سؤال فريقنا مباشرة على الواتساب!' : 'No matching questions found. Feel free to ask our team on WhatsApp!'}
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-rose-100 bg-white shadow-sm overflow-hidden transition-all duration-200 hover:border-rose-300"
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full p-4 sm:p-5 text-start flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#2B151F] hover:text-[#CF3A69] transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#E65A84] shrink-0" />
                      <span>{faq.question}</span>
                    </span>
                    <FiChevronDown
                      className={`text-lg text-[#CF3A69] shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
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
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#5A3F4B] leading-relaxed border-t border-rose-50 bg-[#FFFDFE]">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* WhatsApp Card at Bottom */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#2A121D] to-[#451A2C] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-start">
            <h4 className="text-base sm:text-lg font-black text-white">
              {lang === 'ar' ? 'ما زال لديكِ استفسار خاص؟' : 'Have another specific question?'}
            </h4>
            <p className="text-xs text-rose-200/80">
              {lang === 'ar' ? 'أخصائيات خدمة العملاء جاهزات للرد عليكِ فوراً عبر الواتساب على مدار الساعة.' : 'Our customer specialists are ready to assist you on WhatsApp 24/7.'}
            </p>
          </div>

          <a
            href="https://wa.me/966537313756?text=Hello%20Lets%20Relax"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all shrink-0 whitespace-nowrap"
          >
            <FaWhatsapp className="text-lg" />
            <span>{t('chatWhatsapp')}</span>
          </a>
        </div>

      </div>
    </div>
  );
};

export default FAQPage;
