import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CalendarCheck,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Car,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { PartnerSidebar } from '../../components/layout/PartnerSidebar';

export const PartnerBookingsPage = () => {
  const [activeTab, setActiveTab] = useState('All'); // All | Upcoming | In Progress | Completed | Cancelled
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/bookings/center', {
        params: {
          status: activeTab !== 'All' ? activeTab : undefined,
          search: searchQuery || undefined
        }
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

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBookings();
  };

  const handleUpdateStatus = async (bookingId, status) => {
    setStatusUpdating(true);
    try {
      const res = await axios.patch(`/api/bookings/${bookingId}/status`, { status });
      if (res.data.success) {
        setSelectedBooking(null);
        fetchBookings();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-100 flex flex-col md:flex-row">
      <PartnerSidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Header matching Partner Screen 3 Mockup */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Bookings Management
            </h1>
            <p className="text-xs text-slate-500">
              Manage incoming customer vehicles, assign service bays, and mark completion.
            </p>
          </div>
        </div>

        {/* Search Bar matching Mockup */}
        <form onSubmit={handleSearch} className="relative mb-6">
          <input
            type="text"
            placeholder="Search booking by customer name, mobile, registration or booking ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-11 pr-24 rounded-2xl bg-white border border-slate-200 shadow-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition text-xs text-slate-800 outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <button
            type="submit"
            className="absolute right-2 top-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition"
          >
            Search
          </button>
        </form>

        {/* Filter Tabs matching Mockup (All, Upcoming, Completed, Cancelled) */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-6 overflow-x-auto pb-1">
          {['All', 'Upcoming', 'In Progress', 'Completed', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-4 text-xs font-bold transition border-b-2 whitespace-nowrap ${
                activeTab === tab
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Bookings Table matching Partner Screen 3 Mockup */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-slate-500">Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center">
              <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">No Bookings in this Category</h3>
              <p className="text-xs text-slate-400 mt-1">New requests from car owners will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Booking ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Vehicle</th>
                    <th className="py-3 px-4">Services</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {bookings.map((b) => (
                    <tr key={b.BookingID} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                        {b.BookingCode}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{b.CustomerName}</div>
                        <div className="text-[11px] text-slate-400">{b.CustomerMobile}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{b.VehicleBrand} {b.VehicleModel}</div>
                        <div className="text-[10px] font-mono text-slate-400">{b.VehicleReg}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        {b.selectedServices && b.selectedServices.length > 0 ? (
                          <span className="text-[11px] text-slate-600">
                            {b.selectedServices.map((s) => s.name).join(', ')}
                          </span>
                        ) : (
                          <span className="text-slate-400">General Service</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{b.BookingDate}</div>
                        <div className="text-[10px] text-indigo-600 font-semibold">{b.TimeSlot}</div>
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-900">
                        ₹{Math.round(b.TotalAmount)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            b.Status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : b.Status === 'In Progress'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : b.Status === 'Cancelled'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {b.Status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedBooking(b);
                            setNewStatus(b.Status);
                          }}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-xs transition"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal to Update Booking Status & View Details */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Manage Appointment</span>
                  <h3 className="text-base font-black text-slate-900">{selectedBooking.BookingCode}</h3>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-slate-400 hover:text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Customer and Vehicle Details */}
              <div className="p-3.5 bg-slate-50 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer:</span>
                  <span className="font-bold text-slate-800">{selectedBooking.CustomerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span className="font-bold text-slate-800">{selectedBooking.CustomerMobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vehicle:</span>
                  <span className="font-bold text-slate-800">
                    {selectedBooking.VehicleBrand} {selectedBooking.VehicleModel} ({selectedBooking.VehicleReg})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Scheduled:</span>
                  <span className="font-bold text-indigo-600">
                    {selectedBooking.BookingDate} at {selectedBooking.TimeSlot}
                  </span>
                </div>
                {selectedBooking.Notes && (
                  <div className="pt-2 border-t text-[11px] text-slate-600">
                    <span className="font-bold text-slate-800">Customer Notes:</span> {selectedBooking.Notes}
                  </div>
                )}
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Update Service Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Upcoming', 'In Progress', 'Completed', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setNewStatus(st)}
                      className={`p-2.5 rounded-xl text-xs font-bold transition border ${
                        newStatus === st
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-600'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={statusUpdating}
                  onClick={() => handleUpdateStatus(selectedBooking.BookingID, newStatus)}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition disabled:opacity-50"
                >
                  {statusUpdating ? 'Saving...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
