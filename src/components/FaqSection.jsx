import React, { useEffect, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { cmsApi } from '../api/cmsApi';

const FaqSection = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    cmsApi
      .getFaqs()
      .then((data) => {
        if (cancelled) return;
        const sorted = [...(Array.isArray(data) ? data : [])].sort(
          (a, b) => (a.order ?? 0) - (b.order ?? 0)
        );
        setFaqs(sorted);
      })
      .catch((err) => console.error('[FaqSection] failed:', err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loading && faqs.length === 0) return null;

  return (
    <section dir="rtl" className="py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-[#CF3A69] tracking-wider bg-[#FFEAF0] px-3.5 py-1.5 rounded-full border border-rose-200">
            الأسئلة الشائعة
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#2B151F] mt-3">
            لديكِ سؤال؟ لدينا الإجابة
          </h2>
        </div>

        {loading ? (
          <div className="space-y-3 animate-pulse" aria-busy="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-14 bg-rose-50 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="border border-rose-100 rounded-2xl bg-[#FFF9FA] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-right font-bold text-[#2B151F] hover:bg-rose-50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <FiChevronDown
                      className={`shrink-0 text-[#CF3A69] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-[#5A3A48] leading-loose whitespace-pre-line">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FaqSection;
