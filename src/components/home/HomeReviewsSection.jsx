import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiStar, 
  FiCheckCircle, 
  FiArrowLeft,
  FiArrowRight,
  FiMessageSquare 
} from 'react-icons/fi';
import { RATING_SUMMARY, REVIEWS } from '../../data/reviewsData';
import { useLanguage } from '../../context/LanguageContext';

const HomeReviewsSection = () => {
  const { lang, isRTL, t } = useLanguage();
  const topReviews = REVIEWS.slice(0, 4);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-[#FFF9FA] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-[#CF3A69] tracking-wider uppercase bg-[#FFEAF0] px-3.5 py-1.5 rounded-full border border-rose-200">
            {t('reviewsBadge')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#2B151F] mt-3">
            {t('reviewsTitle')}
          </h2>
          <p className="text-sm text-[#8E717D] mt-2">
            {t('reviewsDesc')}
          </p>
        </div>

        {/* Rating Dashboard Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xl mb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Rating summary */}
            <div className={`md:col-span-5 text-center space-y-2 ${isRTL ? 'md:border-l md:border-rose-100 md:pl-6' : 'md:border-r md:border-rose-100 md:pr-6'}`}>
              <span className="text-5xl sm:text-6xl font-black text-[#CF3A69] block font-serif">
                {RATING_SUMMARY.average}
              </span>
              <div className="flex items-center justify-center gap-1 text-amber-400 text-lg">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="fill-amber-400" />
                ))}
              </div>
              <p className="text-xs font-bold text-[#2B151F]">
                {lang === 'ar' ? `بناءً على ${RATING_SUMMARY.totalReviews} تقييم حقيقي` : `Based on ${RATING_SUMMARY.totalReviews} verified reviews`}
              </p>
              <span className="inline-block bg-emerald-50 text-emerald-700 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-200">
                {lang === 'ar' ? 'نسبة الرضا 100% موثقة' : '100% Verified Satisfaction'}
              </span>
            </div>

            {/* Breakdown bars */}
            <div className="md:col-span-7 space-y-2">
              {RATING_SUMMARY.breakdown.map((b) => (
                <div key={b.stars} className="flex items-center gap-3 text-xs">
                  <span className="w-14 text-[#5A3F4B] font-bold shrink-0">
                    {b.stars} {lang === 'ar' ? 'نجوم' : 'Stars'}
                  </span>
                  
                  <div className="flex-1 h-3 bg-rose-50 rounded-full overflow-hidden border border-rose-100">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${b.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E65A84] rounded-full"
                    />
                  </div>

                  <span className="w-14 text-left text-[11px] font-bold text-[#8E717D] shrink-0">
                    {b.percentage}%
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {topReviews.map((rev) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-3xl bg-white border border-rose-100 shadow-sm hover:shadow-lg hover:border-rose-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FFEAF0] text-[#CF3A69] font-black text-sm flex items-center justify-center border border-rose-200">
                      {rev.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#2B151F] flex items-center gap-1.5">
                        <span>{rev.name}</span>
                        {rev.verified && (
                          <FiCheckCircle className="text-emerald-500 text-xs" title="Verified client" />
                        )}
                      </h4>
                      <p className="text-[10px] text-[#8E717D]">{rev.city}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-400 text-xs">
                    {[...Array(rev.rating)].map((_, i) => (
                      <FiStar key={i} className="fill-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-[#4A2838] leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-rose-100 flex items-center justify-between text-[11px] text-[#8E717D]">
                <span className="font-bold text-[#CF3A69]">{rev.service}</span>
                <span>{rev.date}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Link to full reviews */}
        <div className="text-center mt-10">
          <Link
            to="/reviews"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#FFF0F3] hover:bg-[#FFEAF0] text-[#CF3A69] font-bold text-xs border border-rose-200 transition-all hover:scale-105 whitespace-nowrap"
          >
            <FiMessageSquare />
            <span>{t('allReviewsBtn')}</span>
            {isRTL ? <FiArrowLeft /> : <FiArrowRight />}
          </Link>
        </div>

      </div>
    </section>
  );
};

export default HomeReviewsSection;
