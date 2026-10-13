import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa6';
import { FiX } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const WhatsAppFloating = () => {
  const [showTooltip, setShowTooltip] = useState(true);
  const { lang, isRTL } = useLanguage();

  return (
    <div className={`fixed bottom-6 z-40 flex items-center gap-3 ${isRTL ? 'left-6 flex-row' : 'right-6 flex-row-reverse'}`}>
      {/* Floating Tooltip */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-rose-200 text-xs font-bold text-[#2B151F] whitespace-nowrap">
          <span>{lang === 'ar' ? 'دلالكِ يبدأ هنا 🌸 تواصلي معنا واتساب' : 'Your relaxation starts here 🌸 Chat with us'}</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-gray-400 hover:text-gray-600 p-0.5"
          >
            <FiX className="text-xs" />
          </button>
        </div>
      )}

      {/* Floating Button with pulsing animation */}
      <a
        href="https://wa.me/966537313756?text=Hello%20Lets%20Relax"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all relative group"
        aria-label="WhatsApp"
      >
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping -z-10" />
        <FaWhatsapp className="text-3xl" />
        
        {/* Unread badge */}
        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[9px] font-bold">
          1
        </span>
      </a>
    </div>
  );
};

export default WhatsAppFloating;
