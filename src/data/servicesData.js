export const CATEGORIES = [
  { id: 'all', name: 'جميع الخدمات', icon: 'Sparkles', count: 24 },
  { id: 'packages', name: 'باقات الدلال و VIP', icon: 'Crown', count: 8 },
  { id: 'massage', name: 'المساج الفاخر', icon: 'Heart', count: 15 },
  { id: 'moroccan', name: 'الحمام المغربي الملكي', icon: 'Droplets', count: 3 },
  { id: 'beauty', name: 'العناية والتجميل', icon: 'Flower2', count: 4 },
  { id: 'maternity', name: 'مساج الحوامل وبعد الولادة', icon: 'Baby', count: 3 },
];

export const SERVICES = [
  // Packages
  {
    id: 'calm-package',
    title: 'باقة الهدوء - Calm Package',
    titleEn: 'Calm Package',
    category: 'packages',
    price: 199,
    originalPrice: 450,
    duration: '90 دقيقة',
    badge: 'الأكثر طلباً',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    description: 'جلسة استرخاء متكاملة تشمل مساج سويدي مهدئ مع لمسات الأروماثيرابي وزيوت طبيعية تبعث على السكينة المطلقة.',
    benefits: [
      'تفريغ الإجهاد العصبي والشحنات السلبية',
      'تنشيط الدورة الدموية وتجديد الطاقة الحيوية',
      'إرخاء العضلات المشدودة بأسلوب ناعم وانسيابي',
      'تهيئة الجسم لنوم عميق ومريح'
    ],
    includes: [
      'سرير مساج فندقي فاخر ومريح',
      'مفارش ومناشف قطنية معقمة ومغلفة استخدام لمرة واحدة',
      'زيوت لافندر وأعشاب فرنسية طبيعية 100%',
      'أجواء شموع معطرة وموسيقى هادئة خاصة بالسبا'
    ],
    rating: 5.0,
    reviewsCount: 312,
    tabbyInstallment: 49.75
  },
  {
    id: 'beauty-package',
    title: 'باقة الجمال - Beauty Package',
    titleEn: 'Beauty Package',
    category: 'packages',
    price: 379,
    originalPrice: 450,
    duration: '120 دقيقة',
    badge: 'باقة مميزة',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    description: 'مزيج فاخر يجمع بين المساج الاسترخائي وعناية الوجه والترطيب العميق لتتألقي ببشرة نضرة وجسد مفعم بالحيوية.',
    benefits: [
      'مساج استرخائي كامل للجسم مع ترطيب عميق',
      'ماسك نضارة للوجه بالكولاجين وماء الورد',
      'عناية خاصة بالأقدام وتخفيف الإرهاق',
      'إشراقة فورية ونعومة حريرية للبشرة'
    ],
    includes: [
      'سرير مساج متنقل بأعلى معايير الراحة',
      'أدوات معقمة طبياً لكل عميلة في عبوات مغلقة',
      'مستحضرات عضوية خالية من البارابين',
      'ضيافة شاي الأعشاب الفاخر بعد الجلسة'
    ],
    rating: 4.98,
    reviewsCount: 184,
    tabbyInstallment: 94.75
  },
  {
    id: 'dalal-package',
    title: 'باقة الدلال - Dalal Package',
    titleEn: 'Dalal Package',
    category: 'packages',
    price: 379,
    originalPrice: 450,
    duration: '120 دقيقة',
    badge: 'الأكثر مبيعاً',
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=800&q=80',
    description: 'تجربة دلال ملكية تشمل مساج عميق مع أحجار البازلت البركانية الدافئة وزيوت المسك والعنبر الفاخرة.',
    benefits: [
      'تفتيت العقد العضلية والتوتر المزمن في الظهر والكتفين',
      'حرارة الأحجار البركانية تخترق العضلات بلطف',
      'تحسين التوازن النفسي والجسدي',
      'إحساس بالخفة والانتعاش يدوم لأيام'
    ],
    includes: [
      'طقم أحجار بازلتية معقمة بدرجة حرارة مدروسة',
      'زيوت دافئة منتقاة بعناية لنعومة فائقة',
      'مناشف استخدام لمرة واحدة مطابقة لأعلى المعايير الصحية',
      'تعطير الغرفة بزيوت عطرية مهدئة'
    ],
    rating: 5.0,
    reviewsCount: 228,
    tabbyInstallment: 94.75
  },
  {
    id: 'harmony-package',
    title: 'باقة انسجام - Harmony Package',
    titleEn: 'Harmony Package',
    category: 'packages',
    price: 379,
    originalPrice: 450,
    duration: '120 دقيقة',
    badge: 'تخفيض محدود',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80',
    description: 'جلسة التوازن والانسجام تجمع بين مساج الأروماثيرابي العطري وتدليك فروة الرأس والرقبة المنعش.',
    benefits: [
      'تخفيف الصداع والإجهاد الذهني',
      'تحفيز بصيلات الشعر وتغذية فروة الرأس بزيوت طبيعية',
      'انسجام تام بين هدوء الفكر واسترخاء العضلات',
      'تنفس أسهل وإحساس بالسلام الداخلي'
    ],
    includes: [
      'أخصائية ذات خبرة عالية معتمدة',
      'زيوت روزماري ولافندر مخصصة لفروة الرأس',
      'مستلزمات أحادية الاستخدام معقمة',
      'أجواء فندقية متكاملة في راحة غرفتك'
    ],
    rating: 4.96,
    reviewsCount: 156,
    tabbyInstallment: 94.75
  },
  {
    id: 'pure-package',
    title: 'باقة النقاء - Pure Package',
    titleEn: 'Pure Package',
    category: 'packages',
    price: 325,
    originalPrice: 420,
    duration: '90 دقيقة',
    badge: 'عرض خاص',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
    description: 'باقة تنقية الجسم وإزالة السموم من خلال المساج اللمفاوي والزيوت الطبيعية المعززة لجهاز المناعة.',
    benefits: [
      'طرد السوائل المحتبسة وتخفيف الانتفاخات',
      'تحسين مظهر البشرة وسلاستها',
      'تنشيط الجهاز اللمفاوي الطبيعي',
      'شعور فوري بالرشاقة والنشاط'
    ],
    includes: [
      'تقنيات تدليك لمفاوي دقيقة وناعمة',
      'زيوت حمضيات وأوكالبتوس منعشة',
      'طقم التعقيم الطبي المعتمد',
      'تعليمات نصائح شرب الماء والعناية المنزلية'
    ],
    rating: 4.94,
    reviewsCount: 97,
    tabbyInstallment: 81.25
  },
  {
    id: 'vip-relax-package',
    title: 'باقة VIP Relax الملكية',
    titleEn: 'Lets Relax VIP Package',
    category: 'packages',
    price: 579,
    originalPrice: 750,
    duration: '150 دقيقة',
    badge: 'VIP فخامة ملكية',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
    description: 'أرقى باقات ليتس ريلاكس المصممة لعشاق الفخامة الاستثنائية: مساج استرخائي كامل + عناية فاخرة بالوجه + ديتوكس الأقدام.',
    benefits: [
      'رحلة استرخاء ملكية لا تترك تفصيلاً دون تدليل',
      'مساج جسم كامل بزيت الأرجان والذهب عيار 24',
      'جلسة ديتوكس وتقشير وترطيب عميق للأقدام واليدين',
      'ماسك نضارة فوري للوجه ونعومة مخملية'
    ],
    includes: [
      'أخصائية أولى (Master Therapist)',
      'سرير مساج ملكي واسع مع وسائد ريش ناعمة',
      'طقم مناشف وروب استحمام مخملي هدية',
      'زيوت مستوردة عضوية خاصة بالـ VIP',
      'صندوق هدايا رمزي من ليتس ريلاكس'
    ],
    rating: 5.0,
    reviewsCount: 420,
    tabbyInstallment: 144.75
  },
  {
    id: 'triple-massage-package',
    title: 'باقة مساج تمايزي (3 جلسات)',
    titleEn: '3 Sessions Exclusive Package',
    category: 'packages',
    price: 1245,
    originalPrice: 1350,
    duration: '3 جلسات × 90 دقيقة',
    badge: 'توفير استثنائي',
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80',
    description: 'اشتراك 3 جلسات مساج تناسب جدولكِ وتتيح لكِ استرخاءً أسبوعياً منتظماً لكِ أو لمشاركتها مع أحبابكِ.',
    benefits: [
      'مرونة كاملة في تحديد مواعيد الجلسات خلال 3 أشهر',
      'إمكانية تغيير نوع المساج في كل جلسة',
      'توفير مالي كبير مقارنة بالحجز المنفرد',
      'أولوية حجز في أوقات الذروة وعطلات نهاية الأسبوع'
    ],
    includes: [
      'سجل متابعة لحالة العضلات ونقاط الشد',
      'أخصائية ثابتة حسب رغبتك في كل جلسة',
      'خدمة الدعم المباشر لتعديل المواعيد بدون رسوم',
      'هدية زيت لافندر عضوي للاستخدام المنزلي'
    ],
    rating: 5.0,
    reviewsCount: 165,
    tabbyInstallment: 311.25
  },
  {
    id: 'bridal-package',
    title: 'باقة العروس الملكية الشاملة',
    titleEn: 'Royal Bridal Full Indulgence',
    category: 'packages',
    price: 699,
    originalPrice: 890,
    duration: '180 دقيقة',
    badge: 'باقة العرائس الملكية',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
    description: 'أرقى تجربة عرائس متكاملة تجمع بين الحمام المغربي بالورد والنيلة الزرقاء + مساج استرخائي كامل + هيدرافيشال نضارة الوجه والترطيب العميق.',
    benefits: [
      'نضارة فائقة وتوحيد لون البشرة قبل المناسبات الكبرى',
      'إزالة كاملة للإجهاد والتوتر وتنشيط الطاقة الإيجابية',
      'ترطيب عميق ونعومة حريرية تدوم لأسابيع',
      'طقس فاخر يجعلكِ ملكة متوجة في راحة منزلكِ'
    ],
    includes: [
      'حمام مغربي ملكي كامل مع ليفة كسال جديدة مغلفة',
      'جلسة مساج استرخائي كامل بالأروماثيرابي وزيت المسك',
      'جلسة تنظيف بشرة هيدرافيشال وماسك كولاجين وماسك ذهب',
      'طقم روب استحمام قطني ومناشف استخدام أحادي فاخرة',
      'سرير مساج مريح وأجواء شموع وموسيقى هادئة'
    ],
    rating: 5.0,
    reviewsCount: 280,
    tabbyInstallment: 174.75
  },

  // Massages
  {
    id: 'massage-swedish',
    title: 'مساج سويدي',
    titleEn: 'Swedish Massage',
    category: 'massage',
    price: 199,
    originalPrice: 249,
    duration: '60 دقيقة',
    badge: 'الأكثر شعبية',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    description: 'المساج الكلاسيكي الأكثر انتشاراً في العالم بحركات انسيابية ناعمة تريح العضلات وتعيد للجسم توازنه.',
    benefits: [
      'تخفيف التوتر والإجهاد اليومي',
      'تنشيط الدورة الدموية وسريان الأكسجين',
      'مرونة وتليين المفاصل والأنسجة'
    ],
    includes: ['سرير مساج مريح', 'زيوت طبيعية', 'مناشف استخدام مرة واحدة'],
    rating: 4.95,
    reviewsCount: 380,
    tabbyInstallment: 49.75
  },
  {
    id: 'massage-deep-tissue',
    title: 'مساج الأنسجة العميقة (مساج عميق)',
    titleEn: 'Deep Tissue Massage',
    category: 'massage',
    price: 249,
    originalPrice: 299,
    duration: '60 دقيقة',
    badge: 'علاجي وفعال',
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=800&q=80',
    description: 'ضغط متوسط إلى قوي يستهدف الطبقات الداخلية من العضلات والأوتار لفك العقد العضلية والتشنجات المزمنة.',
    benefits: [
      'فك تشنجات الرقبة والكتفين وأسفل الظهر',
      'مثالي لمن يجلسن لساعات طويلة على المكاتب',
      'تحسين وضعية القامة ومرونة الحركة'
    ],
    includes: ['زيوت علاجية بالأوكالبتوس', 'أدوات مساج مريحة', 'طاقم معقم'],
    rating: 4.98,
    reviewsCount: 290,
    tabbyInstallment: 62.25
  },
  {
    id: 'massage-lavender',
    title: 'مساج لافندر استرخائي',
    titleEn: 'Lavender Aromatherapy Massage',
    category: 'massage',
    price: 279,
    originalPrice: 329,
    duration: '75 دقيقة',
    badge: 'استرخاء عميق',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80',
    description: 'رحلة عطرية في حقول اللافندر الفرنسية تهدئ الجهاز العصبي وتساعدكِ على التخلص من الأرق والقلق.',
    benefits: [
      'تهدئة دقات القلب وخفض مستويات الكورتيزول',
      'رائحة لافندر مركزة نقية تدوم لساعات',
      'نوم هادئ وعميق بعد الجلسة مباشرة'
    ],
    includes: ['زيت لافندر فرنسي عضوي', 'شمعة لافندر مهدئة', 'تعقيم كامل'],
    rating: 5.0,
    reviewsCount: 215,
    tabbyInstallment: 69.75
  },
  {
    id: 'massage-hot-stones',
    title: 'مساج أحجار ساخنة',
    titleEn: 'Hot Stone Therapy',
    category: 'massage',
    price: 289,
    originalPrice: 349,
    duration: '75 دقيقة',
    badge: 'طاقة دافئة',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
    description: 'أحجار البازلت البركانية الساخنة توضع على مراكز الطاقة في الجسم لتذيب التوتر وتمد العضلات بالدفء العميق.',
    benefits: [
      'تسخين الأنسجة العضلية وتخفيف التيبس',
      'تعزيز تدفق الدم وتصريف السموم',
      'شعور مذهل بالدفء والراحة التامة'
    ],
    includes: ['أحجار بازلتية ملساء معقمة', 'سخان أحجار إلكتروني آمن', 'زيوت دافئة'],
    rating: 4.97,
    reviewsCount: 195,
    tabbyInstallment: 72.25
  },
  {
    id: 'massage-shiatsu',
    title: 'مساج شياتسو ياباني',
    titleEn: 'Japanese Shiatsu Massage',
    category: 'massage',
    price: 299,
    originalPrice: 349,
    duration: '60 دقيقة',
    badge: 'طاقة وتوازن',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
    description: 'تقنية يابانية تقليدية بالضغط بالإبهام وراحة اليد على مسارات الطاقة (الميريديان) لاستعادة النشاط والحيوية.',
    benefits: [
      'موازنة طاقة الجسم الحيوية (تشي)',
      'تخفيف آلام المفاصل والصداع',
      'تحفيز مناعة الجسم الطبيعية'
    ],
    includes: ['أخصائية خبيرة بتقنيات الشياتسو', 'جلسة بدون زيوت أو بزيوت خفيفة'],
    rating: 4.93,
    reviewsCount: 110,
    tabbyInstallment: 74.75
  },
  {
    id: 'massage-aromatherapy-90',
    title: 'مساج أروماثيرابي (90 دقيقة)',
    titleEn: '90-min Aromatherapy Ritual',
    category: 'massage',
    price: 349,
    originalPrice: 399,
    duration: '90 دقيقة',
    badge: 'جلسة ملكية',
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80',
    description: 'مزيج فاخر من الزيوت العطرية النقية (الورد، خشب الصندل، البرغموت) مع تدليك شامل يشمل الرأس والأطراف.',
    benefits: [
      'تحفيز الحواس وتجديد الحالة المزاجية',
      'ترطيب البشرة وتغذيتها بالفيتامينات',
      'استرخاء متواصل لمدة ساعة ونصف دون انقطاع'
    ],
    includes: ['اختيار الزيت المفضل حسب رغبتك', 'مفارش فندقية نقية', 'إضاءة خافتة'],
    rating: 5.0,
    reviewsCount: 165,
    tabbyInstallment: 87.25
  },
  {
    id: 'massage-lymphatic',
    title: 'مساج لمفاوي لتصريف السوائل',
    titleEn: 'Lymphatic Drainage Massage',
    category: 'massage',
    price: 270,
    originalPrice: 310,
    duration: '60 دقيقة',
    badge: 'رشاقة وتصريف',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    description: 'حركات إيقاعية لطيفة ومحسوبة تنشط الغدد اللمفاوية وتساعد على إخراج السوائل الزائدة وتخفيف الثقل.',
    benefits: [
      'تقليل احتباس السوائل وتورم الساقين',
      'تحفيز المناعة الطبيعية وتجديد خلايا البشرة',
      'شعور فوري بالخفة والراحة'
    ],
    includes: ['تقنيات معتمدة دولياً', 'زيوت خفيفة سريعة الامتصاص'],
    rating: 4.96,
    reviewsCount: 140,
    tabbyInstallment: 67.50
  },
  {
    id: 'massage-serenity',
    title: 'مساج سيرينتي الهادئ',
    titleEn: 'Serenity Calming Massage',
    category: 'massage',
    price: 279,
    originalPrice: 320,
    duration: '75 دقيقة',
    badge: 'هدوء نفسي',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    description: 'مصمم خصيصاً للتخلص من الإرهاق العصبي والقلق بلمسات ناعمة مهدئة تدفعكِ للنوم بسلام.',
    benefits: ['تهدئة الجهاز العصبي', 'تجديد صفاء الذهن', 'إرخاء عضلات الوجه والرقبة'],
    includes: ['زيوت بابونج ومسك أبيض', 'مفارش استخدام فردي', 'أجواء عطرية هادئة'],
    rating: 4.95,
    reviewsCount: 88,
    tabbyInstallment: 69.75
  },
  {
    id: 'massage-wood-therapy',
    title: 'مساج خشب الأوك العلاجي',
    titleEn: 'Oak Wood Therapy',
    category: 'massage',
    price: 299,
    originalPrice: 349,
    duration: '60 دقيقة',
    badge: 'نحت وشد',
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=800&q=80',
    description: 'استخدام أدوات خشب الأوك الطبيعية المصقولة لتحفيز الكولاجين ونحت القوام وتكسير الدهون السطحية.',
    benefits: ['تنشيط الدورة الدموية ومقاومة السيلوليت', 'شد الترهلات وتنعيم ملمس الجلد', 'تخفيف الشد العضلي'],
    includes: ['أدوات خشب طبيعي معقمة', 'زيوت شد البشرة بالكافيين الطبيعي'],
    rating: 4.92,
    reviewsCount: 75,
    tabbyInstallment: 74.75
  },

  // Moroccan Bath
  {
    id: 'moroccan-royal',
    title: 'الحمام المغربي الملكي الفاخر',
    titleEn: 'Royal Moroccan Bath',
    category: 'moroccan',
    price: 350,
    originalPrice: 420,
    duration: '90 دقيقة',
    badge: 'نقاء ونضارة',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
    description: 'طقس مغربي أصيل بالصابون البلدي بزيت الزيتون، الطمي المغربي الفاسي، وتقشير بالليفة المغربية الأصلية داخل منزلكِ.',
    benefits: [
      'إزالة خلايا الجلد الميتة تماماً وتوحيد لون البشرة',
      'تفتيح المسام وتنعيم ملمس الجسم كالحرير',
      'تنشيط الدورة الدموية وتجديد خلايا البشرة',
      'رائحة نظافة وانتعاش تدوم لأيام'
    ],
    includes: [
      'ليفة مغربية كسال أصلية جديدة مغلفة لكل عميلة',
      'صابون أسود بلدي مغربي بزيت الزيتون والأعشاب',
      'طمي مغربي (غاسول) معطر بماء الورد الفاسي',
      'تجهيز كامل للمكان وتنظيف بعد انتهاء الجلسة'
    ],
    rating: 5.0,
    reviewsCount: 310,
    tabbyInstallment: 87.50
  },
  {
    id: 'moroccan-rose-lavender',
    title: 'الحمام المغربي بالورد واللافندر',
    titleEn: 'Rose & Lavender Moroccan Bath',
    category: 'moroccan',
    price: 390,
    originalPrice: 480,
    duration: '100 دقيقة',
    badge: 'الأكثر فخامة',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80',
    description: 'ترقية فاخرة للحمام المغربي مع مستخلصات بتلات الورد الطبيعي وزيوت اللافندر المهدئة لترطيب فائق ونضارة خيالية.',
    benefits: [
      'ترطيب مضاعف وحماية البشرة من الجفاف',
      'تفتيح الأماكن الداكنة وتوحيد لون الجسم',
      'رائحة الورد واللافندر تعطر الجسم بالكامل'
    ],
    includes: [
      'ماسك الورد والزبادي الطبيعي للجسم',
      'ليفة مغربية خاصة جديدة',
      'مرطب زبدة الشيا وزيت الأرجان بعد الحمام'
    ],
    rating: 4.99,
    reviewsCount: 185,
    tabbyInstallment: 97.50
  },
  {
    id: 'moroccan-cleopatra',
    title: 'حمام كليوباترا الملكي لتبييض ونضارة الجسم',
    titleEn: 'Cleopatra Royal Whitening Bath',
    category: 'moroccan',
    price: 450,
    originalPrice: 550,
    duration: '120 دقيقة',
    badge: 'باقة العرائس',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
    description: 'الطقس الأكثر فخامة للعرائس والمناسبات الخاصة: حمام مغربي شامل + مقشر الحليب والعسل + ماسك النيلة الزرقاء المغربية الأصيلة.',
    benefits: [
      'تفتيح وتبييض فوري مع النيلة الزرقاء الفاسية',
      'نعومة حريرية لا تضاهى بمستخلصات الحليب والعسل',
      'تألق وإشراقة تدوم لأسابيع'
    ],
    includes: [
      'نيلة زرقاء مغربية أصلية 100%',
      'طقم ليفة ومناشف فاخرة جديدة',
      'لوشن مرطب برائحة المسك الملكي'
    ],
    rating: 5.0,
    reviewsCount: 142,
    tabbyInstallment: 112.50
  },

  // Skincare & Beauty
  {
    id: 'beauty-hydrafacial',
    title: 'هيدرافيشال منزلي - نضارة ملكية',
    titleEn: 'Home Hydrafacial Glow',
    category: 'beauty',
    price: 299,
    originalPrice: 399,
    duration: '60 دقيقة',
    badge: 'نضارة فورية',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    description: 'تنظيف عميق للبشرة وتقشير مائي يزيل الرؤوس السوداء والشوائب مع ضخ السيرومات المغذية بحمض الهيالورونيك.',
    benefits: [
      'بشرة زجاجية خالية من الشوائب والدهون',
      'تضييق المسام الواسعة وترطيب عميق',
      'نضارة فورية ومظهر مشرق قبل المناسبات'
    ],
    includes: ['جهاز هيدرافيشال منزلي معقم', 'سيرومات فرنسية أصلية', 'ماسك ضوئي LED للنضارة'],
    rating: 4.97,
    reviewsCount: 178,
    tabbyInstallment: 74.75
  },
  {
    id: 'beauty-mani-pedi',
    title: 'باديكير ومناكير سبا علاجي',
    titleEn: 'Luxury Spa Mani-Pedi',
    category: 'beauty',
    price: 180,
    originalPrice: 230,
    duration: '60 دقيقة',
    badge: 'عناية كاملة',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80',
    description: 'جلسة عناية فاخرة باليدين والقدمين مع إزالة الجلد الميت، تقشير بحبيبات السكر، وترطيب مكثف مع ماسك البارافين الدافئ.',
    benefits: [
      'أقدام ناعمة خالية من التشققات وجفاف الكعبين',
      'أظافر مرتبة ولامعة وصحية',
      'تدليك مريح لكفوف اليدين والأقدام'
    ],
    includes: ['أدوات جديدة أحادية الاستخدام في مغلف طبي', 'حوض جاكوزي أقدام متنقل معقم', 'طلاء أظافر فاخر حسب رغبتك'],
    rating: 4.94,
    reviewsCount: 205,
    tabbyInstallment: 45.00
  },
  {
    id: 'beauty-foot-detox',
    title: 'ديتوكس الأقدام العضوي ومساج انعكاسي',
    titleEn: 'Organic Foot Detox & Reflexology',
    category: 'beauty',
    price: 160,
    originalPrice: 210,
    duration: '45 دقيقة',
    badge: 'راحة وخفة',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    description: 'نقع الأقدام في أملاح إبسوم المعالجة مع أعشاب الشاي الأخضر والنعناع، متبوعاً بمساج ريفلكسولوجي لنقاط الضغط في القدمين.',
    benefits: [
      'تخفيف ثقل القدمين وتورمهما',
      'تحفيز جميع أعضاء الجسم عبر مسارات باطن القدم',
      'راحة مذهلة لمن يقفن لفترات طويلة'
    ],
    includes: ['أملاح إبسوم نقية', 'زيوت نعناع وأوكالبتوس', 'أدوات معقمة طبياً'],
    rating: 4.95,
    reviewsCount: 130,
    tabbyInstallment: 40.00
  },

  // Maternity
  {
    id: 'maternity-pregnancy',
    title: 'مساج الحوامل الآمن (ما بعد الشهر الثالث)',
    titleEn: 'Safe Pregnancy Massage',
    category: 'maternity',
    price: 279,
    originalPrice: 310,
    duration: '60 دقيقة',
    badge: 'رعاية خاصة للأم',
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80',
    description: 'جلسة متخصصة بأيدي أخصائيات مدربات على راحة الحامل بوضعيات جانبية مريحة ووسائد داعمة لتخفيف ثقل الحمل وآلام الظهر.',
    benefits: [
      'تخفيف ضغط أسفل الظهر وعرق النسا والكتفين',
      'تقليل انتفاخ القدمين والكاحلين بلطف',
      'تقليل التوتر وتحسين جودة النوم للأم وجنينها'
    ],
    includes: [
      'وسائد داعمة مخصصة للحمل',
      'زيوت لوز حلو عضوية خالية تماماً من الروائح القوية أو المكونات الضارة',
      'أخصائية معتمدة في رعاية الحوامل'
    ],
    rating: 5.0,
    reviewsCount: 210,
    tabbyInstallment: 69.75
  },
  {
    id: 'maternity-postnatal',
    title: 'مساج بعد الولادة والتعافي (Postnatal)',
    titleEn: 'Postnatal Recovery Massage',
    category: 'maternity',
    price: 299,
    originalPrice: 350,
    duration: '75 دقيقة',
    badge: 'تعافي واستعادة التوازن',
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=800&q=80',
    description: 'مساج مدروس يساعد عضلات البطن والرحم والظهر على العودة لوضعها الطبيعي وتخفيف إجهاد الرضاعة والسهر.',
    benefits: [
      'تخفيف شد الرقبة والكتفين الناتج عن وضعيات الرضاعة',
      'تسريع خروج السوائل المتجمعة أثناء الحمل',
      'دعم التوازن الهرموني واستعادة الحيوية والنشاط'
    ],
    includes: ['زيوت سمسم وزيت أرجان طبيعي', 'تقنيات مساج رقيقة وآمنة', 'عناية فائقة بالخصوصية'],
    rating: 4.98,
    reviewsCount: 165,
    tabbyInstallment: 74.75
  }
];

