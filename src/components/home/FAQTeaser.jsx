import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import { FAQ_LIST } from '../../data/faqData';
import { useLanguage } from '../../context/LanguageContext';

const FAQTeaser = () => {
  const [openId, setOpenId] = useState(1);
  const { lang, t } = useLanguage();

  const teaserQuestions = FAQ_LIST.slice(0, 6);

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-[#CF3A69] tracking-wider uppercase bg-[#FFEAF0] px-3.5 py-1.5 rounded-full border border-rose-200">
            {t('faqBadge')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#2B151F] mt-3">
            {t('faqTitle')}
          </h2>
          <p className="text-sm text-[#8E717D] mt-2">
            {t('faqDesc')}
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-3">
          {teaserQuestions.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl border border-rose-100 bg-[#FFFDFE] overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full p-4 sm:p-5 text-start flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#2B151F] hover:text-[#CF3A69] transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#E65A84]" />
                    {faq.question}
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
                      <div className="px-5 pb-5 pt-1 text-xs text-[#5A3F4B] leading-relaxed border-t border-rose-50">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="mt-10 p-6 rounded-3xl bg-[#FFF9FA] border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm text-[#2B151F]">
              {lang === 'ar' ? 'هل لديكِ سؤال آخر لم تجدي إجابته؟' : 'Have a question not listed here?'}
            </h4>
            <p className="text-xs text-[#8E717D] mt-0.5">
              {lang === 'ar' ? 'فريق خدمة العملاء متواجد على الواتساب لمساعدتكِ فوراً.' : 'Our customer support team is available on WhatsApp 24/7.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/faq"
              className="px-4 py-2.5 rounded-xl border border-rose-300 text-[#CF3A69] text-xs font-bold hover:bg-rose-50 transition-colors whitespace-nowrap"
            >
              {t('allFaqBtn')}
            </Link>

            <a
              href="https://wa.me/966537313756"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm whitespace-nowrap"
            >
              <FaWhatsapp className="text-base" />
              <span>{t('chatWhatsapp')}</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FAQTeaser;
