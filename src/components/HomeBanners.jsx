import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cmsApi } from '../api/cmsApi';

const HomeBanners = () => {
  const [banners, setBanners] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    cmsApi
      .getBanners()
      .then((data) => {
        if (!cancelled) setBanners(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error('[HomeBanners] failed:', err));
    return () => {
      cancelled = true;
    };
  }, []);

  if (banners.length === 0) return null;

  const handleClick = (link) => {
    if (!link) return;
    if (/^https?:\/\//i.test(link)) {
      window.location.assign(link);
    } else {
      navigate(link);
    }
  };

  return (
    <section dir="rtl" className="py-10 md:py-14 bg-[#FFF9FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {banners.map((banner) => (
            <button
              key={banner.key}
              type="button"
              onClick={() => handleClick(banner.link)}
              disabled={!banner.link}
              className="group relative h-48 md:h-56 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow text-right bg-rose-100 bg-cover bg-center"
              style={banner.image ? { backgroundImage: `url("${banner.image}")` } : undefined}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0A12]/80 via-[#1A0A12]/30 to-transparent group-hover:from-[#1A0A12]/90 transition-colors" />
              <div className="absolute bottom-0 right-0 left-0 p-5">
                <h3 className="text-xl md:text-2xl font-black text-white">{banner.title}</h3>
                {banner.subtitle && (
                  <p className="text-sm text-rose-100 mt-1">{banner.subtitle}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeBanners;
