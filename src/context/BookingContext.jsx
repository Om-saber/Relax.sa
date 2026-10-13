import React, { createContext, useContext, useState, useEffect } from 'react';

const BookingContext = createContext();

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  // Cart state
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('letsrelax_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Selected city: 'riyadh', 'khobar', 'dammam'
  const [selectedCity, setSelectedCity] = useState('riyadh');

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeServiceModal, setActiveServiceModal] = useState(null); // service object

  // Booking Wizard Form state
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    phone: '',
    city: 'الرياض',
    district: '',
    address: '',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '12:30 ظهراً - 02:30 ظهراً',
    specialistNote: '',
    paymentMethod: 'tabby', // 'tabby', 'tamara', 'cash', 'card', 'applepay'
    appliedCoupon: '',
    discountPercent: 0,
  });

  // Toast notifications
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('letsrelax_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const addToCart = (service) => {
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item.id === service.id);
      if (exists) {
        showToast(`تمت إضافة جلسة أخرى من "${service.title}" لسلة الحجز!`);
        return prevCart.map((item) =>
          item.id === service.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      showToast(`تمت إضافة "${service.title}" لسلة حجزك بنجاح 🌸`);
      return [...prevCart, { ...service, quantity: 1 }];
    });
  };

  const removeFromCart = (serviceId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== serviceId));
    showToast('تم حذف الخدمة من سلة الحجز', 'info');
  };

  const updateQuantity = (serviceId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === serviceId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Instant booking for a specific service (adds it and opens wizard immediately)
  const quickBookService = (service) => {
    addToCart(service);
    setIsCartOpen(false);
    setIsBookingModalOpen(true);
  };

  // Pricing calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * (bookingDetails.discountPercent / 100));
  const finalTotal = Math.max(0, subtotal - discountAmount);
  const tabbyInstallment = finalTotal > 0 ? (finalTotal / 4).toFixed(2) : 0;

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'RELAX15') {
      setBookingDetails((prev) => ({
        ...prev,
        appliedCoupon: 'RELAX15',
        discountPercent: 15,
      }));
      showToast('🎉 تم تطبيق كود الخصم RELAX15 بنجاح! وفرتِ 15%');
      return true;
    } else if (cleanCode === 'SPA10') {
      setBookingDetails((prev) => ({
        ...prev,
        appliedCoupon: 'SPA10',
        discountPercent: 10,
      }));
      showToast('🎉 تم تطبيق كود الخصم SPA10 بنجاح! وفرتِ 10%');
      return true;
    } else {
      showToast('عذراً، كود الخصم غير صالح أو منتهي الصلاحية', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setBookingDetails((prev) => ({
      ...prev,
      appliedCoupon: '',
      discountPercent: 0,
    }));
    showToast('تمت إزالة كود الخصم', 'info');
  };

  // Format booking details for direct WhatsApp dispatch
  const generateWhatsAppMessage = () => {
    const servicesList = cart
      .map((item, idx) => `  ${idx + 1}. ${item.title} (العدد: ${item.quantity}) - ${item.price * item.quantity} ر.س`)
      .join('\n');

    const paymentArabic = {
      tabby: 'تقسيط عبر تابي (Tabby)',
      tamara: 'تقسيط عبر تمارا (Tamara)',
      cash: 'الدفع نقداً بعد انتهاء الجلسة',
      card: 'بطاقة مدى / فيزا عند الوصول',
      applepay: 'أبل باي (Apple Pay)',
    }[bookingDetails.paymentMethod] || bookingDetails.paymentMethod;

    return `🌸 *طلب حجز سبا منزلي فاخر - Let's Relax* 🌸
-------------------------------------
👤 *اسم العميلة:* ${bookingDetails.name || 'عميلة ليتس ريلاكس'}
📱 *رقم الجوال:* ${bookingDetails.phone || 'غير مسجل'}
📍 *المدينة:* ${bookingDetails.city}
🏡 *الحي والعنوان:* ${bookingDetails.district ? bookingDetails.district + ' - ' : ''}${bookingDetails.address || 'سيتم إرسال اللوكيشن'}
📅 *التاريخ المفضل:* ${bookingDetails.date}
⏰ *الوقت المناسب:* ${bookingDetails.timeSlot}

💆🏻‍♀️ *الخدمات المختارة:*
${servicesList || '  - استفسار عن حجز باقة استرخاء'}

💵 *المجموع:* ${finalTotal} ر.س ${bookingDetails.discountPercent > 0 ? `(بعد خصم ${bookingDetails.discountPercent}%)` : ''}
💳 *طريقة الدفع المفضلة:* ${paymentArabic}
${bookingDetails.specialistNote ? `📝 *ملاحظات خاصة:* ${bookingDetails.specialistNote}` : ''}

يرجى تأكيد توفر الموعد وإرسال بيانات التأكيد. شكراً لكم! ✨`;
  };

  const sendWhatsAppBooking = () => {
    const message = generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/966537313756?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discountAmount,
    finalTotal,
    tabbyInstallment,
    selectedCity,
    setSelectedCity,
    isCartOpen,
    setIsCartOpen,
    isBookingModalOpen,
    setIsBookingModalOpen,
    isSearchOpen,
    setIsSearchOpen,
    activeServiceModal,
    setActiveServiceModal,
    bookingDetails,
    setBookingDetails,
    applyCoupon,
    removeCoupon,
    quickBookService,
    generateWhatsAppMessage,
    sendWhatsAppBooking,
    toast,
    showToast,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};