export const CITIES = [
  { id: 'riyadh', name: 'الرياض', active: true, areas: ['شمال الرياض', 'شرق الرياض', 'غرب الرياض', 'جنوب الرياض', 'الدرعية'] },
  { id: 'khobar', name: 'الخبر', active: true, areas: ['العليا', 'الحزام الأخضر', 'الشاطئ', 'اليرموك'] },
  { id: 'dammam', name: 'الدمام', active: true, areas: ['الشاطئ', 'المباركية', 'الفيصلية', 'الزهور'] },
  { id: 'jeddah', name: 'جدة (قريباً)', active: false, areas: ['الروضة', 'الحمراء', 'الشاطئ'] },
];

export const TIME_SLOTS = [
  { id: 'slot-1', time: '10:00 صباحاً - 12:00 ظهراً', period: 'صباحي' },
  { id: 'slot-2', time: '12:30 ظهراً - 02:30 ظهراً', period: 'ظهيرة' },
  { id: 'slot-3', time: '03:00 عصراً - 05:00 مساءً', period: 'عصراً' },
  { id: 'slot-4', time: '05:30 مساءً - 07:30 مساءً', period: 'مسائي' },
  { id: 'slot-5', time: '08:00 مساءً - 10:00 مساءً', period: 'مسائي ذروة' },
  { id: 'slot-6', time: '10:30 مساءً - 12:30 بعد منتصف الليل', period: 'سهرة هادئة' },
];

export const ADDONS = [
  { id: 'addon-1', name: 'ماسك الذهب عيار 24 للوجه', price: 65, duration: '+15 دقيقة' },
  { id: 'addon-2', name: 'مساج أحجار بركانية إضافي للظهر', price: 50, duration: '+15 دقيقة' },
  { id: 'addon-3', name: 'مقشر الورد الفاسي للأقدام', price: 45, duration: '+15 دقيقة' },
  { id: 'addon-4', name: 'زيت مسك ملكي خاص إضافي للجلسة', price: 35, duration: 'ضمن الجلسة' },
];
