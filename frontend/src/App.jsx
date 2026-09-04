import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Customer Pages
import { SplashPage } from './pages/customer/SplashPage';
import { OnboardingPage } from './pages/customer/OnboardingPage';
import { LoginPage } from './pages/customer/LoginPage';
import { RegisterPage } from './pages/customer/RegisterPage';
import { SelectVehiclePage } from './pages/customer/SelectVehiclePage';
import { SelectBrandPage } from './pages/customer/SelectBrandPage';
import { ServiceCenterListPage } from './pages/customer/ServiceCenterListPage';
import { ServiceCenterDetailPage } from './pages/customer/ServiceCenterDetailPage';
import { SelectServicePage } from './pages/customer/SelectServicePage';
import { SelectDateTimeSlotPage } from './pages/customer/SelectDateTimeSlotPage';
import { BookingSummaryPage } from './pages/customer/BookingSummaryPage';
import { PaymentPage } from './pages/customer/PaymentPage';
import { BookingConfirmationPage } from './pages/customer/BookingConfirmationPage';
import { MyBookingsPage } from './pages/customer/MyBookingsPage';
import { ProfilePage } from './pages/customer/ProfilePage';

// Partner Pages
import { PartnerLoginPage } from './pages/partner/PartnerLoginPage';
import { PartnerRegisterPage } from './pages/partner/PartnerRegisterPage';
import { PartnerDashboardPage } from './pages/partner/PartnerDashboardPage';
import { PartnerBookingsPage } from './pages/partner/PartnerBookingsPage';
import { PartnerAvailabilityPage } from './pages/partner/PartnerAvailabilityPage';
import { PartnerServicesPage } from './pages/partner/PartnerServicesPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminServiceCentersPage } from './pages/admin/AdminServiceCentersPage';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';

export function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
            <Navbar />

            <div className="flex-1">
              <Routes>
                {/* Customer Experience Routes */}
                <Route path="/" element={<SplashPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/select-vehicle" element={<SelectVehiclePage />} />
                <Route path="/select-brand" element={<SelectBrandPage />} />
                <Route path="/service-centers" element={<ServiceCenterListPage />} />
                <Route path="/service-centers/:id" element={<ServiceCenterDetailPage />} />
                <Route path="/select-services/:centerId" element={<SelectServicePage />} />
                <Route path="/select-slot" element={<SelectDateTimeSlotPage />} />
                <Route path="/booking-summary" element={<BookingSummaryPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/booking-confirmation/:code" element={<BookingConfirmationPage />} />
                <Route path="/my-bookings" element={<MyBookingsPage />} />
                <Route path="/profile" element={<ProfilePage />} />

                {/* Partner Experience Routes */}
                <Route path="/partner/login" element={<PartnerLoginPage />} />
                <Route path="/partner/register" element={<PartnerRegisterPage />} />
                <Route path="/partner/dashboard" element={<PartnerDashboardPage />} />
                <Route path="/partner/bookings" element={<PartnerBookingsPage />} />
                <Route path="/partner/availability" element={<PartnerAvailabilityPage />} />
                <Route path="/partner/services" element={<PartnerServicesPage />} />
                <Route path="/partner/profile" element={<PartnerServicesPage />} />

                {/* Admin Experience Routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/service-centers" element={<AdminServiceCentersPage />} />
                <Route path="/admin/bookings" element={<AdminBookingsPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/reports" element={<AdminReportsPage />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>

            <Footer />
          </div>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
