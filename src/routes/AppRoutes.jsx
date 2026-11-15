import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import CartDrawer from '../components/common/CartDrawer';
import BookingModal from '../components/common/BookingModal';
import ServiceDetailModal from '../components/common/ServiceDetailModal';
import SearchModal from '../components/common/SearchModal';
import WhatsAppFloating from '../components/common/WhatsAppFloating';
import Toast from '../components/common/Toast';
import ScrollToTop from '../components/common/ScrollToTop';
import ProtectedRoute from '../components/common/ProtectedRoute';

import HomePage from '../pages/HomePage';
import ServicesPage from '../pages/ServicesPage';
import PackagesPage from '../pages/PackagesPage';
import GalleryPage from '../pages/GalleryPage';
import ReviewsPage from '../pages/ReviewsPage';
import FAQPage from '../pages/FAQPage';
import GiftCardsPage from '../pages/GiftCardsPage';
import AboutPage from '../pages/AboutPage';
import TermsPage from '../pages/TermsPage';
import LoginPage from '../pages/LoginPage';
import StaffLoginPage from '../pages/StaffLoginPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import StaffDashboardPage from '../pages/StaffDashboardPage';
import ClientPortalPage from '../pages/ClientPortalPage';
import PaymentSuccessPage from '../pages/PaymentSuccessPage';
import PaymentFailurePage from '../pages/PaymentFailurePage';

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFF9FA] text-[#2B151F]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <BookingModal />
      <ServiceDetailModal />
      <SearchModal />
      <WhatsAppFloating />
      <Toast />
    </div>
  );
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Dedicated Admin Dashboard Route (Accessed by typing /dashboard in the browser) */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute requiredRole="admin" allowPermittedStaff={true}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/*" element={<Navigate to="/dashboard" replace />} />
        
        {/* Staff Portal */}
        {/* P1-14: STAFF always lands on /staff (the old redirect to /dashboard looped for staff without permissions) */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute requiredRole="staff">
              <StaffDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/staff-login" element={<StaffLoginPage />} />

        {/* Public Website Pages & User/Staff Portals */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/gift-cards" element={<GiftCardsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/client-portal"
            element={
              <ProtectedRoute requiredRole="client">
                <ClientPortalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute requiredRole="client">
                <ClientPortalPage />
              </ProtectedRoute>
            }
          />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/failure" element={<PaymentFailurePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
