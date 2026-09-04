import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CalendarCheck,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Car,
  Store,
  ChevronRight
} from 'lucide-react';
import { AdminSidebar } from '../../components/layout/AdminSidebar';

export const AdminBookingsPage = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inspectBooking, setInspectBooking] = useState(null);

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

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Header matching Admin Screen 4 Mockup */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Manage All Bookings
            </h1>
            <p className="text-xs text-slate-400">
              Platform-wide booking audit ledger across all centers and customers.
            </p>
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative mb-6">
          <input
            type="text"
            placeholder="Search by booking code, customer, workshop or vehicle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-11 pr-24 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-emerald-500 shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <button
            type="submit"
            className="absolute right-2 top-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition"
          >
            Filter
          </button>
        </form>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 mb-6 overflow-x-auto pb-1">
          {['All', 'Upcoming', 'In Progress', 'Completed', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-4 text-xs font-bold transition border-b-2 whitespace-nowrap ${
                activeTab === tab
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table matching Mockup 4 */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-slate-400">Loading audit log...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/60 border-b border-slate-700 text-slate-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-5">Code</th>
                    <th className="py-3 px-5">Customer</th>
                    <th className="py-3 px-5">Service Center</th>
                    <th className="py-3 px-5">Vehicle</th>
                    <th className="py-3 px-5">Date & Slot</th>
                    <th className="py-3 px-5">Amount</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 font-medium text-slate-300">
                  {bookings.map((b) => (
                    <tr key={b.BookingID} className="hover:bg-slate-700/30">
                      <td className="py-4 px-5 font-mono font-bold text-emerald-400">
                        {b.BookingCode}
                      </td>
                      <td className="py-4 px-5">
                        <span className="font-bold text-white block">{b.CustomerName}</span>
                        <span className="text-[10px] text-slate-400">{b.CustomerMobile}</span>
                      </td>
                      <td className="py-4 px-5 font-semibold text-slate-200">
                        {b.CenterName}
                      </td>
                      <td className="py-4 px-5">
                        <span className="text-white block">{b.VehicleBrand} {b.VehicleModel}</span>
                        <span className="text-[10px] font-mono text-slate-400">{b.VehicleReg}</span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="text-white block">{b.BookingDate}</span>
                        <span className="text-[10px] text-emerald-400">{b.TimeSlot}</span>
                      </td>
                      <td className="py-4 px-5 font-black text-white">
                        ₹{Math.round(b.TotalAmount)}
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            b.Status === 'Completed'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : b.Status === 'In Progress'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : b.Status === 'Cancelled'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : 'bg-blue-950 text-blue-300 border border-blue-800'
                          }`}
                        >
                          {b.Status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => setInspectBooking(b)}
                          className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition"
                          title="Inspect"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Inspect Modal */}
        {inspectBooking && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 text-white">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Booking Record</span>
                  <h3 className="text-base font-black text-emerald-400">{inspectBooking.BookingCode}</h3>
                </div>
                <button onClick={() => setInspectBooking(null)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <div className="p-4 bg-slate-800/60 rounded-2xl space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer:</span>
                  <span className="font-bold text-white">{inspectBooking.CustomerName} ({inspectBooking.CustomerMobile})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Service Center:</span>
                  <span className="font-bold text-white">{inspectBooking.CenterName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vehicle:</span>
                  <span className="font-bold text-white">{inspectBooking.VehicleBrand} {inspectBooking.VehicleModel} ({inspectBooking.VehicleReg})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Schedule:</span>
                  <span className="font-bold text-emerald-400">{inspectBooking.BookingDate} at {inspectBooking.TimeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Billed:</span>
                  <span className="font-black text-white text-sm">₹{Math.round(inspectBooking.TotalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Status:</span>
                  <span className="font-bold text-emerald-400">Paid via {inspectBooking.PaymentMethod || 'UPI'}</span>
                </div>
              </div>

              <button
                onClick={() => setInspectBooking(null)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl"
              >
                Close Record
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
