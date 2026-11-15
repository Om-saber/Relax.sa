import React, { useState } from 'react';
import HeroSection from '../components/home/HeroSection';
import CategoryNav from '../components/home/CategoryNav';
import FeaturedPackages from '../components/home/FeaturedPackages';
import ServicesGrid from '../components/home/ServicesGrid';
import MoroccanBathSection from '../components/home/MoroccanBathSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import HygieneStandards from '../components/home/HygieneStandards';
import HomeReviewsSection from '../components/home/HomeReviewsSection';
import GiftCardBanner from '../components/home/GiftCardBanner';
import FaqSection from '../components/FaqSection';
import HomeBanners from '../components/HomeBanners';
import InstagramFeed from '../components/home/InstagramFeed';

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const handleCategorySelect = (catId) => {
    setActiveCategory(catId);
    // Smooth scroll down to services section if clicked
    const element = document.getElementById('services-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      <HeroSection />
      <HomeBanners />
      {/* <CategoryNav activeCategory={activeCategory} onSelectCategory={handleCategorySelect} /> */}
      <FeaturedPackages />
      <div id="services-section">
        <ServicesGrid />
      </div>
      <MoroccanBathSection />
      <HowItWorksSection />
      <HygieneStandards />
      <HomeReviewsSection />
      <GiftCardBanner />
      <FaqSection />
      <InstagramFeed />
    </div>
  );
};

export default HomePage;
