import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiZoomIn, FiHeart } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { GALLERY_CATEGORIES, GALLERY_ITEMS } from '../data/galleryData';

const GalleryPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxItem, setLightboxItem] = useState(null);

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#FFF9FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Banner */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFEAF0] text-[#CF3A69] text-xs font-bold border border-rose-200 mb-3">
            <HiSparkles className="text-amber-500" />
            <span>معرض الصور والتجهيزات المنزلية</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#2B151F]">
            معرض الصور - Let's Relax
          </h1>
          <p className="text-sm sm:text-base text-[#8E717D] mt-3">
            شاهدي بأعينكِ التجهيزات الفندقية الفاخرة، أجهزة التعقيم الطبي، ومشاعر عميلاتنا في بيوتهن.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-start md:justify-center gap-2.5 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-[#CF3A69] to-[#E65A84] text-white shadow-md shadow-rose-500/20'
                  : 'bg-white text-[#5A3F4B] hover:bg-rose-50 border border-rose-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: idx * 0.04 }}
              onClick={() => setLightboxItem(item)}
              className="group relative rounded-3xl overflow-hidden border border-rose-100 bg-white shadow-sm hover:shadow-xl hover:border-rose-300 transition-all cursor-pointer aspect-[4/5]"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              {/* Top Tag */}
              <div className="absolute top-3 right-3">
                <span className="bg-white/90 backdrop-blur-md text-[#CF3A69] text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow">
                  {item.tag}
                </span>
              </div>

              {/* Zoom icon on hover */}
              <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-white p-2 rounded-full backdrop-blur-sm">
                <FiZoomIn className="text-sm" />
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-4 right-4 left-4 text-white">
                <h3 className="font-bold text-sm leading-snug">
                  {item.title}
                </h3>
                <p className="text-[11px] text-rose-200/90 mt-1 line-clamp-2">
                  {item.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {lightboxItem && (
            <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setLightboxItem(null)}
                className="fixed inset-0 bg-black/85 backdrop-blur-md"
              />

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-3xl w-full z-10 border border-rose-200"
              >
                <button
                  onClick={() => setLightboxItem(null)}
                  className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                >
                  <FiX className="text-xl" />
                </button>

                <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
                  <img
                    src={lightboxItem.image}
                    alt={lightboxItem.title}
                    className="max-h-[70vh] w-auto object-contain"
                  />
                </div>

                <div className="p-6 bg-white space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#FFEAF0] text-[#CF3A69] text-xs font-bold px-3 py-0.5 rounded-full">
                      {lightboxItem.tag}
                    </span>
                    <h3 className="font-black text-lg text-[#2B151F]">
                      {lightboxItem.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#5A3F4B] leading-relaxed">
                    {lightboxItem.caption}
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default GalleryPage;
