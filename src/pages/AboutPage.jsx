import React from 'react';
import { 
  FiShield, 
  FiHeart, 
  FiAward, 
  FiMapPin 
} from 'react-icons/fi';
import { FaCrown, FaUserNurse } from 'react-icons/fa6';
import { useLanguage } from '../context/LanguageContext';

const AboutPage = () => {
  const { lang, t } = useLanguage();

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#FFF9FA]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-[#CF3A69] tracking-wider uppercase bg-[#FFEAF0] px-3.5 py-1.5 rounded-full border border-rose-200 whitespace-nowrap">
            {lang === 'ar' ? 'قصة ليتس ريلاكس' : "The Story of Let's Relax"}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#2B151F]">
            {lang === 'ar' ? 'من نحن ومعايير رفاهيتنا' : 'About Us & Our Luxury Standards'}
          </h1>
          <p className="text-sm sm:text-base text-[#8E717D] leading-relaxed">
            {lang === 'ar'
              ? 'انطلقت "ليتس ريلاكس Let\'s Relax" برؤية واضحة: تقديم تجربة سبا منزلي ملكية تجمع بين أرقى معايير الفنادق العالمية وأقصى درجات الخصوصية والراحة التي تستحقها المرأة السعودية في بيتها.'
              : 'Let’s Relax was born with a clear vision: to offer a royal mobile spa experience combining 5-star hotel luxury with complete privacy and comfort for women in Saudi Arabia.'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-rose-100 text-center shadow-sm">
            <span className="text-3xl sm:text-4xl font-black text-[#CF3A69] block font-serif">12,000+</span>
            <span className="text-xs text-[#8E717D] font-bold mt-1 block">
              {lang === 'ar' ? 'جلسة سبا منزلية ناجحة' : 'Successful Home Spa Sessions'}
            </span>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-rose-100 text-center shadow-sm">
            <span className="text-3xl sm:text-4xl font-black text-[#D4AF37] block font-serif">5.0 ⭐</span>
            <span className="text-xs text-[#8E717D] font-bold mt-1 block">
              {lang === 'ar' ? 'تقييم 581 عميلة موثقة' : '581 Verified Client Reviews'}
            </span>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-rose-100 text-center shadow-sm">
            <span className="text-3xl sm:text-4xl font-black text-[#CF3A69] block font-serif">100%</span>
            <span className="text-xs text-[#8E717D] font-bold mt-1 block">
              {lang === 'ar' ? 'أخصائيات نساء معتمدات' : 'Certified Female Therapists'}
            </span>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-rose-100 text-center shadow-sm">
            <span className="text-3xl sm:text-4xl font-black text-emerald-600 block font-serif">
              {lang === 'ar' ? '3 مدن' : '3 Cities'}
            </span>
            <span className="text-xs text-[#8E717D] font-bold mt-1 block">
              {lang === 'ar' ? 'الرياض، الخبر، والدمام' : 'Riyadh, Khobar & Dammam'}
            </span>
          </div>
        </div>

        {/* The Story & Values */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-rose-100 shadow-xl space-y-6">
          <h2 className="text-2xl font-black text-[#2B151F] flex items-center gap-2">
            <FaCrown className="text-[#CF3A69]" />
            <span>{lang === 'ar' ? 'رسالتنا وقيمنا الجوهرية' : 'Our Mission & Core Values'}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-[#5A3F4B] leading-relaxed">
            <div className="space-y-2">
              <h3 className="font-bold text-base text-[#2B151F] flex items-center gap-2">
                <FiShield className="text-[#CF3A69]" />
                <span>{lang === 'ar' ? 'الخصوصية النسائية المطلقة' : '100% Female Privacy'}</span>
              </h3>
              <p>
                {lang === 'ar'
                  ? 'ندرك أن منزلكِ هو ملاذكِ الآمن. لذا نحرص على أن تكون جميع أخصائياتنا نساء محترفات ومدربات على أعلى مستويات الاحتشام، اللباقة، واحترام خصوصية العميلات.'
                  : 'Your home is your sanctuary. All our therapists are certified women trained in the highest standards of hospitality, modesty, and client privacy.'}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-base text-[#2B151F] flex items-center gap-2">
                <FiAward className="text-[#D4AF37]" />
                <span>{lang === 'ar' ? 'التعقيم الطبي الدقيق' : 'Medical Sterilization'}</span>
              </h3>
              <p>
                {lang === 'ar'
                  ? 'نستخدم أجهزة التعقيم الحراري وموجات UV المعتمدة، مع فتح مناشف وأدوات أحادية الاستخدام مغلفة بحضوركِ مباشرة لضمان سلامتكِ بنسبة 100%.'
                  : 'We employ medical-grade UV and heat autoclaves, opening single-use sealed towels and tools in your presence for guaranteed peace of mind.'}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-base text-[#2B151F] flex items-center gap-2">
                <FiHeart className="text-rose-500" />
                <span>{lang === 'ar' ? 'مكونات عضوية طبيعية' : 'Pure Organic Ingredients'}</span>
              </h3>
              <p>
                {lang === 'ar'
                  ? 'لا مساومة في جودة ما يلامس بشرتكِ؛ نستخدم زيوت اللافندر والأرجان النقية، الصابون المغربي الأصيل، ومستخلصات الورد الفرنسي الفاخر.'
                  : 'Zero compromise on quality: pure French lavender and Moroccan Argan oils, organic olive Beldi soap, and premium floral extracts.'}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-base text-[#2B151F] flex items-center gap-2">
                <FaUserNurse className="text-emerald-500" />
                <span>{lang === 'ar' ? 'كفاءة وخبرة الأخصائيات' : 'Expertise of Therapists'}</span>
              </h3>
              <p>
                {lang === 'ar'
                  ? 'تخضع كل أخصائية لتدريب دقيق واختبارات دورية في مسارات العضلات، علم التشريح الحركي، وأحدث أساليب المساج الاسترخائي والعلاجي.'
                  : 'Every therapist undergoes rigorous testing in muscle anatomy, pressure points, and advanced relaxation therapies.'}
              </p>
            </div>
          </div>
        </div>

        {/* Coverage Areas */}
        <div className="bg-gradient-to-r from-[#2A121D] to-[#451A2C] rounded-3xl p-8 sm:p-10 text-white space-y-4">
          <div className="flex items-center gap-2 text-rose-300 text-xs font-bold whitespace-nowrap">
            <FiMapPin />
            <span>{lang === 'ar' ? 'نطاق التغطية والوصول' : 'Service Coverage & Accessibility'}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black">
            {lang === 'ar'
              ? 'نصل إليكِ أينما كنتِ في الرياض والمنطقة الشرقية'
              : 'We Reach You Wherever You Are in Riyadh & Eastern Province'}
          </h3>

          <p className="text-xs sm:text-sm text-rose-200/80 leading-relaxed max-w-2xl">
            {lang === 'ar'
              ? 'تغطي خدمات Let\'s Relax جميع أحياء شمال، شرق، غرب، وجنوب الرياض، بالإضافة إلى الخبر والدمام. سياراتنا مجهزة وتصل في الموعد بدقة تامة.'
              : 'Our services cover all neighborhoods across North, East, West, and South Riyadh, as well as Khobar and Dammam with exact punctuality.'}
          </p>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
