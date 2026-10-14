import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiPhone, 
  FiMail, 
  FiMapPin, 
  FiShield, 
  FiCheckCircle, 
  FiHeart 
} from 'react-icons/fi';
import { 
  FaWhatsapp, 
  FaInstagram, 
  FaTiktok, 
  FaSnapchat, 
  FaXTwitter, 
  FaFacebookF
} from 'react-icons/fa6';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
  const { lang, t } = useLanguage();

  return (
    <footer className="w-full bg-[#1A0A12] text-[#FDE8ED] border-t border-[#F782A3]/20 pt-16 pb-8 relative overflow-hidden">
      {/* Decorative luxury background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E65A84]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3.5 group">
              <img
                src="/images/logo-icon.png"
                alt="Let's Relax Logo"
                className="h-14 w-auto object-contain brightness-110 drop-shadow-[0_0_12px_rgba(247,130,163,0.35)] group-hover:scale-105 transition-transform"
              />
              <div>
                <span className="text-2xl font-black text-white tracking-wide font-serif block group-hover:text-[#F782A3] transition-colors">
                  Let's Relax
                </span>
                <p className="text-xs text-[#F782A3] font-semibold mt-0.5">
                  {t('brandSub')}
                </p>
              </div>
            </Link>

            <p className="text-sm text-rose-200/80 leading-relaxed">
              {t('footerBio')}
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://wa.me/966537313756"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-emerald-600/30 text-rose-200 hover:text-emerald-400 border border-white/10 flex items-center justify-center transition-all hover:scale-110"
                title="WhatsApp"
              >
                <FaWhatsapp className="text-base" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-pink-600/30 text-rose-200 hover:text-pink-400 border border-white/10 flex items-center justify-center transition-all hover:scale-110"
                title="Instagram"
              >
                <FaInstagram className="text-base" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/20 text-rose-200 hover:text-white border border-white/10 flex items-center justify-center transition-all hover:scale-110"
                title="TikTok"
              >
                <FaTiktok className="text-base" />
              </a>
              <a
                href="https://snapchat.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-yellow-500/30 text-rose-200 hover:text-yellow-400 border border-white/10 flex items-center justify-center transition-all hover:scale-110"
                title="Snapchat"
              >
                <FaSnapchat className="text-base" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/20 text-rose-200 hover:text-white border border-white/10 flex items-center justify-center transition-all hover:scale-110"
                title="X Twitter"
              >
                <FaXTwitter className="text-base" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-blue-600/30 text-rose-200 hover:text-blue-400 border border-white/10 flex items-center justify-center transition-all hover:scale-110"
                title="Facebook"
              >
                <FaFacebookF className="text-base" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#E65A84] rounded-full inline-block" />
              {t('importantLinks')}
            </h4>
            <ul className="space-y-2 text-sm text-rose-200/80">
              <li>
                <Link to="/" className="hover:text-white hover:translate-x-[-3px] inline-block transition-transform">
                  {t('navHome')}
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white hover:translate-x-[-3px] inline-block transition-transform">
                  {t('navServices')}
                </Link>
              </li>
              <li>
                <Link to="/packages" className="hover:text-white hover:translate-x-[-3px] inline-block transition-transform text-[#F782A3] font-bold">
                  {t('navPackages')} 👑
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-white hover:translate-x-[-3px] inline-block transition-transform">
                  {t('navGallery')}
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-white hover:translate-x-[-3px] inline-block transition-transform">
                  {t('navReviews')}
                </Link>
              </li>
              <li>
                <Link to="/gift-cards" className="hover:text-white hover:translate-x-[-3px] inline-block transition-transform">
                  {t('navGiftCards')}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white hover:translate-x-[-3px] inline-block transition-transform">
                  {t('navFaq')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white hover:translate-x-[-3px] inline-block transition-transform">
                  {t('navAbout')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white hover:translate-x-[-3px] inline-block transition-transform">
                  {t('navTerms')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contact (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#D4AF37] rounded-full inline-block" />
              {t('contactUs')}
            </h4>
            <div className="space-y-3 text-sm text-rose-200/80">
              <a
                href="tel:+966537313756"
                className="flex items-center gap-2 hover:text-white transition-colors"
                dir="ltr"
              >
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#F782A3]">
                  <FiPhone />
                </div>
                <span>+966 53 731 3756</span>
              </a>

              <a
                href="mailto:letsrelax.ksa@gmail.com"
                className="flex items-center gap-2 hover:text-white transition-colors text-xs"
                dir="ltr"
              >
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#F782A3]">
                  <FiMail />
                </div>
                <span>letsrelax.ksa@gmail.com</span>
              </a>

              <div className="flex items-center gap-2 text-xs">
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#F782A3]">
                  <FiMapPin />
                </div>
                <span>{lang === 'ar' ? 'الرياض - الخبر - الدمام' : 'Riyadh - Khobar - Dammam'}</span>
              </div>
            </div>
          </div>

          {/* Col 4: Payment Methods & Business Center Verification (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#E65A84] rounded-full inline-block" />
              {t('paymentMethods')}
            </h4>
            
            {/* Payment Methods Images Showcase */}
            <div className="flex flex-wrap gap-2 items-center">
              <div className="bg-white rounded-xl p-1 shadow-xs border border-white/20 hover:scale-105 transition-transform flex items-center justify-center h-9 w-[60px]">
                <img src="/images/payments/apple-pay.svg" alt="Apple Pay" className="h-full w-full object-contain" />
              </div>
              <div className="bg-white rounded-xl p-1 shadow-xs border border-white/20 hover:scale-105 transition-transform flex items-center justify-center h-9 w-[60px]">
                <img src="/images/payments/mastercard.svg" alt="MasterCard" className="h-full w-full object-contain" />
              </div>
              <div className="bg-white rounded-xl p-1 shadow-xs border border-white/20 hover:scale-105 transition-transform flex items-center justify-center h-9 w-[60px]">
                <img src="/images/payments/visa.svg" alt="VISA" className="h-full w-full object-contain" />
              </div>
              <div className="bg-white rounded-xl p-1 shadow-xs border border-white/20 hover:scale-105 transition-transform flex items-center justify-center h-9 w-[60px]">
                <img src="/images/payments/mada.svg" alt="mada" className="h-full w-full object-contain" />
              </div>
              <div className="bg-white rounded-xl p-1 shadow-xs border border-white/20 hover:scale-105 transition-transform flex items-center justify-center h-9 w-[60px]">
                <img src="/images/payments/tamara.svg" alt="tamara" className="h-full w-full object-contain" />
              </div>
              <div className="bg-white rounded-xl p-1 shadow-xs border border-white/20 hover:scale-105 transition-transform flex items-center justify-center h-9 w-[60px]">
                <img src="/images/payments/tabby.svg" alt="tabby" className="h-full w-full object-contain" />
              </div>
            </div>

            {/* Saudi Business Center Official Verification Badge Card */}
            <div className="mt-1 bg-white rounded-2xl p-2.5 shadow-sm border border-white/20 flex items-center justify-between gap-3 hover:shadow-md transition-shadow">
              <img
                src="/images/payments/saudi-business-center.svg"
                alt={t('businessCenter')}
                className="h-10 w-full object-contain"
              />
            </div>

          </div>

        </div>

        {/* Footer Bottom Line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-rose-200/60">
          <p>{t('rights')}</p>
          <p className="flex items-center gap-1.5 text-rose-200/80">
            {t('footerLove')} <FiHeart className="text-[#E65A84]" />
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
