import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, ChevronRight, AlertCircle } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export const SelectDateTimeSlotPage = () => {
  const navigate = useNavigate();
  const { bookingDate, setBookingDate, timeSlot, setTimeSlot, selectedCenter } = useBooking();
  const [error, setError] = useState('');

  // Generate next 7 days for the date selector strip
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });
    const isoDate = d.toISOString().split('T')[0];
    dates.push({ dayName, dayNum, monthName, isoDate });
  }

  const [activeDate, setActiveDate] = useState(bookingDate || dates[0].isoDate);
  const [activeSlot, setActiveSlot] = useState(timeSlot || '10:00 AM');

  const availableSlots = [
    { time: '09:00 AM', status: 'available' },
    { time: '10:00 AM', status: 'available' },
    { time: '11:00 AM', status: 'available' },
    { time: '01:00 PM', status: 'available' },
    { time: '02:00 PM', status: 'available' },
    { time: '03:00 PM', status: 'available' },
    { time: '04:00 PM', status: 'available' },
    { time: '05:00 PM', status: 'available' },
    { time: '06:00 PM', status: 'available' }
  ];

  const handleNext = () => {
    if (!activeDate) {
      setError('Please select an appointment date');
      return;
    }
    if (!activeSlot) {
      setError('Please select a time slot');
      return;
    }
    setBookingDate(activeDate);
    setTimeSlot(activeSlot);
    navigate('/booking-summary');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between min-h-[580px]">
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
              <h2 className="text-xl font-black text-slate-900">Select Date & Time Slot</h2>
              <p className="text-xs text-slate-500">Choose your preferred service slot</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Date Selection Strip */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
              Available Dates
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {dates.map((d) => {
                const isSelected = activeDate === d.isoDate;
                return (
                  <button
                    key={d.isoDate}
                    onClick={() => {
                      setError('');
                      setActiveDate(d.isoDate);
                    }}
                    className={`p-3 rounded-2xl flex flex-col items-center justify-center min-w-[62px] transition ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                        : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-[10px] font-semibold uppercase opacity-80">
                      {d.dayName}
                    </span>
                    <span className="text-base font-black my-0.5">{d.dayNum}</span>
                    <span className="text-[10px] font-medium opacity-80">{d.monthName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots Grid */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
              Available Time Slots
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {availableSlots.map((slot) => {
                const isSelected = activeSlot === slot.time;
                return (
                  <button
                    key={slot.time}
                    onClick={() => {
                      setError('');
                      setActiveSlot(slot.time);
                    }}
                    className={`py-3 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-600'
                        : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Clock className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-blue-600'}`} />
                    <span>{slot.time}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Slot Summary & Next Button */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
            <span>Scheduled Slot:</span>
            <span className="font-bold text-slate-800">
              {activeDate} at {activeSlot}
            </span>
          </div>

          <button
            onClick={handleNext}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
