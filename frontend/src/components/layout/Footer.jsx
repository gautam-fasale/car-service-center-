import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Phone, Mail, MapPin, ShieldCheck, Clock, Award } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      {/* Feature Highlights Bar */}
      <div className="border-b border-slate-800 py-8 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">100% Genuine Spares</h4>
              <p className="text-xs text-slate-400">OEM / OES certified parts with warranty</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Live Status Tracking</h4>
              <p className="text-xs text-slate-400">Real-time status updates from garage partners</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Transparent Fair Pricing</h4>
              <p className="text-xs text-slate-400">Upfront quotes & no hidden surprises</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Car className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Car<span className="text-blue-500">Serv</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your trusted one-stop digital auto care and service center booking platform. Connecting vehicle owners with verified workshops and doorstep mechanics.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/service-centers" className="hover:text-white transition">Nearby Service Centers</Link></li>
              <li><Link to="/select-vehicle" className="hover:text-white transition">Book Car Service</Link></li>
              <li><Link to="/select-brand" className="hover:text-white transition">Browse by Brands</Link></li>
              <li><Link to="/my-bookings" className="hover:text-white transition">Track Service Status</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Portals</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/partner/dashboard" className="hover:text-white transition text-indigo-400">Service Center Partner Portal</Link></li>
              <li><Link to="/admin/dashboard" className="hover:text-white transition text-emerald-400">Super Admin Dashboard</Link></li>
              <li><Link to="/partner/register" className="hover:text-white transition">Register Your Workshop</Link></li>
              <li><Link to="/profile" className="hover:text-white transition">Customer Profile & Vehicles</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Contact & Support</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>support@carserv.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>Pune, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 CarServ Online Vehicle Service Center System. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
