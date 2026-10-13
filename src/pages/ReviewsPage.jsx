import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiStar, 
  FiCheckCircle, 
  FiPlus, 
  FiX, 
  FiMessageSquare
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { RATING_SUMMARY, REVIEWS } from '../data/reviewsData';
import { useLanguage } from '../context/LanguageContext';

const ReviewsPage = () => {
  const [reviewsList, setReviewsList] = useState(REVIEWS);
  const [starFilter, setStarFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { lang, isRTL, t } = useLanguage();

  // Form State
  const [newReview, setNewReview] = useState({
    name: '',
    city: 'الرياض',
    service: 'باقة الهدوء Calm Package',
    rating: 5,
    comment: ''
  });

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;

    const reviewToAdd = {
      id: Date.now(),
      name: newReview.name,
      city: newReview.city,
      service: newReview.service,
      date: new Date().toISOString().split('T')[0],
      rating: Number(newReview.rating),
      comment: newReview.comment,
      verified: true
    };

    setReviewsList([reviewToAdd, ...reviewsList]);
    setIsModalOpen(false);
    setNewReview({
      name: '',
      city: 'الرياض',
      service: 'باقة الهدوء Calm Package',
      rating: 5,
      comment: ''
    });
    alert(lang === 'ar' ? 'شكراً لكِ! تمت إضافة تقييمكِ بنجاح 🌸' : 'Thank you! Your review has been submitted successfully 🌸');
  };

  const filteredReviews = reviewsList.filter((r) => {
    if (starFilter === 'all') return true;
    return r.rating === Number(starFilter);
  });

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#FFF9FA]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Banner */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFEAF0] text-[#CF3A69] text-xs font-bold border border-rose-200 mb-3 whitespace-nowrap">
            <HiSparkles className="text-amber-500" />
            <span>{t('reviewsBadge')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#2B151F]">
            {t('reviewsTitle')}
          </h1>
          <p className="text-sm sm:text-base text-[#8E717D] mt-3">
            {t('reviewsDesc')}
          </p>
        </div>

        {/* Rating Breakdown Dashboard Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-rose-100 shadow-xl mb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* 5.0 Star Score */}
            <div className={`md:col-span-5 text-center space-y-2 ${isRTL ? 'md:border-l md:border-rose-100 md:pl-8' : 'md:border-r md:border-rose-100 md:pr-8'}`}>
              <span className="text-6xl font-black text-[#CF3A69] block font-serif">
                {RATING_SUMMARY.average}
              </span>
              <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xl">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="fill-amber-400" />
                ))}
              </div>
              <p className="text-sm font-bold text-[#2B151F]">
                {RATING_SUMMARY.totalReviews} {lang === 'ar' ? 'تقييم موثق' : 'Verified Reviews'}
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-3 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#CF3A69] to-[#E65A84] text-white text-xs font-bold shadow-md hover:scale-105 transition-transform inline-flex items-center gap-2 whitespace-nowrap"
              >
                <FiPlus />
                <span>{t('addReviewBtn')}</span>
              </button>
            </div>

            {/* Percentage Bars */}
            <div className="md:col-span-7 space-y-2.5">
              {RATING_SUMMARY.breakdown.map((b) => (
                <div key={b.stars} className="flex items-center gap-3 text-xs">
                  <span className="w-14 text-[#5A3F4B] font-bold shrink-0">
                    {b.stars} {lang === 'ar' ? 'نجوم' : 'Stars'}
                  </span>

                  <div className="flex-1 h-3 bg-rose-50 rounded-full overflow-hidden border border-rose-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${b.percentage}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E65A84] rounded-full"
                    />
                  </div>

                  <span className="w-14 text-left text-xs font-bold text-[#8E717D] shrink-0">
                    {b.percentage}%
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStarFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                starFilter === 'all'
                  ? 'bg-[#CF3A69] text-white shadow-sm'
                  : 'bg-white text-[#5A3F4B] border border-rose-100 hover:bg-rose-50'
              }`}
            >
              {lang === 'ar' ? `الكل (${reviewsList.length})` : `All (${reviewsList.length})`}
            </button>
            <button
              onClick={() => setStarFilter('5')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                starFilter === '5'
                  ? 'bg-[#CF3A69] text-white shadow-sm'
                  : 'bg-white text-[#5A3F4B] border border-rose-100 hover:bg-rose-50'
              }`}
            >
              5 ⭐
            </button>
            <button
              onClick={() => setStarFilter('4')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                starFilter === '4'
                  ? 'bg-[#CF3A69] text-white shadow-sm'
                  : 'bg-white text-[#5A3F4B] border border-rose-100 hover:bg-rose-50'
              }`}
            >
              4 ⭐
            </button>
          </div>

          <span className="text-xs text-[#8E717D] whitespace-nowrap">
            {lang === 'ar' ? `عرض ${filteredReviews.length} تقييم` : `Showing ${filteredReviews.length} reviews`}
          </span>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 sm:p-6 rounded-3xl bg-white border border-rose-100 shadow-sm hover:shadow-md hover:border-rose-300 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#FFEAF0] text-[#CF3A69] font-black text-sm flex items-center justify-center border border-rose-200">
                    {rev.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#2B151F] flex items-center gap-1.5">
                      <span>{rev.name}</span>
                      {rev.verified && (
                        <FiCheckCircle className="text-emerald-500 text-xs" title="Verified client" />
                      )}
                    </h4>
                    <p className="text-[11px] text-[#8E717D]">{rev.city}</p>
                  </div>
                </div>

                <div className="text-end">
                  <div className="flex items-center gap-1 text-amber-400 text-xs">
                    {[...Array(rev.rating)].map((_, i) => (
                      <FiStar key={i} className="fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#8E717D] block mt-1">{rev.date}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#4A2838] leading-relaxed italic bg-[#FFF9FA] p-3.5 rounded-2xl border border-rose-100/60">
                "{rev.comment}"
              </p>

              <div className="pt-2 text-[11px] text-[#8E717D] flex items-center justify-between">
                <span>{lang === 'ar' ? 'الخدمة المجربة:' : 'Treatment:'} <strong className="text-[#CF3A69]">{rev.service}</strong></span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <FiCheckCircle className="text-xs" /> {lang === 'ar' ? 'زيارة منزلية مؤكدة' : 'Verified Home Visit'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination bar */}
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className="w-8 h-8 rounded-xl bg-white border border-rose-200 text-xs text-[#5A3F4B] hover:bg-rose-50 flex items-center justify-center"
          >
            {isRTL ? '>' : '<'}
          </button>
          <button
            onClick={() => setCurrentPage(1)}
            className={`w-8 h-8 rounded-xl text-xs font-bold ${
              currentPage === 1 ? 'bg-[#CF3A69] text-white' : 'bg-white border border-rose-200 text-[#5A3F4B]'
            }`}
          >
            1
          </button>
          <button
            onClick={() => setCurrentPage(2)}
            className={`w-8 h-8 rounded-xl text-xs font-bold ${
              currentPage === 2 ? 'bg-[#CF3A69] text-white' : 'bg-white border border-rose-200 text-[#5A3F4B]'
            }`}
          >
            2
          </button>
          <button
            onClick={() => setCurrentPage(3)}
            className={`w-8 h-8 rounded-xl text-xs font-bold ${
              currentPage === 3 ? 'bg-[#CF3A69] text-white' : 'bg-white border border-rose-200 text-[#5A3F4B]'
            }`}
          >
            3
          </button>
          <span className="text-xs text-[#8E717D]">..</span>
          <button
            onClick={() => setCurrentPage(59)}
            className="w-8 h-8 rounded-xl bg-white border border-rose-200 text-xs font-bold text-[#5A3F4B]"
          >
            59
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="w-8 h-8 rounded-xl bg-white border border-rose-200 text-xs text-[#5A3F4B] hover:bg-rose-50 flex items-center justify-center"
          >
            {isRTL ? '<' : '>'}
          </button>
        </div>

        {/* Add Review Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              />

              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full z-10 border border-rose-200 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-rose-100 pb-3">
                  <h3 className="font-bold text-lg text-[#2B151F]">
                    {lang === 'ar' ? 'أضيفي تقييمكِ لتجربتكِ 🌸' : 'Share Your Experience 🌸'}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
                  >
                    <FiX className="text-xl" />
                  </button>
                </div>

                <form onSubmit={handleAddReview} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-[#2B151F] mb-1">
                      {lang === 'ar' ? 'اسمكِ الكريم:' : 'Your Name:'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      placeholder={lang === 'ar' ? 'مثال: سارة ناصر' : 'e.g. Sarah Nasser'}
                      className="w-full p-2.5 rounded-xl border border-rose-200 text-xs focus:outline-none focus:border-[#CF3A69]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#2B151F] mb-1">{t('city')}</label>
                      <select
                        value={newReview.city}
                        onChange={(e) => setNewReview({ ...newReview, city: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-rose-200 text-xs focus:outline-none focus:border-[#CF3A69] bg-white"
                      >
                        <option value="الرياض">{t('riyadh')}</option>
                        <option value="الخبر">{t('khobar')}</option>
                        <option value="الدمام">{t('dammam')}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#2B151F] mb-1">
                        {lang === 'ar' ? 'التقييم:' : 'Rating:'}
                      </label>
                      <select
                        value={newReview.rating}
                        onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-rose-200 text-xs focus:outline-none focus:border-[#CF3A69] bg-white"
                      >
                        <option value="5">⭐⭐⭐⭐⭐ (5 {lang === 'ar' ? 'نجوم ممتاز' : 'Stars Excellent'})</option>
                        <option value="4">⭐⭐⭐⭐ (4 {lang === 'ar' ? 'نجوم جيد جداً' : 'Stars Very Good'})</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2B151F] mb-1">
                      {lang === 'ar' ? 'الخدمة المجربة:' : 'Treatment Received:'}
                    </label>
                    <input
                      type="text"
                      value={newReview.service}
                      onChange={(e) => setNewReview({ ...newReview, service: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-rose-200 text-xs focus:outline-none focus:border-[#CF3A69]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2B151F] mb-1">
                      {lang === 'ar' ? 'تعليقكِ ورأيكِ في الجلسة والأخصائية:' : 'Your Feedback & Thoughts:'}
                    </label>
                    <textarea
                      required
                      rows="3"
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder={lang === 'ar' ? 'كيف كانت تجربتكِ مع ليتس ريلاكس؟' : 'How was your experience with Let\'s Relax?'}
                      className="w-full p-2.5 rounded-xl border border-rose-200 text-xs focus:outline-none focus:border-[#CF3A69]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#CF3A69] to-[#E65A84] text-white font-bold text-xs shadow-md hover:opacity-95 transition-opacity whitespace-nowrap"
                  >
                    {lang === 'ar' ? 'نشر التقييم الآن' : 'Submit Review Now'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default ReviewsPage;
