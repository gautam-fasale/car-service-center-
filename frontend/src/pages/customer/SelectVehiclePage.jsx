import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Bike, ChevronRight, ArrowLeft } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export const SelectVehiclePage = () => {
  const navigate = useNavigate();
  const { setVehicleType } = useBooking();

  const handleSelect = (type) => {
    setVehicleType(type);
    navigate('/select-brand');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between min-h-[520px]">
        <div>
          {/* Top Bar */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-black text-slate-900">Select Vehicle Type</h2>
              <p className="text-xs text-slate-500">Choose your vehicle category</p>
            </div>
          </div>

          {/* Vehicle Type Selection Cards */}
          <div className="space-y-4 mt-6">
            {/* Two Wheeler Card */}
            <div
              onClick={() => handleSelect('2W')}
              className="group p-5 rounded-2xl border-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50/50 cursor-pointer transition-all duration-200 flex items-center justify-between shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                  <Bike className="w-9 h-9" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700">
                    Two Wheeler
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Motorcycles, Scooters & EV Bikes</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
            </div>

            {/* Four Wheeler Card */}
            <div
              onClick={() => handleSelect('4W')}
              className="group p-5 rounded-2xl border-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50/50 cursor-pointer transition-all duration-200 flex items-center justify-between shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                  <Car className="w-9 h-9" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700">
                    Four Wheeler
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Hatchbacks, Sedans, SUVs & EVs</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>

        {/* Footer tip */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-center">
          <p className="text-[11px] text-slate-500">
            Select your vehicle type to see compatible service centers and customized maintenance rates.
          </p>
        </div>
      </div>
    </div>
  );
};
