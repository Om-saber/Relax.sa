import React from 'react';
import { FiDroplet, FiCheckCircle, FiShield, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa6';
import { useBooking } from '../../context/BookingContext';
import { useLanguage } from '../../context/LanguageContext';
import { SERVICES } from '../../data/servicesData';

const MoroccanBathSection = () => {
  const { quickBookService, setActiveServiceModal } = useBooking();
  const { lang, isRTL, t } = useLanguage();

  const moroccanService = SERVICES.find((s) => s.id === 'moroccan-royal') || SERVICES[0];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-[#2B151F] via-[#3E1F2E] to-[#2B151F] text-white relative overflow-hidden">
      {/* Decorative luxury sparkles and gold glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E65A84]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#D4AF37]/40 text-[#F7E7CE] text-xs font-bold whitespace-nowrap">
              <FiDroplet className="text-cyan-400" />
              <span>{t('moroccanBadge')}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black leading-tight text-white">
              {t('moroccanTitle1')}
              <br />
              <span className="bg-gradient-to-r from-[#D4AF37] via-[#FFF4D2] to-[#E65A84] bg-clip-text text-transparent">
                {t('moroccanTitle2')}
              </span>
            </h2>

            <p className="text-sm sm:text-base text-rose-100/90 leading-relaxed max-w-xl">
              {t('moroccanDesc')}
            </p>

            {/* Rituals highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <FiCheckCircle className="text-emerald-400 text-lg shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-white">{t('moroccanFeature1Title')}</h4>
                  <p className="text-[11px] text-rose-200/70">{t('moroccanFeature1Desc')}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <FiCheckCircle className="text-emerald-400 text-lg shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-white">{t('moroccanFeature2Title')}</h4>
                  <p className="text-[11px] text-rose-200/70">{t('moroccanFeature2Desc')}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <FiCheckCircle className="text-emerald-400 text-lg shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-white">{t('moroccanFeature3Title')}</h4>
                  <p className="text-[11px] text-rose-200/70">{t('moroccanFeature3Desc')}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <FiShield className="text-[#D4AF37] text-lg shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-white">{t('moroccanFeature4Title')}</h4>
                  <p className="text-[11px] text-rose-200/70">{t('moroccanFeature4Desc')}</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => quickBookService(moroccanService)}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#E5C378] to-[#D4AF37] text-[#2B151F] font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <FaCrown />
                <span>{t('moroccanBookBtn')}</span>
              </button>

              <button
                onClick={() => setActiveServiceModal(moroccanService)}
                className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/20 transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <span>{t('moroccanStepsBtn')}</span>
                {isRTL ? <FiArrowLeft /> : <FiArrowRight />}
              </button>
            </div>

          </div>

          {/* Visual Card (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#D4AF37]/30 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80"
                alt="Royal Moroccan Bath"
                className="w-full h-96 sm:h-[450px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-6">
                <span className="bg-[#CF3A69] text-white text-[10px] font-bold px-3 py-1 rounded-full w-max mb-2">
                  {lang === 'ar' ? 'جلسة الدلال الأكثر طلباً' : 'Top Requested Ritual'}
                </span>
                <h3 className="text-xl font-black text-white">
                  {lang === 'ar' ? 'الحمام المغربي الملكي الفاخر' : 'Royal Moroccan Bath'}
                </h3>
                <p className="text-xs text-rose-200/90 mt-1">
                  {lang === 'ar' ? 'مدة الجلسة 90 دقيقة من الاسترخاء والنقاء الشامل' : '90-minute session of pure relaxation and rejuvenation'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MoroccanBathSection;
