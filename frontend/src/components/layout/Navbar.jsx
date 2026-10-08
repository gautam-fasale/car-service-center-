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
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Main Navigation Bar */}
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

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {/* 1. Unauthenticated or Customer Navigation */}
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

            {/* 2. Partner (Service Center) Navigation */}
            {user?.userType === 'ServiceCenter' && (
              <>
                <Link
                  to="/partner/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/partner/dashboard')
                      ? 'text-indigo-600 bg-indigo-50 font-bold'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  Partner Dashboard
                </Link>
                <Link
                  to="/partner/bookings"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/partner/bookings')
                      ? 'text-indigo-600 bg-indigo-50 font-bold'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  Manage Bookings
                </Link>
                <Link
                  to="/partner/availability"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/partner/availability')
                      ? 'text-indigo-600 bg-indigo-50 font-bold'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  Availability & Slots
                </Link>
                <Link
                  to="/partner/services"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/partner/services')
                      ? 'text-indigo-600 bg-indigo-50 font-bold'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  My Services
                </Link>
              </>
            )}

            {/* 3. Super Admin Navigation */}
            {user?.userType === 'Admin' && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/admin/dashboard')
                      ? 'text-emerald-600 bg-emerald-50 font-bold'
                      : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                  }`}
                >
                  Admin Dashboard
                </Link>
                <Link
                  to="/admin/service-centers"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/admin/service-centers')
                      ? 'text-emerald-600 bg-emerald-50 font-bold'
                      : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                  }`}
                >
                  Service Centers
                </Link>
                <Link
                  to="/admin/bookings"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/admin/bookings')
                      ? 'text-emerald-600 bg-emerald-50 font-bold'
                      : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                  }`}
                >
                  All Bookings
                </Link>
                <Link
                  to="/admin/users"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/admin/users')
                      ? 'text-emerald-600 bg-emerald-50 font-bold'
                      : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                  }`}
                >
                  Users
                </Link>
                <Link
                  to="/admin/reports"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/admin/reports')
                      ? 'text-emerald-600 bg-emerald-50 font-bold'
                      : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                  }`}
                >
                  Reports & Analytics
                </Link>
              </>
            )}
          </nav>

          {/* User Profile / Login Options */}
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
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 transition text-xs font-semibold shadow-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    {user.fullName?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline max-w-[120px] truncate">
                    {user.fullName}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 font-bold rounded uppercase ${
                      user.userType === 'Admin'
                        ? 'bg-emerald-100 text-emerald-800'
                        : user.userType === 'ServiceCenter'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {user.userType}
                  </span>
                </Link>

                <button
                  onClick={logout}
                  title="Log out"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Portals Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                    className="px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition flex items-center gap-1.5"
                  >
                    <span>Portals Login</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  </button>

                  {portalDropdownOpen && (
                    <div
                      onClick={() => setPortalDropdownOpen(false)}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-pop text-xs"
                    >
                      <Link
                        to="/login"
                        className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-blue-50 text-slate-800 font-bold"
                      >
                        <User className="w-4 h-4 text-blue-600" />
                        <span>Customer Login</span>
                      </Link>
                      <Link
                        to="/partner/login"
                        className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-indigo-50 text-slate-800 font-bold"
                      >
                        <Store className="w-4 h-4 text-indigo-600" />
                        <span>Partner Workshop Login</span>
                      </Link>
                      <Link
                        to="/admin/login"
                        className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-emerald-50 text-slate-800 font-bold"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Super Admin Login</span>
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 transition"
                >
                  Customer Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-5 space-y-1">
          {(!user || user.userType === 'Customer') && (
            <>
              <Link
                to="/service-centers"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-blue-50"
              >
                Find Local Centers
              </Link>
              <Link
                to="/select-vehicle"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-blue-50"
              >
                Book Service
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/my-bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-blue-50"
                  >
                    My Bookings
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-blue-50"
                  >
                    Profile & Vehicles
                  </Link>
                </>
              )}
            </>
          )}

          {user?.userType === 'ServiceCenter' && (
            <>
              <Link
                to="/partner/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-indigo-700 hover:bg-indigo-50"
              >
                Partner Dashboard
              </Link>
              <Link
                to="/partner/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Manage Bookings
              </Link>
              <Link
                to="/partner/availability"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Availability & Slots
              </Link>
            </>
          )}

          {user?.userType === 'Admin' && (
            <>
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-emerald-700 hover:bg-emerald-50"
              >
                Admin Dashboard
              </Link>
              <Link
                to="/admin/service-centers"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Service Centers
              </Link>
              <Link
                to="/admin/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                All Bookings
              </Link>
            </>
          )}

          {!isAuthenticated && (
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold text-center"
              >
                Customer Login
              </Link>
              <Link
                to="/partner/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold text-center"
              >
                Partner Login
              </Link>
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold text-center"
              >
                Admin Login
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
