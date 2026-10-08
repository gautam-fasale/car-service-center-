import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard,
  CalendarCheck,
  Clock,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Users,
  Store,
  ChevronRight,
  Eye,
  Settings,
  Sparkles
} from 'lucide-react';
import { PartnerSidebar } from '../../components/layout/PartnerSidebar';
import { useAuth } from '../../context/AuthContext';

export const PartnerDashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpenStatus, setIsOpenStatus] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/partner/dashboard');
      if (res.data.success) {
        setData(res.data.data);
        setIsOpenStatus(res.data.data.center?.OpenStatus ? true : false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    setStatusUpdating(true);
    try {
      const newStatus = !isOpenStatus;
      const centerId = data?.center?.ServiceCenterID || 1;
      await axios.patch(`/api/service-centers/${centerId}/availability`, {
        openStatus: newStatus
      });
      setIsOpenStatus(newStatus);
    } catch (err) {
      console.error(err);
    } finally {
      setStatusUpdating(false);
    }
  };

  const stats = data?.stats || {
    todaysBookings: 12,
    upcomingBookings: 8,
    completedToday: 6,
    totalEarnings: 8540
  };

  const weeklyData = data?.weeklyOverview || [
    { day: 'Mon', bookings: 12, revenue: 14500 },
    { day: 'Tue', bookings: 18, revenue: 22000 },
    { day: 'Wed', bookings: 15, revenue: 19800 },
    { day: 'Thu', bookings: 22, revenue: 27500 },
    { day: 'Fri', bookings: 28, revenue: 34000 },
    { day: 'Sat', bookings: 32, revenue: 41200 },
    { day: 'Sun', bookings: 10, revenue: 12000 }
  ];

  const maxBookings = Math.max(...weeklyData.map((d) => d.bookings), 35);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-100 flex flex-col md:flex-row">
      <PartnerSidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Top Header matching Partner Screen 2 Mockup */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              <Store className="w-3.5 h-3.5" /> {data?.center?.Name || 'Shree Auto Service'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Partner Dashboard
            </h1>
            <p className="text-xs text-slate-500">
              Welcome back! Here's your garage activity overview for today.
            </p>
          </div>

          {/* Service Center Open / Closed Switch matching Mockup */}
          <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">Workshop Status:</span>
            <button
              onClick={handleToggleStatus}
              disabled={statusUpdating}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm ${
                isOpenStatus
                  ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                  : 'bg-rose-600 text-white shadow-rose-500/20'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOpenStatus ? 'bg-white' : 'bg-white'}`} />
              <span>{isOpenStatus ? 'Open for Bookings' : 'Closed / Busy'}</span>
            </button>
            <Link
              to="/partner/availability"
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-50 transition"
              title="Manage slots & hours"
            >
              <Settings className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards matching Partner Screen 2 Mockup */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Card 1: Today's Bookings */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Today's Bookings
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900">{stats.todaysBookings}</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                +4 today
              </span>
            </div>
          </div>

          {/* Card 2: Upcoming Bookings */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Upcoming Bookings
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900">{stats.upcomingBookings}</span>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Next 7 days
              </span>
            </div>
          </div>

          {/* Card 3: Completed Today */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Completed Today
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-emerald-600">{stats.completedToday}</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                100% on time
              </span>
            </div>
          </div>

          {/* Card 4: Total Earnings */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Total Earnings
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-indigo-600">
                ₹{stats.totalEarnings?.toLocaleString('en-IN') || '8,540'}
              </span>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                This Month
              </span>
            </div>
          </div>
        </div>

        {/* Weekly Bookings Chart & Today's Time Slots */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Visual Bookings Trend Chart */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Bookings Overview</h3>
                <p className="text-xs text-slate-400">Weekly customer appointment volume</p>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                This Week ▾
              </span>
            </div>

            {/* Custom Interactive SVG / Bar Chart */}
            <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
              {weeklyData.map((item, idx) => {
                const heightPercent = Math.round((item.bookings / maxBookings) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="opacity-0 group-hover:opacity-100 transition text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded shadow-sm">
                      {item.bookings} jobs
                    </div>
                    <div className="w-full bg-slate-100 rounded-t-lg h-32 flex items-end overflow-hidden">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-lg group-hover:from-blue-500 group-hover:to-indigo-400 transition-all duration-300"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today's Working Slots Schedule */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-900">Today's Slots</h3>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  {data?.center?.WorkingHours || '09:00 AM - 07:00 PM'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Service bays are operational. Next incoming vehicle in 30 mins.
              </p>

              <div className="space-y-2">
                <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-900">09:00 AM - 11:00 AM</span>
                  <span className="text-blue-700 font-semibold">2 Cars Booked</span>
                </div>
                <div className="p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-900">01:00 PM - 03:00 PM</span>
                  <span className="text-indigo-700 font-semibold">3 Cars Booked</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">04:00 PM - 06:00 PM</span>
                  <span className="text-slate-500 font-semibold">1 Slot Available</span>
                </div>
              </div>
            </div>

            <Link
              to="/partner/availability"
              className="mt-4 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl text-center transition block"
            >
              Manage Working Hours & Slots
            </Link>
          </div>
        </div>

        {/* Recent Bookings Table matching Mockup 2 */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Bookings</h3>
              <p className="text-xs text-slate-400">Latest service requests received</p>
            </div>
            <Link
              to="/partner/bookings"
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                <tr>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Vehicle</th>
                  <th className="pb-3">Date & Time</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {data?.recentBookings?.map((b) => (
                  <tr key={b.BookingID} className="hover:bg-slate-50">
                    <td className="py-3.5">
                      <div className="font-bold text-slate-900">{b.CustomerName}</div>
                      <div className="text-[11px] text-slate-400">{b.CustomerMobile}</div>
                    </td>
                    <td className="py-3.5">
                      <div className="font-bold text-slate-800">{b.VehicleBrand} {b.VehicleModel}</div>
                      <div className="text-[10px] font-mono text-slate-400">{b.VehicleReg}</div>
                    </td>
                    <td className="py-3.5">
                      <div>{b.BookingDate}</div>
                      <div className="text-[10px] text-blue-600 font-semibold">{b.TimeSlot}</div>
                    </td>
                    <td className="py-3.5 font-bold text-slate-900">
                      ₹{Math.round(b.TotalAmount)}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          b.Status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : b.Status === 'In Progress'
                            ? 'bg-amber-50 text-amber-700'
                            : b.Status === 'Cancelled'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {b.Status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        to="/partner/bookings"
                        className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-bold rounded-lg transition"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
