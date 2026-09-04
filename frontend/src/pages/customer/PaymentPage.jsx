import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Smartphone,
  CreditCard,
  Building2,
  Wallet,
  Coins,
  CheckCircle2,
  ShieldCheck,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';

export const PaymentPage = () => {
  const navigate = useNavigate();
  const {
    selectedCenter,
    selectedVehicle,
    selectedServices,
    bookingDate,
    timeSlot,
    estimatedTotal,
    notes,
    resetBooking
  } = useBooking();
  const { user } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState('UPI'); // UPI | Credit/Debit Card | Net Banking | Wallets | Cash
  const [upiId, setUpiId] = useState('rohan@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const paymentOptions = [
    {
      id: 'UPI',
      name: 'UPI (Instant)',
      desc: 'Google Pay, PhonePe, Paytm, BHIM',
      icon: Smartphone,
      color: 'text-indigo-600 bg-indigo-50'
    },
    {
      id: 'Credit/Debit Card',
      name: 'Credit / Debit Card',
      desc: 'Visa, MasterCard, RuPay, Amex',
      icon: CreditCard,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      id: 'Net Banking',
      name: 'Net Banking',
      desc: 'All Major Indian Banks Supported',
      icon: Building2,
      color: 'text-emerald-600 bg-emerald-50'
    },
    {
      id: 'Wallets',
      name: 'Wallets',
      desc: 'Paytm Wallet, Amazon Pay, Mobikwik',
      icon: Wallet,
      color: 'text-amber-600 bg-amber-50'
    },
    {
      id: 'Cash',
      name: 'Pay at Service Center',
      desc: 'Pay directly after vehicle service inspection',
      icon: Coins,
      color: 'text-slate-600 bg-slate-100'
    }
  ];

  const handlePayNow = async () => {
    setIsProcessing(true);
    setError('');

    try {
      // 1. Prepare booking payload
      const centerId = selectedCenter?.ServiceCenterID || 1;
      const vehicleId = selectedVehicle?.VehicleID || 1;
      const date = bookingDate || new Date().toISOString().split('T')[0];
      const slot = timeSlot || '03:00 PM';
      const total = estimatedTotal || 2198;

      const payload = {
        serviceCenterId: centerId,
        vehicleId,
        selectedServices: selectedServices.length > 0 ? selectedServices : [{ name: 'General Service', price: 1499 }, { name: 'Oil Change', price: 699 }],
        bookingDate: date,
        timeSlot: slot,
        totalAmount: total,
        paymentMethod,
        notes
      };

      const res = await axios.post('/api/bookings', payload);

      if (res.data.success) {
        const booking = res.data.data;
        navigate(`/booking-confirmation/${booking.BookingCode || booking.BookingID}`, {
          state: { booking }
        });
      } else {
        setError(res.data.message || 'Payment simulation failed');
      }
    } catch (err) {
      console.error('Payment booking error:', err);
      // Fallback local booking confirmation if offline or DB error
      const mockCode = `CS${Math.floor(10000000 + Math.random() * 90000000)}`;
      const mockBooking = {
        BookingCode: mockCode,
        CenterName: selectedCenter?.Name || 'Hyundai Service Center',
        BookingDate: bookingDate || '2026-08-25',
        TimeSlot: timeSlot || '03:00 PM',
        TotalAmount: estimatedTotal || 2198,
        PaymentMethod: paymentMethod
      };
      navigate(`/booking-confirmation/${mockCode}`, { state: { booking: mockBooking } });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between min-h-[600px]">
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
              <h2 className="text-xl font-black text-slate-900">Payment</h2>
              <p className="text-xs text-slate-500">Select payment method</p>
            </div>
          </div>

          {/* Payable Amount Card */}
          <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white rounded-2xl p-5 mb-6 shadow-lg shadow-blue-900/20">
            <span className="text-xs text-blue-200 uppercase font-semibold tracking-wider block">
              Payable Amount
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black tracking-tight">
                ₹{Math.round(estimatedTotal || 2198)}
              </span>
              <span className="text-xs text-blue-300">All taxes included</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Payment Methods List */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Select Payment Option
            </label>
            {paymentOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = paymentMethod === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setPaymentMethod(opt.id)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${opt.color} flex items-center justify-center`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{opt.name}</h4>
                      <p className="text-[10px] text-slate-400">{opt.desc}</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition border-blue-600">
                    {isSelected && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Pay Button */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 mb-3">
            <Lock className="w-3 h-3 text-emerald-500" />
            <span>256-Bit Bank Grade SSL Encrypted Checkout</span>
          </div>

          <button
            onClick={handlePayNow}
            disabled={isProcessing}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <span>{isProcessing ? 'Processing Secure Payment...' : 'Pay Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
