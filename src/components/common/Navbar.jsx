import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiSearch,
  FiShoppingBag,
  FiMenu,
  FiX,
  FiMapPin,
  FiGift,
  FiGlobe,
  FiUser
} from 'react-icons/fi';
import {
  FaWhatsapp,
  FaCrown
} from 'react-icons/fa6';
import { HiSparkles } from 'react-icons/hi2';
import { useBooking } from '../../context/BookingContext';
import { useLanguage } from '../../context/LanguageContext';
import { CITIES } from '../../data/servicesData';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    cart,
    setIsCartOpen,
    setIsSearchOpen,
    setIsBookingModalOpen,
    selectedCity,
    setSelectedCity
  } = useBooking();

  const { lang, toggleLanguage, isRTL, t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { name: t('navHome'), path: '/' },
    { name: t('navServices'), path: '/services' },
    { name: t('navPackages'), path: '/packages', isPackage: true },
    { name: t('navGallery'), path: '/gallery', hideBelowXl: true },
    { name: t('navReviews'), path: '/reviews', hideBelowXl: true },
    { name: t('navGiftCards'), path: '/gift-cards', isGift: true, hideBelowXl: true },
    { name: t('navFaq'), path: '/faq' },
    { name: t('navAbout'), path: '/about' },
  ];

  return (
    <header className="w-full fixed top-0 left-0 z-40 transition-all duration-300">

      {/* 1. TOP ANNOUNCEMENT & UTILITY BAR */}


      {/* 2. MAIN LUXURY NAVBAR */}
      <nav
        className={`w-full transition-all duration-300 ${isScrolled
          ? 'bg-white/98 backdrop-blur-md shadow-lg border-b border-rose-100 py-2.5'
          : 'bg-white/92 backdrop-blur-md border-b border-rose-100/70 py-3.5'
          }`}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-1 xl:gap-3">

          {/* BRAND LOGO */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="relative shrink-0">
              <img
                src="/images/logo-icon.png"
                alt="Let's Relax - Luxury Home Spa"
                className="h-8 sm:h-9 w-auto object-contain drop-shadow-[0_2px_10px_rgba(207,58,105,0.2)] group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-base sm:text-lg font-serif font-black tracking-tight text-[#2B151F] group-hover:text-[#CF3A69] transition-colors leading-none">
                Let's Relax
              </span>
              <span className="text-[8px] sm:text-[9px] text-[#8E717D] group-hover:text-[#CF3A69]/80 font-bold tracking-wide whitespace-nowrap mt-1 leading-none transition-colors">
                {t('brandSub')}
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV LINKS - WITH MANDATORY whitespace-nowrap */}
          <div className="hidden lg:flex items-center gap-0.5 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`${link.hideBelowXl ? 'hidden xl:flex' : 'flex'} px-2 py-1.5 rounded-xl text-xs xl:text-sm font-bold whitespace-nowrap transition-all relative items-center gap-1.5 ${isActive
                    ? 'text-[#CF3A69] bg-[#FFF0F3]'
                    : 'text-[#4A2838] hover:text-[#CF3A69] hover:bg-[#FFF7F9]'
                    } ${link.isGift ? 'text-[#B02652] bg-gradient-to-r from-rose-50 to-amber-50/50 border border-rose-200/60' : ''}`}
                >
                  {link.isGift && <FiGift className="text-[#E65A84] text-xs shrink-0" />}
                  {link.isPackage && <FaCrown className="text-amber-500 text-xs shrink-0" />}
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-[#CF3A69] to-[#E65A84] rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ACTIONS: LANGUAGE PILL, SEARCH, CART, BOOKING BUTTON */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">

            {/* Language Switch Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-rose-200 text-[#4A2838] hover:text-[#CF3A69] hover:bg-[#FFF0F3] text-xs font-bold transition-all whitespace-nowrap"
              title="تغيير اللغة"
            >
              <FiGlobe className="text-sm text-[#CF3A69]" />
              <span className="text-[11px] font-black uppercase tracking-wider">
                {lang === 'ar' ? 'EN' : 'عربي'}
              </span>
            </button>

            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-xl text-[#5A3F4B] hover:text-[#CF3A69] hover:bg-[#FFF0F3] border border-transparent hover:border-[#FED6E2] transition-colors"
              title={lang === 'ar' ? 'بحث عن خدمة' : 'Search service'}
            >
              <FiSearch className="text-base" />
            </button>

            {/* Login Link (clients - OTP at /login) */}
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-[#5A3F4B] hover:text-[#CF3A69] hover:bg-[#FFF0F3] border border-rose-200 text-xs font-bold transition-all whitespace-nowrap"
              title={lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
            >
              <FiUser className="text-sm" />
              <span className="hidden sm:inline">{lang === 'ar' ? 'دخول' : 'Login'}</span>
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl text-[#5A3F4B] hover:text-[#CF3A69] hover:bg-[#FFF0F3] border border-transparent hover:border-[#FED6E2] transition-colors"
              title={t('cart')}
            >
              <FiShoppingBag className="text-lg" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#CF3A69] to-[#E65A84] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Quick Book CTA Button */}
            <button
              onClick={() => setIsBookingModalOpen(true)}
              title={t('bookNow')}
              className="hidden sm:inline-flex items-center gap-1 px-2 xl:px-3 py-2 rounded-xl bg-gradient-to-r from-[#CF3A69] via-[#E65A84] to-[#CF3A69] text-white font-black text-xs shadow-md shadow-rose-400/25 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
            >
              <FaCrown className="text-[#FFDF78] text-xs shrink-0" />
              <span className="hidden lg:inline">{t('bookNow')}</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#5A3F4B] hover:bg-[#FFF0F3] transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
            </button>

          </div>

        </div>

        {/* MOBILE MENU ACCORDION */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/98 backdrop-blur-xl border-b border-rose-200 px-4 pt-3 pb-6 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between whitespace-nowrap ${isActive
                      ? 'bg-[#FFF0F3] text-[#CF3A69]'
                      : 'text-[#4A2838] hover:bg-[#FFF7F9]'
                      }`}
                  >
                    <span className="flex items-center gap-2">
                      {link.isGift && <FiGift className="text-[#E65A84]" />}
                      {link.isPackage && <FaCrown className="text-amber-500" />}
                      {link.name}
                    </span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-[#CF3A69]" />}
                  </Link>
                );
              })}

              {/* Language Switcher inside Mobile Menu */}
              <div className="pt-3 border-t border-rose-100 flex items-center justify-between px-2 mt-2">
                <span className="text-xs font-bold text-[#8E717D]">
                  {lang === 'ar' ? 'لغة الموقع:' : 'Language:'}
                </span>
                <button
                  onClick={() => {
                    toggleLanguage();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-[#CF3A69] flex items-center gap-1.5"
                >
                  <FiGlobe />
                  <span>{lang === 'ar' ? 'English (EN)' : 'العربية (AR)'}</span>
                </button>
              </div>

              {/* Mobile CTA */}
              <div className="pt-3 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsBookingModalOpen(true);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#CF3A69] to-[#E65A84] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
                >
                  <FaCrown className="text-[#FFDF78]" />
                  <span>{t('bookNow')}</span>
                </button>

                <a
                  href="https://wa.me/966537313756"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs text-center border border-emerald-200 flex items-center justify-center gap-2"
                >
                  <FaWhatsapp className="text-base text-emerald-600" />
                  <span>0537313756 - {t('whatsappHelp')}</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </nav>
    </header>
  );
};

export default Navbar;
