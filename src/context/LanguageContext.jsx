import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const translations = {
  ar: {
    // Top Bar & Navbar
    promoTag: 'خصم 15% بكود:',
    topSub: 'سبا منزلي نسائي فاخر بأعلى معايير الخصوصية والتعقيم',
    currency: 'ر.س',
    city: 'المدينة',
    selectCity: 'اختر مدينتك',
    riyadh: 'الرياض',
    khobar: 'الخبر',
    dammam: 'الدمام',
    jeddah: 'جدة (قريباً)',
    whatsappHelp: 'تواصل مباشر واتساب',
    bookNow: 'احجزي الآن',
    brandTag: 'سبا',
    brandSub: 'سبا منزلي فاخر للنساء فقط',
    navHome: 'الرئيسية',
    navServices: 'الخدمات والباقات',
    navMoroccan: 'الحمام المغربي',
    navGallery: 'معرض الصور',
    navReviews: 'آراء العملاء',
    navGiftCards: 'كروت الإهداء',
    navFaq: 'الأسئلة الشائعة',
    navAbout: 'من نحن',
    navTerms: 'الشروط والأحكام',
    cart: 'سلة الحجز',
    cartEmpty: 'سلة الحجز فارغة حالياً',
    cartItemsCount: 'خدمات مضافة',
    exploreServices: 'تصفح الخدمات والباقات',
    subtotal: 'المجموع الفرعي:',
    discount: 'الخصم المطبق:',
    total: 'الإجمالي النهائي:',
    proceedBooking: 'متابعة تفاصيل الحجز',
    tabbySplit: 'قسّطي حجزك على 4 دفعات:',
    tabbyPerMonth: 'ر.س / شهرياً',
    noInterest: 'بدون أي فوائد عبر تابي أو تمارا',
    enterCoupon: 'أدخلي كود الخصم (مثل RELAX15)',
    apply: 'تطبيق',
    remove: 'إلغاء',
    couponApplied: 'تم تطبيق كود الخصم بنجاح!',

    // Hero
    heroBadge: 'سبا منزلي نسائي فاخر | الرياض - الخبر - الدمام',
    heroBadgeSub: 'أخصائيات معتمدات وأعلى معايير الخصوصية',
    heroTitle1: 'دلال استثنائي وراحة ملكية',
    heroTitle2: 'في راحة ودفء منزلكِ 🌸',
    heroDesc: 'نصل إليكِ بكامل التجهيزات الفندقية الفاخرة: سرير مساج مريح، مفارش ومناشف معقمة للاستخدام الفردي، زيوت عضوية فرنسية، وطقوس عطرية تعيد لجسدكِ توازنه ونضارته.',
    ratingBadge: 'تقييم 5.0 (581+ تقييم موثق)',
    hygieneBadge: 'تعقيم طبي واستخدام مرة واحدة',
    tabbyBadge: 'تقسيط تابي وتمارا 0%',
    sessionDate: 'تاريخ الجلسة',
    preferredTime: 'الوقت المناسب',
    heroCardTitle: 'عيشي أجواء السبا الملكي دون مغادرة غرفتكِ',
    heroCardDesc: 'نحن نوفر كل التفاصيل: من الشموع والموسيقى والزيوت الطبيعية وحتى السرير الفندقي المعقم.',
    heroCardBtn: 'استكشفي الباقات والعروض',

    // Categories
    categoriesBadge: 'أقسام السبا الفاخرة',
    categoriesTitle: 'اختاري نوع التجربة التي تناسبكِ اليوم',
    catAll: 'جميع الخدمات',
    catPackages: 'باقات الدلال و VIP',
    catMassage: 'المساج الفاخر',
    catMoroccan: 'الحمام المغربي الملكي',
    catBeauty: 'العناية والتجميل',
    catMaternity: 'مساج الحوامل وبعد الولادة',

    // Packages
    packagesBadge: 'عروض وتجارب الـ VIP الفاخرة',
    packagesTitle: 'باقات الدلال الشاملة',
    packagesDesc: 'صُممت هذه الباقات خصيصاً لتمنحكِ تجربة سبا متكاملة تجمع بين المساج، الزيوت العطرية، والعناية الفندقية الفاخرة.',
    packagesNotice: 'جميع الباقات تشمل سرير المساج والمناشف المعقمة',
    viewDetails: 'عرض التفاصيل',
    addToCart: 'إضافة للسلة',
    quickBook: 'احجزي الآن',

    // Services
    servicesBadge: 'جلسات المساج والعناية التخصصية',
    servicesTitle: 'خدمات السبا الفردية',
    servicesDesc: 'اختاري الجلسة المناسبة لاحتياج جسمكِ اليوم، وتصلكِ أخصائيتنا بكامل التجهيزات والزيوت الطبيعية المعقمة.',

    // Moroccan Bath
    moroccanBadge: 'طقوس النقاء الملكية في راحة بيتكِ',
    moroccanTitle1: 'الحمام المغربي الفاخر',
    moroccanTitle2: 'بأصالته ومكوناته الطبيعية 100%',
    moroccanDesc: 'نأتي إليكِ بالصابون المغربي البلدي المعتق بزيت الزيتون، طمي جبال الأطلس المعطر بماء الورد الفاسي، وليفة كسال أصلية جديدة مغلفة لكل عميلة، لتنعمي ببشرة ناعمة موردة ونقية.',
    moroccanFeature1Title: 'ليفة كسال جديدة مغلفة',
    moroccanFeature1Desc: 'أحادية الاستخدام تفتح بحضوركِ لضمان النظافة',
    moroccanFeature2Title: 'صابون بلدي وطمي فاسي',
    moroccanFeature2Desc: 'مستورد ومصنوع من أجود المكونات العضوية',
    moroccanFeature3Title: 'ترطيب وحماية بعد الجلسة',
    moroccanFeature3Desc: 'لوشن زبدة الشيا وزيت الأرجان الأصلي',
    moroccanFeature4Title: 'تنظيف وتعقيم المكان',
    moroccanFeature4Desc: 'تترك الأخصائية حمامكِ نظيفاً ومعطراً',
    moroccanBookBtn: 'احجزي الحمام المغربي الملكي (350 ر.س)',
    moroccanStepsBtn: 'عرض خطوات الجلسة',

    // How It Works
    howBadge: 'خطوات بسيطة وسلسة',
    howTitle: 'كيف تبدأ رحلة دلالكِ مع Let\'s Relax؟',
    howDesc: 'كل ما عليكِ هو الاسترخاء، ونحن نتكفل بجميع التفاصيل من الباب إلى الباب.',
    step1Title: 'اختاري باقتكِ وموعدكِ',
    step1Desc: 'حددي الخدمة التي تناسبكِ، ثم اختاري اليوم والوقت المناسب لجدولكِ في الرياض أو الخبر أو الدمام.',
    step2Title: 'تصلكِ الأخصائية بكامل التجهيزات',
    step2Desc: 'سرير مساج مريح، مناشف فندقية معقمة، زيوت طبيعية، شموع وموسيقى هادئة دون الحاجة لتحضير أي شيء.',
    step3Title: 'عيشي تجربة الدلال والراحة',
    step3Desc: 'استسلمي لأيدي أخصائياتنا المعتمدات في بيئة مفعمة بالهدوء والخصوصية النسائية التامة داخل منزلكِ.',
    step4Title: 'ادفعي براحة وأمان',
    step4Desc: 'ادفعي كاش، ببطاقة مدى، أو قسّمي المبلغ على 4 دفعات ميسرة بدون أي فوائد عبر تابي وتمارا.',

    // Hygiene
    hygieneSecBadge: 'أعلى معايير السلامة والأمان',
    hygieneSecTitle: 'معايير النظافة والتعقيم الفندقية',
    hygieneSecDesc: 'صحتكِ واطمئنانكِ أولويتنا الأولى. نلتزم بأشد البروتوكولات الصحية المتبعة في أرقى المنتجعات العالمية.',
    hygiene1Title: 'أجهزة التعقيم الطبي المتطورة',
    hygiene1Desc: 'تعقيم حراري وموجات فوق بنفسجية (UV) لجميع الأدوات المستخدمة قبل وبعد كل جلسة.',
    hygiene2Title: 'مستلزمات أحادية الاستخدام مغلفة',
    hygiene2Desc: 'مفارش السرير، أرواب الاستحمام، والليفة المغربية تُفتح بحضوركِ وتُستخدم لمرة واحدة فقط.',
    hygiene3Title: 'زيوت طبيعية وعضوية معتمدة',
    hygiene3Desc: 'مستخلصات نباتية فرنسية ومغربية نقية خالية تماماً من الكيماويات أو البارابين، آمنة على البشرة.',
    hygiene4Title: 'أخصائيات نساء معتمدات ومحترفات',
    hygiene4Desc: 'فريق عمل ذو خبرة موثقة ومدرب على أرقى بروتوكولات الخصوصية والاحترافية الفندقية.',

    // Reviews
    reviewsBadge: 'تجارب حقيقية موثقة',
    reviewsTitle: 'آراء ورضا عميلاتنا في المملكة',
    reviewsDesc: 'فخورون بثقة أكثر من 12,000 عميلة سعيدة وتقييم 5 نجوم كامل في الرياض والمنطقة الشرقية.',
    allReviewsBtn: 'قراءة جميع آراء العميلات (581 تقييم)',
    addReviewBtn: 'شاركينا تجربتكِ',

    // Gift Cards
    giftBadge: 'كروت الإهداء الفاخرة',
    giftTitle: 'أهدي من تحبين لحظات استرخاء ودلال لا تُنسى 🌸',
    giftDesc: 'فاجئي والدتكِ، أختكِ، أو صديقتكِ المقربة بكارت إهداء ملكي مخصص باسمها ورسالتكِ الخاصة، ونحن نتكفل بتقديم الجلسة.',
    giftBtn: 'صممي كارت الإهداء الآن',

    // FAQ Teaser
    faqBadge: 'كل ما يهمكِ معرفته',
    faqTitle: 'الأسئلة الشائعة - Let\'s Relax',
    faqDesc: 'إجابات واضحة لأكثر الاستفسارات تكراراً حول خدماتنا المنزلية ومواعيد الحجز.',
    allFaqBtn: 'عرض جميع الأسئلة',
    chatWhatsapp: 'محادثة واتساب',

    // Footer
    footerBio: 'ليتس ريلاكس ✨ بوابتكِ لرفاهية منزلية متكاملة. نقدم لكِ جلسات المساج، الحمام المغربي الفاخر، والعناية والتجميل بأعلى معايير الخصوصية الفندقية وأيدي أخصائيات معتمدات.',
    importantLinks: 'روابط هامة',
    contactUs: 'تواصل معنا',
    paymentMethods: 'وسائل الدفع المتاحة',
    businessCenter: 'موثق في منصة الأعمال',
    businessCenterSub: 'المركز السعودي للأعمال - ترخيص معتمد',
    rights: 'جميع الحقوق محفوظة ليتس ريلاكس 2026.',
    footerLove: 'صُمم بأعلى معايير الرفاهية والجمال لراحة المرأة السعودية',
    
    // Booking Wizard
    bookingModalTitle: 'حجز موعد سبا منزلي فاخر',
    bookingModalSub: 'Let\'s Relax - خصوصية تامة ورفاهية فندقية في منزلكِ',
    stepServices: 'الخدمات',
    stepDate: 'الموعد',
    stepLocation: 'العنوان',
    stepPayment: 'الدفع',
    stepSuccess: 'تأكيد الحجز',
    clientName: 'اسمكِ الكريم:',
    clientPhone: 'رقم الجوال (واتساب):',
    district: 'الحي:',
    address: 'العنوان أو تفاصيل الوصول:',
    specialistNote: 'ملاحظات خاصة للأخصائية (اختياري):',
    next: 'التالي',
    prev: 'السابق',
    confirmBooking: 'تأكيد الحجز النهائي',
    confirmViaWhatsapp: 'تأكيد الموعد عبر الواتساب فوراً',
    successTitle: 'تم تسجيل طلب حجزكِ بنجاح! 🌸',
    successDesc: 'شكراً لاختياركِ Let\'s Relax. اضغطي الزر أدناه لتأكيد حجزكِ مباشرة مع منسقة المواعيد عبر الواتساب.',
  },

  en: {
    // Top Bar & Navbar
    promoTag: '15% OFF WITH CODE:',
    topSub: 'Luxury Mobile Home Spa for Women with Ultimate Privacy & Hygiene',
    currency: 'SAR',
    city: 'City',
    selectCity: 'Select your city',
    riyadh: 'Riyadh',
    khobar: 'Khobar',
    dammam: 'Dammam',
    jeddah: 'Jeddah (Coming Soon)',
    whatsappHelp: 'WhatsApp Support',
    bookNow: 'Book Now',
    brandTag: 'Spa',
    brandSub: 'Luxury Home Spa for Women',
    navHome: 'Home',
    navServices: 'Services & Packages',
    navMoroccan: 'Moroccan Bath',
    navGallery: 'Gallery',
    navReviews: 'Reviews',
    navGiftCards: 'Gift Cards',
    navFaq: 'FAQ',
    navAbout: 'About Us',
    navTerms: 'Terms & Policies',
    cart: 'Booking Bag',
    cartEmpty: 'Your booking bag is empty',
    cartItemsCount: 'Services added',
    exploreServices: 'Explore Services & Packages',
    subtotal: 'Subtotal:',
    discount: 'Discount Applied:',
    total: 'Final Total:',
    proceedBooking: 'Proceed to Booking',
    tabbySplit: 'Split into 4 payments:',
    tabbyPerMonth: 'SAR / month',
    noInterest: 'Zero interest via Tabby or Tamara',
    enterCoupon: 'Enter promo code (e.g. RELAX15)',
    apply: 'Apply',
    remove: 'Remove',
    couponApplied: 'Promo code applied successfully!',

    // Hero
    heroBadge: 'Luxury Mobile Home Spa | Riyadh - Khobar - Dammam',
    heroBadgeSub: 'Certified Female Therapists & 100% Privacy',
    heroTitle1: 'Exceptional Indulgence & Royal Comfort',
    heroTitle2: 'In the Warmth of Your Home 🌸',
    heroDesc: 'We bring the 5-star spa experience directly to you: ergonomic massage table, single-use sealed linens and towels, French organic oils, and soothing aromas that rejuvenate body and soul.',
    ratingBadge: '5.0 Rating (581+ Verified Reviews)',
    hygieneBadge: 'Medical Sterilization & Single-Use Tools',
    tabbyBadge: '0% Interest with Tabby & Tamara',
    sessionDate: 'Session Date',
    preferredTime: 'Preferred Time',
    heroCardTitle: 'Live the Royal Spa Experience Without Leaving Your Room',
    heroCardDesc: 'We provide every detail: candles, ambient music, organic oils, and hotel-grade sanitized bedding.',
    heroCardBtn: 'Explore Packages & Offers',

    // Categories
    categoriesBadge: 'Luxury Spa Categories',
    categoriesTitle: 'Choose Your Ideal Treatment Today',
    catAll: 'All Treatments',
    catPackages: 'VIP & Signature Packages',
    catMassage: 'Luxury Massages',
    catMoroccan: 'Royal Moroccan Bath',
    catBeauty: 'Skincare & Beauty',
    catMaternity: 'Prenatal & Postnatal Care',

    // Packages
    packagesBadge: 'VIP & Exclusive Rituals',
    packagesTitle: 'Comprehensive Indulgence Packages',
    packagesDesc: 'Specially curated to deliver an all-inclusive spa experience combining massage, essential oils, and 5-star hotel luxury.',
    packagesNotice: 'All packages include sanitized massage bed and hotel linens',
    viewDetails: 'View Details',
    addToCart: 'Add to Bag',
    quickBook: 'Book Now',

    // Services
    servicesBadge: 'Specialized Massages & Body Care',
    servicesTitle: 'Individual Spa Treatments',
    servicesDesc: 'Choose the treatment that matches your body’s needs today, and our certified therapist will arrive fully equipped.',

    // Moroccan Bath
    moroccanBadge: 'Royal Cleansing Rituals in Your Home',
    moroccanTitle1: 'Royal Moroccan Bath',
    moroccanTitle2: 'Authentic 100% Natural Ingredients',
    moroccanDesc: 'Experience traditional olive oil black soap, Atlas mountain Ghassoul clay infused with rosewater, and a brand-new sealed Kessal glove for silky, glowing, radiant skin.',
    moroccanFeature1Title: 'Brand-New Sealed Kessal Glove',
    moroccanFeature1Desc: 'Single-use and opened in your presence for guaranteed hygiene',
    moroccanFeature2Title: 'Traditional Beldi Soap & Clay',
    moroccanFeature2Desc: 'Imported and crafted from the purest organic ingredients',
    moroccanFeature3Title: 'Post-Bath Hydration',
    moroccanFeature3Desc: 'Pure Shea butter and authentic Argan oil lotion',
    moroccanFeature4Title: 'Post-Session Space Cleaning',
    moroccanFeature4Desc: 'Therapist leaves your bathroom spotless and beautifully scented',
    moroccanBookBtn: 'Book Royal Moroccan Bath (350 SAR)',
    moroccanStepsBtn: 'View Ritual Steps',

    // How It Works
    howBadge: 'Simple & Seamless Steps',
    howTitle: 'How Does Your Journey with Let\'s Relax Begin?',
    howDesc: 'All you need to do is relax; we take care of every detail from door to door.',
    step1Title: 'Choose Your Treatment & Time',
    step1Desc: 'Select the service you desire, then pick the date and time slot that fits your schedule.',
    step2Title: 'Therapist Arrives Fully Equipped',
    step2Desc: 'Hotel-grade massage bed, sanitized linens, natural oils, candles, and music.',
    step3Title: 'Experience Supreme Comfort & Privacy',
    step3Desc: 'Unwind in the hands of certified female therapists in total privacy within your home.',
    step4Title: 'Pay Securely & Easily',
    step4Desc: 'Pay cash, by card / Apple Pay, or split over 4 easy installments with Tabby or Tamara.',

    // Hygiene
    hygieneSecBadge: 'Top Safety & Sterilization Protocols',
    hygieneSecTitle: 'Hotel-Grade Hygiene & Sterilization Standards',
    hygieneSecDesc: 'Your health and peace of mind are our highest priority. We uphold rigorous protocols followed by world-class luxury spas.',
    hygiene1Title: 'Advanced Medical Sterilization',
    hygiene1Desc: 'Thermal and UV sterilization for all tools before and after each appointment.',
    hygiene2Title: 'Sealed Single-Use Items',
    hygiene2Desc: 'Bed linens, bathrobes, and Moroccan gloves opened in your presence and used once only.',
    hygiene3Title: 'Certified Natural & Organic Oils',
    hygiene3Desc: 'Pure French and Moroccan plant extracts, 100% paraben-free and safe for sensitive skin.',
    hygiene4Title: 'Certified Professional Female Staff',
    hygiene4Desc: 'Highly trained professionals practicing the finest hotel privacy and hospitality etiquette.',

    // Reviews
    reviewsBadge: 'Verified Authentic Experiences',
    reviewsTitle: 'Client Testimonials Across the Kingdom',
    reviewsDesc: 'Proud to have earned the trust of over 12,000 happy clients with a perfect 5.0 rating in Riyadh and the Eastern Province.',
    allReviewsBtn: 'Read All Client Reviews (581 Reviews)',
    addReviewBtn: 'Share Your Review',

    // Gift Cards
    giftBadge: 'Luxury Gift Vouchers',
    giftTitle: 'Gift Unforgettable Moments of Pure Pampering 🌸',
    giftDesc: 'Surprise your mother, sister, or best friend with a customized royal gift card with her name and your message.',
    giftBtn: 'Customize Gift Card Now',

    // FAQ Teaser
    faqBadge: 'Everything You Need to Know',
    faqTitle: 'Frequently Asked Questions',
    faqDesc: 'Clear answers to the most common inquiries regarding our mobile spa and bookings.',
    allFaqBtn: 'View All Questions',
    chatWhatsapp: 'Chat on WhatsApp',

    // Footer
    footerBio: 'Let\'s Relax ✨ Your gateway to comprehensive in-home wellness. We bring you massages, luxury Moroccan baths, and skincare with the highest hotel privacy standards and certified therapists.',
    importantLinks: 'Important Links',
    contactUs: 'Contact Us',
    paymentMethods: 'Accepted Payment Methods',
    businessCenter: 'Verified on Business Center',
    businessCenterSub: 'Saudi Business Center - Authorized License',
    rights: 'All rights reserved © 2026 Let\'s Relax.',
    footerLove: 'Crafted with royal elegance for the relaxation of Saudi women',

    // Booking Wizard
    bookingModalTitle: 'Book Your Luxury Home Spa Appointment',
    bookingModalSub: 'Let\'s Relax - Utmost Privacy and Hotel Comfort at Your Doorstep',
    stepServices: 'Services',
    stepDate: 'Schedule',
    stepLocation: 'Address',
    stepPayment: 'Payment',
    stepSuccess: 'Confirmed',
    clientName: 'Your Full Name:',
    clientPhone: 'Phone Number (WhatsApp):',
    district: 'District / Neighborhood:',
    address: 'Address / Location Details:',
    specialistNote: 'Special Notes for Therapist (Optional):',
    next: 'Next',
    prev: 'Back',
    confirmBooking: 'Confirm Booking',
    confirmViaWhatsapp: 'Confirm via WhatsApp Now',
    successTitle: 'Your Booking Request Has Been Recorded! 🌸',
    successDesc: 'Thank you for choosing Let\'s Relax. Click below to confirm directly with our booking coordinator via WhatsApp.',
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('letsrelax_lang') || 'ar';
    } catch {
      return 'ar';
    }
  });

  const isRTL = lang === 'ar';

  useEffect(() => {
    try {
      localStorage.setItem('letsrelax_lang', lang);
    } catch (e) {
      console.error(e);
    }

    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [lang, isRTL]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['ar']?.[key] || key;
  };

  const value = {
    lang,
    setLang,
    toggleLanguage,
    isRTL,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
