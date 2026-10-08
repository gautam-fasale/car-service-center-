import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Calendar,
  Clock,
  Store,
  Printer,
  ChevronRight,
  Home,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export const BookingConfirmationPage = () => {
  const { code } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { resetBooking } = useBooking();

  const booking = location.state?.booking || {
    BookingCode: code || 'CS12345678',
    CenterName: 'Hyundai Service Center',
    BookingDate: '2026-08-25',
    TimeSlot: '03:00 PM',
    TotalAmount: 2198.00,
    PaymentMethod: 'UPI'
  };

  useEffect(() => {
    // Fire festive confetti animation
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti error:', e);
    }
    resetBooking();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between min-h-[580px] text-center">
        <div>
          {/* Green Checkmark Badge Animation */}
          <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-500/30 animate-pop">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Booking Confirmed!
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
            Your booking has been confirmed successfully. A SMS & Email receipt has been dispatched.
          </p>

          {/* Booking Summary Ticket */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
              <span className="text-[11px] font-bold uppercase text-slate-400">Booking ID</span>
              <span className="text-sm font-mono font-black text-blue-600">
                {booking.BookingCode || code || 'CS12345678'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" /> Date & Time
              </span>
              <span className="font-bold text-slate-800">
                {booking.BookingDate || '20 May 2026'}, {booking.TimeSlot || '03:00 PM'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-blue-600" /> Service Center
              </span>
              <span className="font-bold text-slate-800 text-right truncate max-w-[180px]">
                {booking.CenterName || 'Hyundai Service Center'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/80">
              <span className="text-slate-500">Paid Amount</span>
              <span className="font-black text-slate-900 text-sm">
                ₹{Math.round(booking.TotalAmount || 2198)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons matching Mockup */}
        <div className="space-y-2.5 mt-6 pt-4 border-t border-slate-100">
          <Link
            to="/my-bookings"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition text-sm"
          >
            <span>View My Bookings</span>
            <ChevronRight className="w-4 h-4" />
          </Link>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/"
              className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Go to Home</span>
            </Link>

            <button
              onClick={handlePrint}
              className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
