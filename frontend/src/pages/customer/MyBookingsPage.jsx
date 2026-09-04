import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Calendar,
  Clock,
  Store,
  Car,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ArrowLeft,
  Star,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const MyBookingsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('All'); // All | Upcoming | Completed | Cancelled
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [isAuthenticated, activeTab]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/bookings/my', {
        params: { status: activeTab }
      });
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!cancelModalBooking) return;
    setCancelling(true);
    try {
      const res = await axios.post(`/api/bookings/${cancelModalBooking.BookingID}/cancel`, {
        reason: cancelReason || 'Customer requested cancellation'
      });
      if (res.data.success) {
        setCancelModalBooking(null);
        setCancelReason('');
        fetchBookings();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Upcoming') {
      return (
        <span className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold">
          Upcoming
        </span>
      );
    }
    if (status === 'In Progress') {
      return (
        <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold">
          In Progress
        </span>
      );
    }
    if (status === 'Completed') {
      return (
        <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
          Completed
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold">
        Cancelled
      </span>
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-slate-500 hover:bg-slate-200 rounded-full transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900">My Bookings</h1>
              <p className="text-xs text-slate-500">Track and manage your service appointments</p>
            </div>
          </div>

          <Link
            to="/select-vehicle"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" /> Book New
          </Link>
        </div>

        {/* Filter Tabs matching mockup 14 (Upcoming, Past, Cancelled) */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-6 overflow-x-auto pb-1">
          {['All', 'Upcoming', 'Completed', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-4 text-xs font-bold transition border-b-2 whitespace-nowrap ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab === 'Completed' ? 'Past / Completed' : tab}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-slate-500">Loading your bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Bookings Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You don't have any bookings in this section yet. Book a service in minutes!
            </p>
            <Link
              to="/select-vehicle"
              className="mt-4 inline-block px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md"
            >
              Book Service Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b.BookingID}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:border-slate-300 transition flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400">
                        Booking ID
                      </span>
                      <h4 className="text-sm font-mono font-black text-blue-600">
                        {b.BookingCode}
                      </h4>
                    </div>
                    {getStatusBadge(b.Status)}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <Store className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>{b.CenterName}</span>
                      </div>
                      <p className="text-slate-500 text-[11px] pl-6 line-clamp-1">
                        {b.CenterAddress}
                      </p>
                      <div className="flex items-center gap-2 text-slate-600 pl-6 text-[11px]">
                        <Car className="w-3.5 h-3.5 text-slate-400" />
                        <span>{b.VehicleBrand} {b.VehicleModel} ({b.VehicleReg})</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 sm:border-l sm:border-slate-100 sm:pl-4">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span className="font-semibold">{b.BookingDate}</span>
                        <Clock className="w-3.5 h-3.5 text-blue-600 ml-2" />
                        <span className="font-semibold">{b.TimeSlot}</span>
                      </div>

                      {b.selectedServices && b.selectedServices.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {b.selectedServices.map((s, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium"
                            >
                              {s.name || s.ServiceName}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total Bill</span>
                    <span className="text-base font-black text-slate-900">
                      ₹{Math.round(b.TotalAmount)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {b.Status === 'Upcoming' && (
                      <button
                        onClick={() => setCancelModalBooking(b)}
                        className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition"
                      >
                        Cancel Booking
                      </button>
                    )}
                    {b.Status === 'Completed' && (
                      <Link
                        to={`/service-centers/${b.ServiceCenterID}`}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition flex items-center gap-1"
                      >
                        <Star className="w-3 h-3 fill-blue-600" /> Write Review
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cancellation Confirmation Modal */}
        {cancelModalBooking && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 text-center">Cancel Booking?</h3>
              <p className="text-xs text-slate-500 text-center mt-1">
                Are you sure you want to cancel booking <span className="font-bold text-slate-800">{cancelModalBooking.BookingCode}</span>?
              </p>

              <div className="my-4">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Reason for Cancellation
                </label>
                <textarea
                  rows="2"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Schedule conflict, vehicle sold, etc."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setCancelModalBooking(null)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancelBooking}
                  disabled={cancelling}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition"
                >
                  {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
