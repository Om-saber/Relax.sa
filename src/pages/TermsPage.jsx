import React from 'react';
import { FiShield, FiClock, FiCreditCard, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

const TermsPage = () => {
  const { lang, t } = useLanguage();

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#FFF9FA]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Banner */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#CF3A69] tracking-wider uppercase bg-[#FFEAF0] px-3.5 py-1.5 rounded-full border border-rose-200 whitespace-nowrap">
            {lang === 'ar' ? 'سياسات واضحة لراحتكِ' : 'Clear Policies for Your Peace of Mind'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#2B151F]">
            {t('navTerms')}
          </h1>
          <p className="text-xs sm:text-sm text-[#8E717D]">
            {lang === 'ar'
              ? 'تضمن هذه السياسات تجربة سبا منزلي آمنة وسلسة لكِ ولفريق عمل Let\'s Relax.'
              : 'These guidelines ensure a seamless, secure, and relaxing mobile spa experience for you and our team.'}
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-rose-100 shadow-xl space-y-8 text-xs sm:text-sm text-[#5A3F4B] leading-relaxed">
          
          {/* Policy 1 */}
          <div className="space-y-2">
            <h3 className="font-bold text-base text-[#2B151F] flex items-center gap-2">
              <FiClock className="text-[#CF3A69]" />
              <span>{lang === 'ar' ? 'سياسة تعديل وإلغاء المواعيد' : 'Rescheduling & Cancellation Policy'}</span>
            </h3>
            <p>
              {lang === 'ar'
                ? '- يمكنكِ تعديل أو إلغاء موعدكِ مجاناً بالكامل دون أي رسوم، شريطة إشعارنا قبل الموعد بـ 3 ساعات على الأقل.'
                : '- You can reschedule or cancel your appointment free of charge if requested at least 3 hours prior to your scheduled slot.'}
            </p>
            <p>
              {lang === 'ar'
                ? '- في حال الإلغاء المفاجئ بعد وصول الأخصائية أو قبل الموعد بأقل من ساعة، قد يتم احتساب رسوم انتقال رمزية (50 ر.س).'
                : '- In the event of a last-minute cancellation after the therapist arrives or less than 1 hour before the session, a nominal transit fee of 50 SAR may apply.'}
            </p>
          </div>

          {/* Policy 2 */}
          <div className="space-y-2">
            <h3 className="font-bold text-base text-[#2B151F] flex items-center gap-2">
              <FiShield className="text-[#CF3A69]" />
              <span>{lang === 'ar' ? 'الخصوصية والأمان النسائي' : 'Privacy & Safety Protocol'}</span>
            </h3>
            <p>
              {lang === 'ar'
                ? '- جميع خدماتنا للنساء فقط، ويُمنع تواجد أي رجال في الغرفة أو ركن المساج المخصص للجلسة أثناء تقديم الخدمة.'
                : '- All treatments are exclusively for women. Male presence in the designated spa room is strictly prohibited during the session.'}
            </p>
            <p>
              {lang === 'ar'
                ? '- تلتزم الأخصائية بالسرية التامة، ويُمنع التصوير داخل منزل العميلة إلا بإذن صريح منها وموافقتها المسبقة.'
                : '- Therapists are held to absolute confidentiality. Photography inside client residences is forbidden without express consent.'}
            </p>
          </div>

          {/* Policy 3 */}
          <div className="space-y-2">
            <h3 className="font-bold text-base text-[#2B151F] flex items-center gap-2">
              <FiAlertCircle className="text-[#CF3A69]" />
              <span>{lang === 'ar' ? 'الحالات الصحية الخاصة' : 'Health Conditions & Pregnancy'}</span>
            </h3>
            <p>
              {lang === 'ar'
                ? '- يرجى إبلاغنا مسبقاً في حال وجود حمل (لتخصيص أخصائية حوامل مدربة ووسائد خاصة بعد الشهر الثالث).'
                : '- Please inform us in advance if pregnant so we assign a certified prenatal therapist with supportive body pillows.'}
            </p>
            <p>
              {lang === 'ar'
                ? '- يرجى إشعار الأخصائية بأي كسور حديثة، عمليات جراحية، أمراض جلدية معدية، أو حساسية مفرطة من زيوت معينة.'
                : '- Please notify the therapist of any recent surgeries, severe allergies, or medical conditions before treatment begins.'}
            </p>
          </div>

          {/* Policy 4 */}
          <div className="space-y-2">
            <h3 className="font-bold text-base text-[#2B151F] flex items-center gap-2">
              <FiCreditCard className="text-[#CF3A69]" />
              <span>{lang === 'ar' ? 'الدفع والأقساط' : 'Payment & Installment Options'}</span>
            </h3>
            <p>
              {lang === 'ar'
                ? '- نقبل الدفع نقداً عند انتهاء الجلسة، ببطاقات مدى / فيزا، أبل باي، أو بالتقسيط الميسر عبر تابي وتمارا.'
                : '- We accept Cash on delivery, Mada, Visa, Apple Pay, and 4 interest-free split payments via Tabby and Tamara.'}
            </p>
          </div>

          {/* Policy 5 */}
          <div className="space-y-2">
            <h3 className="font-bold text-base text-[#2B151F] flex items-center gap-2">
              <FiCheckCircle className="text-emerald-500" />
              <span>{lang === 'ar' ? 'ضمان الرضا التام' : '100% Satisfaction Guarantee'}</span>
            </h3>
            <p>
              {lang === 'ar'
                ? 'رضاكِ وسعادتكِ هي أساس عملنا. إذا لم تكن الجلسة على مستوى توقعاتكِ، تواصلي مع الإدارة خلال 24 ساعة وسنقوم بتعويضكِ فوراً.'
                : 'Your happiness is our priority. If any session falls short of expectations, contact our management within 24 hours for prompt resolution.'}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default TermsPage;
