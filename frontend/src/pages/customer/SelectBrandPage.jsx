import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, ChevronRight, Check } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export const SelectBrandPage = () => {
  const navigate = useNavigate();
  const { vehicleType, setSelectedBrand } = useBooking();
  const [searchTerm, setSearchTerm] = useState('');

  const fourWheelerBrands = [
    { name: 'Hyundai', color: 'bg-blue-50 text-blue-700', badge: 'HY' },
    { name: 'Honda', color: 'bg-red-50 text-red-700', badge: 'H' },
    { name: 'Suzuki', color: 'bg-amber-50 text-amber-700', badge: 'S' },
    { name: 'Skoda', color: 'bg-emerald-50 text-emerald-700', badge: 'SK' },
    { name: 'Toyota', color: 'bg-rose-50 text-rose-700', badge: 'T' },
    { name: 'Tata', color: 'bg-indigo-50 text-indigo-700', badge: 'TA' },
    { name: 'Mahindra', color: 'bg-orange-50 text-orange-700', badge: 'M' },
    { name: 'Kia', color: 'bg-purple-50 text-purple-700', badge: 'KIA' },
    { name: 'Volkswagen', color: 'bg-sky-50 text-sky-700', badge: 'VW' },
    { name: 'Others', color: 'bg-slate-100 text-slate-700', badge: '•••' }
  ];

  const twoWheelerBrands = [
    { name: 'Honda', color: 'bg-red-50 text-red-700', badge: 'H' },
    { name: 'Royal Enfield', color: 'bg-amber-50 text-amber-800', badge: 'RE' },
    { name: 'Yamaha', color: 'bg-blue-50 text-blue-700', badge: 'Y' },
    { name: 'Hero', color: 'bg-rose-50 text-rose-700', badge: 'HR' },
    { name: 'Bajaj', color: 'bg-sky-50 text-sky-700', badge: 'B' },
    { name: 'TVS', color: 'bg-emerald-50 text-emerald-700', badge: 'TVS' },
    { name: 'Suzuki', color: 'bg-orange-50 text-orange-700', badge: 'S' },
    { name: 'KTM', color: 'bg-orange-100 text-orange-800', badge: 'KTM' },
    { name: 'Others', color: 'bg-slate-100 text-slate-700', badge: '•••' }
  ];

  const list = vehicleType === '2W' ? twoWheelerBrands : fourWheelerBrands;
  const filtered = list.filter((b) => b.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleBrandSelect = (brandName) => {
    setSelectedBrand(brandName);
    navigate(`/service-centers?brand=${encodeURIComponent(brandName)}`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between min-h-[580px]">
        <div>
          {/* Top Bar */}
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-black text-slate-900">Select Brand</h2>
              <p className="text-xs text-slate-500">Choose your {vehicleType === '2W' ? 'bike' : 'car'} brand</p>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative mb-5">
            <input
              type="text"
              placeholder="Search brand (e.g. Hyundai, Honda)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition text-sm text-slate-800 outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

          {/* Brand Grid / List */}
          <div className="grid grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
            {filtered.map((b) => (
              <button
                key={b.name}
                onClick={() => handleBrandSelect(b.name)}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-blue-600 hover:bg-blue-50/40 text-left transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl ${b.color} flex items-center justify-center font-black text-xs group-hover:scale-105 transition`}
                  >
                    {b.badge}
                  </div>
                  <span className="text-sm font-bold text-slate-800 group-hover:text-blue-700">
                    {b.name}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition" />
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Helper */}
        <div className="mt-4 pt-4 border-t border-slate-100 text-center">
          <button
            onClick={() => handleBrandSelect('All')}
            className="text-xs text-blue-600 font-bold hover:underline"
          >
            Show all service centers without brand filter →
          </button>
        </div>
      </div>
    </div>
  );
};
