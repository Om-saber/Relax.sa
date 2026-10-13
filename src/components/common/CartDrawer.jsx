import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiTrash2, 
  FiPlus, 
  FiMinus, 
  FiShoppingBag, 
  FiTag, 
  FiCheck,
  FiArrowLeft,
  FiArrowRight,
  FiClock
} from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa6';
import { useBooking } from '../../context/BookingContext';
import { useLanguage } from '../../context/LanguageContext';

const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    finalTotal,
    tabbyInstallment,
    bookingDetails,
    applyCoupon,
    removeCoupon,
    setIsBookingModalOpen
  } = useBooking();

  const { lang, isRTL, t } = useLanguage();
  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput) return;
    const success = applyCoupon(couponInput);
    if (success) setCouponInput('');
  };

  const handleProceedToBooking = () => {
    setIsCartOpen(false);
    setIsBookingModalOpen(true);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Container */}
          <div className={`fixed inset-y-0 max-w-full flex ${isRTL ? 'left-0 pl-0 md:pl-10' : 'right-0 pr-0 md:pr-10'}`}>
            <motion.div
              initial={{ x: isRTL ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full border-r border-rose-100"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-rose-100 flex items-center justify-between bg-gradient-to-r from-[#FFF5F7] to-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FFEAF0] text-[#CF3A69] flex items-center justify-center">
                    <FiShoppingBag className="text-lg" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2B151F] text-lg">{t('cart')}</h3>
                    <p className="text-xs text-[#8E717D]">
                      {cart.length === 0 ? t('cartEmpty') : `${cart.length} ${t('cartItemsCount')}`}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-xl text-[#8E717D] hover:text-[#2B151F] hover:bg-rose-50 transition-colors"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cart.length === 0 ? (
                  <div className="py-16 text-center space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-[#FFF0F3] border border-[#FED6E2] flex items-center justify-center text-3xl">
                      🌸
                    </div>
                    <div>
                      <h4 className="font-bold text-[#2B151F] text-base">{t('cartEmpty')}</h4>
                      <p className="text-xs text-[#8E717D] max-w-xs mx-auto mt-1">
                        {lang === 'ar' ? 'استكشفي باقاتنا وجلسات المساج المنزلي الفاخر ودللي نفسكِ اليوم.' : 'Explore our royal home spa packages and treat yourself to luxury today.'}
                      </p>
                    </div>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="px-6 py-2.5 rounded-xl bg-[#CF3A69] text-white font-bold text-xs shadow-md hover:bg-[#B02652] transition-colors"
                    >
                      {t('exploreServices')}
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Cart Items List */}
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="p-3.5 rounded-2xl border border-rose-100 bg-[#FFFDFE] flex gap-3 relative hover:border-rose-300 transition-colors"
                        >
                          {/* Image */}
                          <img
                            src={item.image}
                            alt={lang === 'ar' ? item.title : (item.titleEn || item.title)}
                            className="w-20 h-20 rounded-xl object-cover border border-rose-100 shrink-0"
                          />

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs text-[#2B151F] truncate">
                              {lang === 'ar' ? item.title : (item.titleEn || item.title)}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-[#8E717D]">
                              <span className="flex items-center gap-1">
                                <FiClock className="text-[#E65A84]" /> {item.duration}
                              </span>
                              <span className="text-[#CF3A69] font-black">
                                {item.price} {t('currency')}
                              </span>
                            </div>

                            {/* Quantity controls */}
                            <div className="flex items-center justify-between mt-2.5">
                              <div className="flex items-center gap-2 bg-[#FFF0F3] px-2 py-0.5 rounded-lg border border-[#FED6E2]">
                                <button
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="text-[#CF3A69] hover:text-[#B02652] p-0.5"
                                >
                                  <FiMinus className="text-xs" />
                                </button>
                                <span className="text-xs font-bold text-[#2B151F] w-4 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="text-[#CF3A69] hover:text-[#B02652] p-0.5"
                                >
                                  <FiPlus className="text-xs" />
                                </button>
                              </div>

                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-rose-400 hover:text-rose-600 p-1 text-xs"
                                title="Delete"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tabby & Tamara Installment Banner */}
                    <div className="p-3 rounded-xl bg-gradient-to-r from-[#2CE5AA]/10 via-[#FFF0F3] to-[#FF855D]/10 border border-rose-200 text-xs">
                      <p className="font-bold text-[#2B151F] flex items-center justify-between">
                        <span>{t('tabbySplit')}</span>
                        <span className="text-[#CF3A69] font-black">{tabbyInstallment} {t('tabbyPerMonth')}</span>
                      </p>
                      <p className="text-[11px] text-[#8E717D] mt-0.5">
                        {t('noInterest')}
                      </p>
                    </div>

                    {/* Coupon Input */}
                    <div className="pt-2">
                      {bookingDetails.appliedCoupon ? (
                        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs">
                          <span className="flex items-center gap-1.5 text-emerald-800 font-bold">
                            <FiCheck className="text-emerald-600" />
                            {lang === 'ar' ? `كود مفعل: ${bookingDetails.appliedCoupon} (خصم ${bookingDetails.discountPercent}%)` : `Applied: ${bookingDetails.appliedCoupon} (${bookingDetails.discountPercent}% OFF)`}
                          </span>
                          <button
                            onClick={removeCoupon}
                            className="text-xs text-rose-600 hover:underline font-semibold"
                          >
                            {t('remove')}
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleApplyCoupon} className="flex gap-2">
                          <div className="relative flex-1">
                            <FiTag className="absolute right-3 top-3 text-rose-300 text-xs" />
                            <input
                              type="text"
                              value={couponInput}
                              onChange={(e) => setCouponInput(e.target.value)}
                              placeholder={t('enterCoupon')}
                              className="w-full pr-8 pl-3 py-2 text-xs border border-rose-200 rounded-xl focus:outline-none focus:border-[#CF3A69] uppercase font-bold"
                            />
                          </div>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-[#2B151F] text-white rounded-xl text-xs font-bold hover:bg-[#4A2838] transition-colors shrink-0"
                          >
                            {t('apply')}
                          </button>
                        </form>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Drawer Footer with Totals & Checkout */}
              {cart.length > 0 && (
                <div className="p-5 border-t border-rose-100 bg-[#FFFDFE] space-y-3">
                  <div className="space-y-1.5 text-xs text-[#5A3F4B]">
                    <div className="flex justify-between">
                      <span>{t('subtotal')}</span>
                      <span className="font-bold text-[#2B151F]">{subtotal} {t('currency')}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>{t('discount')}</span>
                        <span>-{discountAmount} {t('currency')}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-base font-black text-[#2B151F] pt-2 border-t border-rose-100">
                      <span>{t('total')}</span>
                      <span className="text-[#CF3A69]">{finalTotal} {t('currency')}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleProceedToBooking}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#CF3A69] via-[#E65A84] to-[#CF3A69] text-white font-bold text-sm shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
                  >
                    <FaCrown className="text-[#FFDF78] text-xs" />
                    <span>{t('proceedBooking')}</span>
                    {isRTL ? <FiArrowLeft className="text-base" /> : <FiArrowRight className="text-base" />}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
