import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

// Helper to convert "09:00 AM" / "02:00 PM" into hours and minutes
function parseSlotTime(slotStr) {
  const [time, modifier] = slotStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  return { hours, minutes };
}

// Check if slot has already passed
function checkSlotPassed(dateStr, slotStr) {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // Past date -> definitely passed
  if (dateStr < todayStr) return true;

  // Future date -> definitely available
  if (dateStr > todayStr) return false;

  // Selected date is Today -> compare current hour & minute
  const { hours, minutes } = parseSlotTime(slotStr);
  const slotDate = new Date();
  slotDate.setHours(hours, minutes, 0, 0);

  return now.getTime() >= slotDate.getTime();
}

export const SelectDateTimeSlotPage = () => {
  const navigate = useNavigate();
  const { bookingDate, setBookingDate, timeSlot, setTimeSlot, selectedCenter } = useBooking();
  const [error, setError] = useState('');

  // 1. Generate Available Dates (Starting from Today only - No past dates)
  const dates = useMemo(() => {
    const list = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayName = i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      const isoDate = d.toISOString().split('T')[0];
      list.push({ dayName, dayNum, monthName, isoDate, isToday: i === 0 });
    }
    return list;
  }, []);

  const allSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM'
  ];

  // Default date
  const [activeDate, setActiveDate] = useState(() => {
    if (bookingDate && bookingDate >= dates[0].isoDate) {
      return bookingDate;
    }
    return dates[0].isoDate;
  });

  // Calculate available slots for currently active date
  const slotStatusList = useMemo(() => {
    return allSlots.map((time) => {
      const passed = checkSlotPassed(activeDate, time);
      return {
        time,
        passed,
        available: !passed
      };
    });
  }, [activeDate]);

  // Default active slot
  const [activeSlot, setActiveSlot] = useState(() => {
    const firstAvailable = slotStatusList.find((s) => !s.passed);
    return firstAvailable ? firstAvailable.time : '';
  });

  // Whenever active date changes, auto-select first non-passed slot
  useEffect(() => {
    const available = slotStatusList.find((s) => !s.passed);
    if (!slotStatusList.find((s) => s.time === activeSlot && !s.passed)) {
      setActiveSlot(available ? available.time : '');
    }
  }, [activeDate, slotStatusList]);

  const allPassedToday = activeDate === dates[0].isoDate && slotStatusList.every((s) => s.passed);

  const handleDateChange = (isoDate) => {
    setError('');
    setActiveDate(isoDate);
  };

  const handleSlotClick = (slot) => {
    if (slot.passed) {
      setError(`The ${slot.time} slot on ${activeDate} has already passed. Please select an upcoming slot.`);
      return;
    }
    setError('');
    setActiveSlot(slot.time);
  };

  const handleNext = () => {
    if (!activeDate) {
      setError('Please select an appointment date.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (activeDate < todayStr) {
      setError('Cannot book appointments for past dates.');
      return;
    }

    if (!activeSlot) {
      setError('Please select an available time slot.');
      return;
    }

    if (checkSlotPassed(activeDate, activeSlot)) {
      setError(`The selected time slot (${activeSlot}) has already passed for today. Please select a future time slot.`);
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
              <p className="text-xs text-slate-500">
                {selectedCenter?.Name || 'Choose your appointment schedule'}
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Date Selection Strip (No past dates included) */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                1. Select Service Date
              </label>
              <span className="text-[10px] text-slate-400 font-semibold">
                Only Upcoming Dates
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {dates.map((d) => {
                const isSelected = activeDate === d.isoDate;
                return (
                  <button
                    key={d.isoDate}
                    onClick={() => handleDateChange(d.isoDate)}
                    className={`p-3 rounded-2xl flex flex-col items-center justify-center min-w-[62px] transition ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-600'
                        : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span
                      className={`text-[10px] font-bold uppercase ${
                        d.isToday && !isSelected ? 'text-blue-600' : 'opacity-80'
                      }`}
                    >
                      {d.dayName}
                    </span>
                    <span className="text-base font-black my-0.5">{d.dayNum}</span>
                    <span className="text-[10px] font-medium opacity-80">{d.monthName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Time Slots Grid with Real-Time Passed Restriction */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                2. Available Time Slots
              </label>
              <span className="text-[10px] text-slate-400 font-medium">
                {activeDate === dates[0].isoDate ? 'Today’s Live Slots' : 'All Slots Open'}
              </span>
            </div>

            {allPassedToday ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-2">
                <p className="text-xs font-bold text-amber-800">
                  All service slots for today have completed.
                </p>
                <p className="text-[11px] text-amber-700">
                  Please choose tomorrow ({dates[1].dayName}, {dates[1].dayNum} {dates[1].monthName}) to book your appointment.
                </p>
                <button
                  type="button"
                  onClick={() => handleDateChange(dates[1].isoDate)}
                  className="px-4 py-1.5 bg-amber-600 text-white text-xs font-bold rounded-xl shadow-sm"
                >
                  Switch to Tomorrow
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2.5">
                {slotStatusList.map((slot) => {
                  const isSelected = activeSlot === slot.time && !slot.passed;
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={slot.passed}
                      onClick={() => handleSlotClick(slot)}
                      className={`py-3 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 relative ${
                        slot.passed
                          ? 'bg-slate-100 text-slate-400 border border-slate-200/60 cursor-not-allowed opacity-60'
                          : isSelected
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-600'
                          : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <Clock
                          className={`w-3 h-3 ${
                            slot.passed
                              ? 'text-slate-400'
                              : isSelected
                              ? 'text-white'
                              : 'text-blue-600'
                          }`}
                        />
                        <span>{slot.time}</span>
                      </div>

                      {slot.passed && (
                        <span className="text-[9px] font-semibold text-rose-500 uppercase tracking-tighter">
                          Passed
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Selected Slot Summary & Next Button */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
            <span>Selected Appointment:</span>
            <span className="font-bold text-slate-800">
              {activeDate} {activeSlot ? `at ${activeSlot}` : '(Select a slot)'}
            </span>
          </div>

          <button
            onClick={handleNext}
            disabled={!activeSlot || allPassedToday}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed text-xs"
          >
            <span>Confirm Schedule & Continue</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
