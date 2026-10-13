import React from 'react';
import { 
  FiHeart, 
  FiDroplet 
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { 
  FaCrown, 
  FaSpa, 
  FaBaby, 
  FaGem 
} from 'react-icons/fa6';
import { CATEGORIES } from '../../data/servicesData';
import { useLanguage } from '../../context/LanguageContext';

const CategoryNav = ({ activeCategory, onSelectCategory }) => {
  const { lang, t } = useLanguage();

  const getCategoryIcon = (id) => {
    switch (id) {
      case 'packages':
        return <FaCrown className="text-amber-500" />;
      case 'massage':
        return <FaSpa className="text-[#CF3A69]" />;
      case 'moroccan':
        return <FiDroplet className="text-cyan-600" />;
      case 'beauty':
        return <FaGem className="text-[#E65A84]" />;
      case 'maternity':
        return <FaBaby className="text-rose-400" />;
      default:
        return <HiSparkles className="text-[#CF3A69]" />;
    }
  };

  const getCategoryName = (id, fallback) => {
    switch (id) {
      case 'all': return t('catAll');
      case 'packages': return t('catPackages');
      case 'massage': return t('catMassage');
      case 'moroccan': return t('catMoroccan');
      case 'beauty': return t('catBeauty');
      case 'maternity': return t('catMaternity');
      default: return fallback;
    }
  };

  return (
    <section className="py-8 bg-white border-y border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-6">
          <span className="text-xs font-bold text-[#CF3A69] tracking-wider uppercase bg-[#FFEAF0] px-3 py-1 rounded-full border border-rose-200">
            {t('categoriesBadge')}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#2B151F] mt-2">
            {t('categoriesTitle')}
          </h2>
        </div>

        {/* Categories Bar / Grid */}
        <div className="flex items-center justify-start md:justify-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border text-xs font-bold shrink-0 transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#CF3A69] to-[#E65A84] text-white border-transparent shadow-lg shadow-rose-500/20 scale-105'
                    : 'bg-[#FFF9FA] text-[#5A3F4B] border-rose-100 hover:border-rose-300 hover:bg-white'
                }`}
              >
                <span className={`text-base p-1 rounded-lg ${isSelected ? 'bg-white/20' : 'bg-white shadow-sm'}`}>
                  {getCategoryIcon(cat.id)}
                </span>
                <span>{getCategoryName(cat.id, cat.name)}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-rose-100 text-[#CF3A69]'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default CategoryNav;
