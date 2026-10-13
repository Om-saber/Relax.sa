import React from 'react';
import { Link } from 'react-router-dom';
import { FiGift, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa6';
import { useLanguage } from '../../context/LanguageContext';

const GiftCardBanner = () => {
  const { lang, isRTL, t } = useLanguage();

  return (
    <section className="py-14 bg-gradient-to-r from-[#FFF0F3] via-[#FFEAF0] to-[#FFF0F3] border-y border-rose-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-rose-200 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
          
          {/* Decorative Background Blob */}
          <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-[#FED6E2]/50 rounded-full blur-2xl pointer-events-none" />

          {/* Text */}
          <div className="space-y-4 max-w-xl text-center lg:text-right relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-[#CF3A69]/10 text-[#CF3A69] text-xs font-bold px-3 py-1 rounded-full border border-rose-200 whitespace-nowrap">
              <FiGift />
              <span>{t('giftBadge')}</span>
            </span>

            <h3 className="text-2xl sm:text-3xl font-black text-[#2B151F]">
              {t('giftTitle')}
            </h3>

            <p className="text-xs sm:text-sm text-[#5A3F4B] leading-relaxed">
              {t('giftDesc')}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/gift-cards"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#CF3A69] via-[#E65A84] to-[#CF3A69] text-white font-black text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <FaCrown className="text-[#FFDF78]" />
                <span>{t('giftBtn')}</span>
                {isRTL ? <FiArrowLeft /> : <FiArrowRight />}
              </Link>
            </div>
          </div>

          {/* Visual Gift Voucher Mockup */}
          <div className="relative w-full max-w-sm shrink-0 group">
            <div className="relative rounded-3xl overflow-hidden border-2 border-rose-200 shadow-2xl bg-[#1E0B14] hover:shadow-rose-500/20 transition-all duration-300">
              <img
                src="/images/gift-voucher-rose.jpg"
                alt={lang === 'ar' ? "كارت إهداء سبا ملكي Let's Relax" : "Let's Relax Royal Spa Gift Voucher"}
                className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              
              {/* Top Badge */}
              <div className="absolute top-3.5 right-3.5">
                <span className="text-[10px] bg-black/50 backdrop-blur-md text-[#FFF4D2] px-2.5 py-1 rounded-full border border-white/30 font-bold flex items-center gap-1 shadow-md">
                  <FaCrown className="text-[#FFDF78]" />
                  <span>{lang === 'ar' ? 'كارت وتغليف ملكي' : 'Royal Spa Voucher'}</span>
                </span>
              </div>

              {/* Bottom Info */}
              <div className="absolute bottom-3.5 inset-x-3.5 text-white">
                <p className="text-[11px] text-rose-200/80 font-bold mb-0.5">
                  {lang === 'ar' ? 'مطبوع ومختوم بظرف مخملي أنيق' : 'Printed & Sealed in Velvet Box'}
                </p>
                <p className="text-xs font-black text-white">
                  {lang === 'ar' ? 'أهديها جلسة سبا ملكية في دفء منزلها 🌸' : 'Gift a royal home spa experience 🌸'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default GiftCardBanner;
