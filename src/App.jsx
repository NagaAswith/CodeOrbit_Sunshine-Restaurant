import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Providers & Global Modals
import { RestaurantProvider } from './context/RestaurantContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import FoodDetailModal from './components/customer/FoodDetailModal';
import CartDrawer from './components/customer/CartDrawer';

// Customer Pages
import HomePage from './pages/customer/HomePage';
import MenuPage from './pages/customer/MenuPage';
import CartPage from './pages/customer/CartPage';
import ReservationPage from './pages/customer/ReservationPage';
import BookingConfirmationPage from './pages/customer/BookingConfirmationPage';
import BookingStatusPage from './pages/customer/BookingStatusPage';
import EventsPage from './pages/customer/EventsPage';
import ReviewsPage from './pages/customer/ReviewsPage';
import AboutPage from './pages/customer/AboutPage';
import ContactPage from './pages/customer/ContactPage';

// Admin Pages & Layout
import AdminLayout from './components/admin/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminTokenVerificationPage from './pages/admin/AdminTokenVerificationPage';
import AdminManualBookingPage from './pages/admin/AdminManualBookingPage';
import AdminMenuPage from './pages/admin/AdminMenuPage';
import AdminEventsPage from './pages/admin/AdminEventsPage';
import AdminTimeSlotsPage from './pages/admin/AdminTimeSlotsPage';
import AdminPricingPage from './pages/admin/AdminPricingPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminWebsiteContentPage from './pages/admin/AdminWebsiteContentPage';
import AdminMediaPage from './pages/admin/AdminMediaPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <ToastProvider>
      <AuthProvider>
        <RestaurantProvider>
          <div className="min-h-screen bg-[#120d09] text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
            <ScrollToTop />
            
            {/* Customer Navbar (hidden in admin views) */}
            {!isAdminRoute && <Navbar />}

            {/* Global Modals & Drawers */}
            <FoodDetailModal />
            <CartDrawer />

            {/* Main Application Routes */}
            <div className="flex-1">
              <Routes>
                {/* Customer Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/reservation" element={<ReservationPage />} />
                <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
                <Route path="/booking-status" element={<BookingStatusPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/reviews" element={<ReviewsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* Admin Auth Route */}
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* Admin Protected Routes */}
                <Route 
                  path="/admin" 
                  element={
                    <AdminLayout 
                      title="Restaurant Dashboard" 
                      subtitle="Live performance metrics, capacity utilization, and reservations"
                    />
                  }
                >
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="bookings" element={<AdminBookingsPage />} />
                  <Route path="token" element={<AdminTokenVerificationPage />} />
                  <Route path="manual-booking" element={<AdminManualBookingPage />} />
                  <Route path="menu" element={<AdminMenuPage />} />
                  <Route path="events" element={<AdminEventsPage />} />
                  <Route path="time-slots" element={<AdminTimeSlotsPage />} />
                  <Route path="pricing" element={<AdminPricingPage />} />
                  <Route path="customers" element={<AdminCustomersPage />} />
                  <Route path="reviews" element={<AdminReviewsPage />} />
                  <Route path="website-content" element={<AdminWebsiteContentPage />} />
                  <Route path="media" element={<AdminMediaPage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                </Route>

                {/* Fallback to Home */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </div>

            {/* Customer Footer (hidden in admin views) */}
            {!isAdminRoute && <Footer />}
          </div>
        </RestaurantProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
