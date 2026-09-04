import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Wrench,
  Car,
  User,
  LogOut,
  Calendar,
  ShieldAlert,
  Store,
  ChevronDown,
  Sparkles,
  Menu,
  X
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoSwitchOpen, setDemoSwitchOpen] = useState(false);

  const handleDemoSwitch = async (role) => {
    try {
      await loginAsDemo(role);
      setDemoSwitchOpen(false);
      if (role === 'Admin') navigate('/admin/dashboard');
      else if (role === 'Partner' || role === 'ServiceCenter') navigate('/partner/dashboard');
      else navigate('/service-centers');
    } catch (e) {
      console.error(e);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Demo Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-900">
              DEMO MODE
            </span>
            <span className="hidden sm:inline text-blue-100">
              Quickly test the 3 portals with 1-click:
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDemoSwitch('Customer')}
              className={`px-2.5 py-0.5 rounded text-xs font-semibold transition ${
                user?.userType === 'Customer'
                  ? 'bg-blue-600 text-white ring-1 ring-white'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              👤 Customer
            </button>
            <button
              onClick={() => handleDemoSwitch('Partner')}
              className={`px-2.5 py-0.5 rounded text-xs font-semibold transition ${
                user?.userType === 'ServiceCenter'
                  ? 'bg-indigo-600 text-white ring-1 ring-white'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              🏢 Partner Hub
            </button>
            <button
              onClick={() => handleDemoSwitch('Admin')}
              className={`px-2.5 py-0.5 rounded text-xs font-semibold transition ${
                user?.userType === 'Admin'
                  ? 'bg-emerald-600 text-white ring-1 ring-white'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              🛡️ Super Admin
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                Car<span className="text-blue-600">Serv</span>
              </span>
              <span className="block text-[10px] font-medium tracking-wider uppercase text-slate-500 -mt-1">
                Your Car, Our Care
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Customer Links */}
            {(!user || user.userType === 'Customer') && (
              <>
                <Link
                  to="/service-centers"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/service-centers')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  Find Centers
                </Link>
                <Link
                  to="/select-vehicle"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/select-vehicle')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  Book Service
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/my-bookings"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      isActive('/my-bookings')
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                    }`}
                  >
                    My Bookings
                  </Link>
                )}
              </>
            )}

            {/* Partner Quick Link */}
            {user?.userType === 'ServiceCenter' && (
              <>
                <Link
                  to="/partner/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/partner/dashboard')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  Partner Dashboard
                </Link>
                <Link
                  to="/partner/bookings"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/partner/bookings')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  Manage Bookings
                </Link>
                <Link
                  to="/partner/availability"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/partner/availability')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  Availability
                </Link>
              </>
            )}

            {/* Admin Quick Link */}
            {user?.userType === 'Admin' && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/admin/dashboard')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  Admin Dashboard
                </Link>
                <Link
                  to="/admin/service-centers"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/admin/service-centers')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  Service Centers
                </Link>
                <Link
                  to="/admin/reports"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/admin/reports')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  Reports & Analytics
                </Link>
              </>
            )}
          </nav>

          {/* User Profile / Auth Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to={
                    user.userType === 'Admin'
                      ? '/admin/dashboard'
                      : user.userType === 'ServiceCenter'
                      ? '/partner/dashboard'
                      : '/profile'
                  }
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 transition text-sm font-medium"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    {user.fullName?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline max-w-[120px] truncate">
                    {user.fullName}
                  </span>
                  <span className="text-[11px] px-1.5 py-0.2 bg-blue-100 text-blue-700 font-semibold rounded">
                    {user.userType}
                  </span>
                </Link>

                <button
                  onClick={logout}
                  title="Log out"
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <Link
            to="/service-centers"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-blue-50"
          >
            Find Service Centers
          </Link>
          <Link
            to="/select-vehicle"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-blue-50"
          >
            Book a Service
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/my-bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-blue-50"
              >
                My Bookings
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-blue-50"
              >
                My Profile & Vehicles
              </Link>
            </>
          )}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/partner/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-sm text-indigo-600 font-semibold p-2 rounded-md hover:bg-indigo-50"
            >
              <Store className="w-4 h-4" /> Partner Portal
            </Link>
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-sm text-emerald-600 font-semibold p-2 rounded-md hover:bg-emerald-50"
            >
              <ShieldAlert className="w-4 h-4" /> Super Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
