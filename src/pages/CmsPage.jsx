import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { cmsApi } from '../api/cmsApi';

const CmsPage = ({ slug: slugProp }) => {
  const { slug: slugParam } = useParams();
  const slug = slugProp || slugParam;

  // Result is tagged with the slug it belongs to; loading is derived when it doesn't match.
  const [result, setResult] = useState({ slug: null, page: null, error: null });
  const loading = result.slug !== slug;
  const page = loading ? null : result.page;
  const error = loading ? null : result.error;

  useEffect(() => {
    let cancelled = false;

    cmsApi
      .getPage(slug)
      .then((data) => {
        if (!cancelled) setResult({ slug, page: data, error: null });
      })
      .catch((err) => {
        if (cancelled) return;
        setResult({
          slug,
          page: null,
          error: err.status === 404 ? 'الصفحة غير موجودة' : 'تعذّر تحميل الصفحة، حاول مرة أخرى لاحقاً',
        });
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const paragraphs = (page?.content || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div dir="rtl" className="pt-32 pb-24 min-h-screen bg-[#FFF9FA]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading && (
          <div className="space-y-4 animate-pulse" aria-busy="true">
            <div className="h-10 w-1/2 bg-rose-100 rounded-xl" />
            <div className="h-4 w-full bg-rose-50 rounded" />
            <div className="h-4 w-11/12 bg-rose-50 rounded" />
            <div className="h-4 w-4/5 bg-rose-50 rounded" />
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-20">
            <h1 className="text-2xl sm:text-3xl font-black text-[#2B151F]">{error}</h1>
          </div>
        )}

        {!loading && !error && page && (
          <article>
            <h1 className="text-3xl sm:text-4xl font-black text-[#2B151F] mb-8">{page.title}</h1>
            <div className="space-y-5 text-[#5A3A48] leading-loose text-base">
              {paragraphs.map((p, i) => (
                <p key={i} className="whitespace-pre-line">
                  {p}
                </p>
              ))}
            </div>
          </article>
        )}
      </div>
    </div>
  );
};

export default CmsPage;
