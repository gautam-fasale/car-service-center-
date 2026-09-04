import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Wrench, ShieldCheck, Clock, ArrowRight, Check } from 'lucide-react';

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'One Stop Solution',
      subtitle: 'For all your car servicing needs. Book service easily at your convenience.',
      icon: Car,
      color: 'from-blue-600 to-indigo-600',
      tag: 'Comprehensive Care'
    },
    {
      title: 'Certified Garages & Mechanics',
      subtitle: 'Compare branded authorized centers and trusted local workshops near you.',
      icon: Wrench,
      color: 'from-indigo-600 to-purple-600',
      tag: 'Verified Quality'
    },
    {
      title: 'Real-Time Slots & Transparent Rates',
      subtitle: 'Instant slot confirmation, live status tracking, and 100% upfront pricing.',
      icon: Clock,
      color: 'from-blue-500 to-emerald-500',
      tag: 'Zero Hassle'
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/select-vehicle');
    }
  };

  const SlideIcon = slides[currentSlide].icon;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col justify-between min-h-[580px] p-6 sm:p-8">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              CS
            </div>
            <span className="text-sm font-bold text-slate-800">CarServ Onboarding</span>
          </div>
          <button
            onClick={() => navigate('/select-vehicle')}
            className="text-xs font-semibold text-slate-400 hover:text-slate-700"
          >
            Skip
          </button>
        </div>

        {/* Center Illustration / Graphic Card */}
        <div className="my-8 text-center flex flex-col items-center">
          <div
            className={`w-36 h-36 rounded-3xl bg-gradient-to-tr ${slides[currentSlide].color} flex items-center justify-center text-white shadow-xl shadow-blue-500/20 mb-6 transition-all transform hover:scale-105 duration-300`}
          >
            <SlideIcon className="w-20 h-20" />
          </div>

          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            {slides[currentSlide].tag}
          </span>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {slides[currentSlide].title}
          </h2>

          <p className="mt-3 text-sm text-slate-500 max-w-xs leading-relaxed">
            {slides[currentSlide].subtitle}
          </p>
        </div>

        {/* Bottom Navigation Dots & Next Button */}
        <div>
          {/* Pagination Indicators */}
          <div className="flex justify-center items-center gap-2 mb-6">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'w-8 bg-blue-600' : 'w-2 bg-slate-300'
                }`}
              />
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={handleNext}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition"
          >
            <span>{currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
