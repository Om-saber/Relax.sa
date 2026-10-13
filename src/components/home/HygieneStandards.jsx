import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiShield, 
  FiCheckCircle, 
  FiHeart 
} from 'react-icons/fi';
import { FaUserNurse } from 'react-icons/fa6';
import { useLanguage } from '../../context/LanguageContext';

const HygieneStandards = () => {
  const { lang, t } = useLanguage();

  const standards = [
    {
      title: t('hygiene1Title'),
      desc: t('hygiene1Desc'),
      icon: <FiShield className="text-2xl text-emerald-500" />,
      tag: lang === 'ar' ? 'تعقيم طبي' : 'Medical Sterilization',
    },
    {
      title: t('hygiene2Title'),
      desc: t('hygiene2Desc'),
      icon: <FiCheckCircle className="text-2xl text-[#CF3A69]" />,
      tag: lang === 'ar' ? 'استخدام فردي 100%' : '100% Single Use',
    },
    {
      title: t('hygiene3Title'),
      desc: t('hygiene3Desc'),
      icon: <FiHeart className="text-2xl text-rose-500" />,
      tag: lang === 'ar' ? 'مكونات نقية' : 'Pure Ingredients',
    },
    {
      title: t('hygiene4Title'),
      desc: t('hygiene4Desc'),
      icon: <FaUserNurse className="text-2xl text-amber-500" />,
      tag: lang === 'ar' ? 'كادر مرخص' : 'Certified Staff',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            {t('hygieneSecBadge')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#2B151F] mt-3">
            {t('hygieneSecTitle')}
          </h2>
          <p className="text-sm text-[#8E717D] mt-2">
            {t('hygieneSecDesc')}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {standards.map((std, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 rounded-3xl bg-[#FFF9FA] border border-rose-100 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                    {std.icon}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                    {std.tag}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#2B151F] mb-2">
                  {std.title}
                </h3>

                <p className="text-xs text-[#5A3F4B] leading-relaxed">
                  {std.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-rose-100/60 flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold">
                <FiCheckCircle /> {lang === 'ar' ? 'مطابقة للمعايير الصحية بالمملكة' : 'Compliant with Kingdom Health Standards'}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HygieneStandards;
