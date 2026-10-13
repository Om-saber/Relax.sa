import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiCalendar, 
  FiTruck, 
  FiSmile, 
  FiCreditCard 
} from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const HowItWorksSection = () => {
  const { t } = useLanguage();

  const steps = [
    {
      step: '01',
      title: t('step1Title'),
      desc: t('step1Desc'),
      icon: <FiCalendar className="text-xl text-[#CF3A69]" />,
    },
    {
      step: '02',
      title: t('step2Title'),
      desc: t('step2Desc'),
      icon: <FiTruck className="text-xl text-[#CF3A69]" />,
    },
    {
      step: '03',
      title: t('step3Title'),
      desc: t('step3Desc'),
      icon: <FiSmile className="text-xl text-[#CF3A69]" />,
    },
    {
      step: '04',
      title: t('step4Title'),
      desc: t('step4Desc'),
      icon: <FiCreditCard className="text-xl text-[#CF3A69]" />,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#FFF9FA] border-y border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#CF3A69] tracking-wider uppercase bg-[#FFEAF0] px-3.5 py-1.5 rounded-full border border-rose-200">
            {t('howBadge')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#2B151F] mt-3">
            {t('howTitle')}
          </h2>
          <p className="text-sm text-[#8E717D] mt-2">
            {t('howDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((s, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-6 border border-rose-100 shadow-sm hover:shadow-xl hover:border-rose-300 transition-all duration-300 relative group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFEAF0] border border-rose-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {s.icon}
                  </div>
                  <span className="text-3xl font-black text-rose-200 group-hover:text-[#CF3A69] transition-colors font-serif">
                    {s.step}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#2B151F] mb-2">
                  {s.title}
                </h3>

                <p className="text-xs text-[#5A3F4B] leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="w-8 h-1 bg-gradient-to-r from-[#CF3A69] to-rose-200 rounded-full mt-6 group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;
