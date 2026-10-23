import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { ServicesPage } from './pages/public/ServicesPage';
import { ServiceCategoryPage } from './pages/public/ServiceCategoryPage';
import { ProviderSearchPage } from './pages/public/ProviderSearchPage';
import { ProviderProfilePage } from './pages/public/ProviderProfilePage';
import { AboutPage, HowItWorksPage, ContactPage, TermsPage, PrivacyPage } from './pages/public/StaticPages';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Customer Pages
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { CustomerBookings } from './pages/customer/CustomerBookings';
import { CustomerBookingDetail } from './pages/customer/CustomerBookingDetail';
import { CustomerMessages } from './pages/customer/CustomerMessages';
import { CustomerFavorites } from './pages/customer/CustomerFavorites';
import { CustomerNotifications } from './pages/customer/CustomerNotifications';
import { CustomerProfile } from './pages/customer/CustomerProfile';

// Provider Pages
import { ProviderDashboard } from './pages/provider/ProviderDashboard';
import { ProviderBookings } from './pages/provider/ProviderBookings';
import { ProviderBookingDetail } from './pages/provider/ProviderBookingDetail';
import { ProviderServices } from './pages/provider/ProviderServices';
import { ProviderAvailability } from './pages/provider/ProviderAvailability';
import { ProviderEarnings } from './pages/provider/ProviderEarnings';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProviders } from './pages/admin/AdminProviders';
import { AdminDisputes } from './pages/admin/AdminDisputes';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminUsers } from './pages/admin/AdminUsers';

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-['Inter',sans-serif]">
        <Navbar />

        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:category" element={<ServiceCategoryPage />} />
            <Route path="/providers" element={<ProviderSearchPage />} />
            <Route path="/providers/:id" element={<ProviderProfilePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Customer Routes */}
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/bookings" element={<CustomerBookings />} />
            <Route path="/customer/bookings/:id" element={<CustomerBookingDetail />} />
            <Route path="/customer/messages" element={<CustomerMessages />} />
            <Route path="/customer/favorites" element={<CustomerFavorites />} />
            <Route path="/customer/notifications" element={<CustomerNotifications />} />
            <Route path="/customer/profile" element={<CustomerProfile />} />

            {/* Provider Routes */}
            <Route path="/provider/dashboard" element={<ProviderDashboard />} />
            <Route path="/provider/requests" element={<ProviderDashboard />} />
            <Route path="/provider/bookings" element={<ProviderBookings />} />
            <Route path="/provider/bookings/:id" element={<ProviderBookingDetail />} />
            <Route path="/provider/services" element={<ProviderServices />} />
            <Route path="/provider/availability" element={<ProviderAvailability />} />
            <Route path="/provider/earnings" element={<ProviderEarnings />} />
            <Route path="/provider/messages" element={<CustomerMessages />} />
            <Route path="/provider/notifications" element={<CustomerNotifications />} />
            <Route path="/provider/profile" element={<CustomerProfile />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/providers" element={<AdminProviders />} />
            <Route path="/admin/disputes" element={<AdminDisputes />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/users" element={<AdminUsers />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};
