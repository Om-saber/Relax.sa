/**
 * serviceAdapter.js — يحوّل شكل الخدمة من API (titleAr, durationMinutes, imageUrl)
 * إلى شكل الـ mock المستخدم في Components (title, duration, image, ...).
 *
 * الفايدة: الكومبوننتس مش محتاجة تتغير.
 */

const CATEGORY_ICON_MAP = {
  packages: 'Crown',
  massage: 'Heart',
  moroccan: 'Droplets',
  beauty: 'Flower2',
  maternity: 'Baby',
};

const DEFAULT_BENEFITS = {
  packages: ['سرير مساج فندقي', 'مناشف معقمة', 'زيوت طبيعية'],
  massage: ['إرخاء العضلات', 'تحسين الدورة الدموية', 'تخفيف التوتر'],
  moroccan: ['تقشير طبيعي', 'نضارة فورية', 'ترطيب عميق'],
  beauty: ['تنظيف عميق', 'نضارة البشرة', 'ترطيب'],
  maternity: ['راحة الحامل', 'تخفيف آلام الظهر', 'استرخاء آمن'],
};

function toNumber(v, fallback = 0) {
  if (v === null || v === undefined) return fallback;
  const n = typeof v === 'number' ? v : parseFloat(String(v));
  return isNaN(n) ? fallback : n;
}

function formatDuration(minutes, lang) {
  if (!minutes) return '—';
  return lang === 'ar' ? `${minutes} دقيقة` : `${minutes} mins`;
}

export function adaptService(apiService, lang = 'ar') {
  if (!apiService) return null;

  const categoryKey = apiService.category?.key || 'massage';
  const price = toNumber(apiService.price);
  const originalPrice = apiService.originalPrice
    ? toNumber(apiService.originalPrice)
    : null;

  return {
    id: apiService.slug || apiService.id,
    slug: apiService.slug,
    apiId: apiService.id,

    title: apiService.titleAr,
    titleEn: apiService.titleEn || apiService.titleAr,
    description: apiService.descriptionAr || '',
    descriptionEn: apiService.descriptionEn || '',

    category: categoryKey,
    categoryIcon: CATEGORY_ICON_MAP[categoryKey] || 'Sparkles',
    categoryNameAr: apiService.category?.nameAr || '',
    categoryNameEn: apiService.category?.nameEn || '',

    price,
    originalPrice,
    tabbyInstallment: +(price / 4).toFixed(2),

    duration: formatDuration(apiService.durationMinutes, lang),
    durationMinutes: apiService.durationMinutes || 0,

    image:
      apiService.imageUrl ||
      `/images/services/${apiService.slug || 'default'}.jpg`,
    badge: apiService.badgeAr || null,
    badgeEn: apiService.badgeEn || null,

    rating: toNumber(apiService.rating, 5),
    reviewsCount: apiService.reviewsCount || 0,
    maxBeneficiaries: apiService.maxBeneficiaries || 1,

    variants: apiService.variants || [],
    addons: apiService.addons || [],

    benefits: DEFAULT_BENEFITS[categoryKey] || DEFAULT_BENEFITS.massage,

    _raw: apiService,
  };
}

export function adaptServices(apiServices, lang = 'ar') {
  if (!Array.isArray(apiServices)) return [];
  return apiServices.map((s) => adaptService(s, lang));
}

export function adaptCategories(apiCategories, lang = 'ar') {
  if (!Array.isArray(apiCategories)) return [];

  const totalServices = apiCategories.reduce(
    (sum, c) => sum + (c._count?.services || 0),
    0,
  );

  return [
    {
      id: 'all',
      name: lang === 'ar' ? 'جميع الخدمات' : 'All Services',
      count: totalServices,
    },
    ...apiCategories
      .filter((c) => c.key !== 'packages')
      .map((c) => ({
        id: c.key,
        name: lang === 'ar' ? c.nameAr : c.nameEn,
        icon: c.icon,
        count: c._count?.services || 0,
      })),
  ];
}
