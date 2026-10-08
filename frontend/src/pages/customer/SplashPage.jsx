import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, ChevronRight, ShieldCheck, Clock, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SplashPage = () => {
  const navigate = useNavigate();
  const { loginAsDemo } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 flex-1 flex flex-col items-center justify-center text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse-subtle">
          <Sparkles className="w-3.5 h-3.5" /> Next-Gen Auto Care Platform
        </div>

        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-2xl shadow-blue-500/30 mb-6 group hover:scale-105 transition transform">
          <Car className="w-14 h-14 text-white" />
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-tight">
          Vehicle Servicing <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">Simplified</span> & Digitalized
        </h1>

        <p className="mt-4 text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
          Book certified vehicle repairs, routine maintenance & doorstep mobile mechanics across nearby authorized service centers and verified garages in seconds.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full max-w-md justify-center">
          <Link
            to="/select-vehicle"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition transform active:scale-95"
          >
            <span>Book Service Now</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
          <Link
            to="/service-centers"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/10 flex items-center justify-center transition"
          >
            Explore Centers
          </Link>
        </div>

        {/* Feature Badges */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl text-left">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" /> 2W & 4W
            </div>
            <p className="text-xs text-slate-400 mt-1">Bikes, Scooters & Cars</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
              <ShieldCheck className="w-4 h-4" /> OEM Genuine
            </div>
            <p className="text-xs text-slate-400 mt-1">Certified Spare Parts</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <Clock className="w-4 h-4" /> Instant Slots
            </div>
            <p className="text-xs text-slate-400 mt-1">Zero Waiting Time</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <MapPin className="w-4 h-4" /> Doorstep Pickup
            </div>
            <p className="text-xs text-slate-400 mt-1">Mobile Service Van</p>
          </div>
        </div>
      </div>

      {/* Screen Flow Preview Strip */}
      <div className="border-t border-white/10 bg-black/40 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">CarServ 3-Step Flow:</span>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-white/10 rounded">1. Select Vehicle & Brand</span>
            <span>→</span>
            <span className="px-2 py-1 bg-white/10 rounded">2. Pick Center & Services</span>
            <span>→</span>
            <span className="px-2 py-1 bg-white/10 rounded">3. Schedule Time & Confirm</span>
          </div>
          <Link to="/onboarding" className="text-blue-400 hover:text-blue-300 font-medium">
            View App Walkthrough →
          </Link>
        </div>
      </div>
    </div>
  );
};
