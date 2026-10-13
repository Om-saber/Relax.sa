import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { 
  FiMapPin, 
  FiCalendar, 
  FiClock, 
  FiShield, 
  FiArrowLeft,
  FiArrowRight
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { FaCrown } from 'react-icons/fa6';
import { useBooking } from '../../context/BookingContext';
import { useLanguage } from '../../context/LanguageContext';
import { CITIES } from '../../data/servicesData';

const HeroSection = () => {
  const { 
    selectedCity, 
    setSelectedCity, 
    setIsBookingModalOpen, 
    bookingDetails, 
    setBookingDetails 
  } = useBooking();

  const { lang, isRTL, t } = useLanguage();
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.hero-float-badge', {
        y: -8,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        stagger: 0.35
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleQuickBook = () => {
    setIsBookingModalOpen(true);
  };

  return (
    <section ref={heroRef} className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-[#FFF0F3] via-[#FFF9FA] to-[#FFF9FA]">
      {/* Decorative ambient glowing blooms */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#FED6E2]/70 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 left-10 w-80 h-80 bg-[#F5E6D3]/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-1/3 w-96 h-96 bg-[#FED6E2]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Ticker Tag */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-rose-200/80 shadow-sm text-xs font-bold text-[#CF3A69]"
          >
            <HiSparkles className="text-[#D4AF37] animate-spin" style={{ animationDuration: '6s' }} />
            <span>{t('heroBadge')}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E65A84]" />
            <span className="text-[#8E717D] hidden sm:inline">{t('heroBadgeSub')}</span>
          </motion.div>
        </div>

        {/* Hero Headline & Subtitle */}
        <div className="text-center max-w-4xl mx-auto space-y-5">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-black text-[#2B151F] leading-tight tracking-tight"
          >
            {t('heroTitle1')}
            <br />
            <span className="bg-gradient-to-r from-[#B02652] via-[#E65A84] to-[#C98A7D] bg-clip-text text-transparent">
              {t('heroTitle2')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-[#5A3F4B] max-w-2xl mx-auto leading-relaxed"
          >
            {t('heroDesc')}
          </motion.p>
        </div>

        {/* Floating Luxury Highlights Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 my-8 text-xs font-bold">
          <div className="hero-float-badge bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-rose-200/80 shadow-sm flex items-center gap-2 text-[#2B151F]">
            <span className="text-base text-amber-400">⭐</span>
            <span>{t('ratingBadge')}</span>
          </div>

          <div className="hero-float-badge bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-rose-200/80 shadow-sm flex items-center gap-2 text-[#2B151F]">
            <FiShield className="text-emerald-500 text-sm" />
            <span>{t('hygieneBadge')}</span>
          </div>

          <div className="hero-float-badge bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-rose-200/80 shadow-sm flex items-center gap-2 text-[#2B151F]">
            <span className="text-xs bg-[#2CE5AA]/20 text-[#128a64] px-1.5 py-0.5 rounded font-black">tabby</span>
            <span>{t('tabbyBadge')}</span>
          </div>
        </div>

        {/* Quick Booking Interactive Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-4xl mx-auto bg-white/98 backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-2xl border border-rose-200 relative"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-end">
            
            {/* City Selection */}
            <div>
              <label className="block text-xs font-bold text-[#2B151F] mb-1.5 flex items-center gap-1.5">
                <FiMapPin className="text-[#CF3A69]" /> {t('city')}
              </label>
              <select
                aria-label={t('city')}
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  const cityName = CITIES.find((c) => c.id === e.target.value)?.name || 'الرياض';
                  setBookingDetails({ ...bookingDetails, city: cityName });
                }}
                className="w-full p-3 rounded-2xl border border-rose-200 bg-[#FFF9FA] text-xs font-bold text-[#2B151F] focus:outline-none focus:border-[#CF3A69]"
              >
                {CITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {lang === 'ar' ? c.name : (c.id === 'riyadh' ? 'Riyadh' : c.id === 'khobar' ? 'Khobar' : c.id === 'dammam' ? 'Dammam' : 'Jeddah')}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-xs font-bold text-[#2B151F] mb-1.5 flex items-center gap-1.5">
                <FiCalendar className="text-[#CF3A69]" /> {t('sessionDate')}
              </label>
              <input
                type="date"
                value={bookingDetails.date}
                onChange={(e) =>
                  setBookingDetails({ ...bookingDetails, date: e.target.value })
                }
                className="w-full p-3 rounded-2xl border border-rose-200 bg-[#FFF9FA] text-xs font-bold text-[#2B151F] focus:outline-none focus:border-[#CF3A69]"
              />
            </div>

            {/* Time Slot Selection */}
            <div>
              <label className="block text-xs font-bold text-[#2B151F] mb-1.5 flex items-center gap-1.5">
                <FiClock className="text-[#CF3A69]" /> {t('preferredTime')}
              </label>
              <select
                aria-label={t('preferredTime')}
                value={bookingDetails.timeSlot}
                onChange={(e) =>
                  setBookingDetails({ ...bookingDetails, timeSlot: e.target.value })
                }
                className="w-full p-3 rounded-2xl border border-rose-200 bg-[#FFF9FA] text-xs font-bold text-[#2B151F] focus:outline-none focus:border-[#CF3A69]"
              >
                {lang === 'ar' ? (
                  <>
                    <option value="10:00 صباحاً - 12:00 ظهراً">صباحي (10 ص - 12 ظ)</option>
                    <option value="12:30 ظهراً - 02:30 ظهراً">ظهيرة (12:30 ظ - 2:30 ظ)</option>
                    <option value="03:00 عصراً - 05:00 مساءً">عصراً (3 ع - 5 م)</option>
                    <option value="05:30 مساءً - 07:30 مساءً">مسائي (5:30 م - 7:30 م)</option>
                    <option value="08:00 مساءً - 10:00 مساءً">سهرة (8 م - 10 م)</option>
                  </>
                ) : (
                  <>
                    <option value="10:00 AM - 12:00 PM">Morning (10 AM - 12 PM)</option>
                    <option value="12:30 PM - 02:30 PM">Afternoon (12:30 PM - 2:30 PM)</option>
                    <option value="03:00 PM - 05:00 PM">Late Afternoon (3 PM - 5 PM)</option>
                    <option value="05:30 PM - 07:30 PM">Evening (5:30 PM - 7:30 PM)</option>
                    <option value="08:00 PM - 10:00 PM">Night (8 PM - 10 PM)</option>
                  </>
                )}
              </select>
            </div>

            {/* CTA Button */}
            <div>
              <button
                onClick={handleQuickBook}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#CF3A69] via-[#E65A84] to-[#CF3A69] text-white font-black text-xs sm:text-sm shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
              >
                <FaCrown className="text-[#FFDF78]" />
                <span>{t('bookNow')}</span>
                {isRTL ? <FiArrowLeft className="text-base" /> : <FiArrowRight className="text-base" />}
              </button>
            </div>

          </div>
        </motion.div>

        {/* Visual Hero Showcase Banner */}
        <div className="mt-12 relative max-w-5xl mx-auto rounded-3xl overflow-hidden border border-rose-200/80 shadow-2xl group">
          <div className="relative h-64 sm:h-80 md:h-96 w-full">
            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=80"
              alt="Let's Relax Luxury Spa"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className={`absolute inset-0 flex items-center ${isRTL ? 'bg-gradient-to-r from-[#2A121D]/85 via-[#2A121D]/45 to-transparent' : 'bg-gradient-to-l from-transparent via-[#2A121D]/45 to-[#2A121D]/85'}`}>
              <div className="p-6 sm:p-10 max-w-md text-white space-y-3">
                <span className="inline-block bg-[#E65A84] text-white text-xs font-bold px-3 py-1 rounded-full">
                  {lang === 'ar' ? 'تجربة استرخاء متكاملة' : 'Complete Wellness Journey'}
                </span>
                <h3 className="text-xl sm:text-3xl font-black">
                  {t('heroCardTitle')}
                </h3>
                <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed">
                  {t('heroCardDesc')}
                </p>
                <button
                  onClick={handleQuickBook}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#CF3A69] font-bold text-xs hover:bg-rose-50 transition-colors shadow-md"
                >
                  <span>{t('heroCardBtn')}</span>
                  {isRTL ? <FiArrowLeft /> : <FiArrowRight />}
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
