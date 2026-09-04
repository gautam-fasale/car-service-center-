import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

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
                {/* Public Discovery Routes */}
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

                {/* Customer Authenticated Protected Routes */}
                <Route
                  path="/booking-summary"
                  element={
                    <ProtectedRoute allowedRoles={['Customer']}>
                      <BookingSummaryPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payment"
                  element={
                    <ProtectedRoute allowedRoles={['Customer']}>
                      <PaymentPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/booking-confirmation/:code"
                  element={
                    <ProtectedRoute allowedRoles={['Customer']}>
                      <BookingConfirmationPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-bookings"
                  element={
                    <ProtectedRoute allowedRoles={['Customer']}>
                      <MyBookingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute allowedRoles={['Customer']}>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Partner Auth & Protected Portal Routes */}
                <Route path="/partner/login" element={<PartnerLoginPage />} />
                <Route path="/partner/register" element={<PartnerRegisterPage />} />
                <Route
                  path="/partner/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['ServiceCenter']}>
                      <PartnerDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/partner/bookings"
                  element={
                    <ProtectedRoute allowedRoles={['ServiceCenter']}>
                      <PartnerBookingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/partner/availability"
                  element={
                    <ProtectedRoute allowedRoles={['ServiceCenter']}>
                      <PartnerAvailabilityPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/partner/services"
                  element={
                    <ProtectedRoute allowedRoles={['ServiceCenter']}>
                      <PartnerServicesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/partner/profile"
                  element={
                    <ProtectedRoute allowedRoles={['ServiceCenter']}>
                      <PartnerServicesPage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Auth & Protected Portal Routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/service-centers"
                  element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <AdminServiceCentersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/bookings"
                  element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <AdminBookingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <AdminUsersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/reports"
                  element={
                    <ProtectedRoute allowedRoles={['Admin']}>
                      <AdminReportsPage />
                    </ProtectedRoute>
                  }
                />

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
