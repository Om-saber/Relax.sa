import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiEye, FiArrowLeft } from 'react-icons/fi';
import { GALLERY_ITEMS } from '../../data/galleryData';

const InstagramFeed = () => {
  const previewItems = GALLERY_ITEMS.slice(0, 6);

  return (
    <section className="py-16 md:py-24 bg-[#FFF9FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 text-center sm:text-start">
          <div>
            <span className="text-xs font-bold text-[#CF3A69] tracking-wider uppercase bg-[#FFEAF0] px-3.5 py-1.5 rounded-full border border-rose-200">
              معرض الصور والأجواء
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#2B151F] mt-2">
              لقطات من تجهيزات جلساتنا في منازل العميلات
            </h2>
          </div>

          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-rose-200 text-[#CF3A69] font-bold text-xs hover:bg-[#FFF0F3] transition-colors shadow-sm"
          >
            <span>زيارة معرض الصور الكامل</span>
            <FiArrowLeft />
          </Link>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {previewItems.map((item) => (
            <div
              key={item.id}
              className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm border border-rose-100 bg-rose-50"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-white">
                <span className="text-[10px] bg-[#E65A84] px-2 py-0.5 rounded-full font-bold w-max mb-1">
                  {item.tag}
                </span>
                <p className="text-xs font-bold line-clamp-2 leading-tight">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default InstagramFeed;
