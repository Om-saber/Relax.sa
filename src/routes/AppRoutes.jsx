import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import CartDrawer from '../components/common/CartDrawer';
import BookingModal from '../components/common/BookingModal';
import ServiceDetailModal from '../components/common/ServiceDetailModal';
import SearchModal from '../components/common/SearchModal';
import WhatsAppFloating from '../components/common/WhatsAppFloating';
import Toast from '../components/common/Toast';
import ScrollToTop from '../components/common/ScrollToTop';

import HomePage from '../pages/HomePage';
import ServicesPage from '../pages/ServicesPage';
import PackagesPage from '../pages/PackagesPage';
import GalleryPage from '../pages/GalleryPage';
import ReviewsPage from '../pages/ReviewsPage';
import FAQPage from '../pages/FAQPage';
import GiftCardsPage from '../pages/GiftCardsPage';
import AboutPage from '../pages/AboutPage';
import TermsPage from '../pages/TermsPage';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      {/* Scroll to Top on Page Navigation */}
      <ScrollToTop />

      <div className="flex flex-col min-h-screen bg-[#FFF9FA] text-[#2B151F]">
        {/* Global Navigation */}
        <Navbar />

        {/* Main Content View */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/gift-cards" element={<GiftCardsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Global Modals, Drawers & Notifications */}
        <CartDrawer />
        <BookingModal />
        <ServiceDetailModal />
        <SearchModal />
        <WhatsAppFloating />
        <Toast />
      </div>
    </BrowserRouter>
  );
};

export default AppRoutes;
