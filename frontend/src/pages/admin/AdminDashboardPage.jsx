import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard,
  Users,
  Store,
  CalendarCheck,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Star,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import { AdminSidebar } from '../../components/layout/AdminSidebar';

export const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/dashboard');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = data?.stats || {
    totalUsers: 1245,
    totalCenters: 245,
    totalBookings: 1754,
    totalRevenue: 245850
  };

  const statusDist = data?.statusDistribution || {
    upcoming: 845,
    completed: 654,
    cancelled: 255
  };

  const totalStatus = statusDist.upcoming + statusDist.completed + statusDist.cancelled || 1754;
  const upcomingPercent = Math.round((statusDist.upcoming / totalStatus) * 100);
  const completedPercent = Math.round((statusDist.completed / totalStatus) * 100);
  const cancelledPercent = Math.round((statusDist.cancelled / totalStatus) * 100);

  const weeklyTrends = data?.weeklyTrends || [
    { day: 'Mon', bookings: 120, revenue: 145000 },
    { day: 'Tue', bookings: 180, revenue: 210000 },
    { day: 'Wed', bookings: 155, revenue: 195000 },
    { day: 'Thu', bookings: 230, revenue: 285000 },
    { day: 'Fri', bookings: 290, revenue: 350000 },
    { day: 'Sat', bookings: 340, revenue: 420000 },
    { day: 'Sun', bookings: 210, revenue: 260000 }
  ];
  const maxTrend = Math.max(...weeklyTrends.map((t) => t.bookings), 350);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Top Header matching Admin Screen 2 Mockup */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Central Control Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-xs text-slate-400">
              System performance metrics and global service center activity.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700 text-xs">
            <span className="px-3 py-1 font-bold text-slate-300">Date Range:</span>
            <span className="px-3 py-1 bg-slate-700 text-emerald-400 font-semibold rounded-lg">
              20 May - 26 May 2026 ▾
            </span>
          </div>
        </div>

        {/* 4 Metric Cards matching Admin Screen 2 Mockup */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* 1. Total Users */}
          <div className="bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Total Users
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-white">{stats.totalUsers.toLocaleString()}</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded flex items-center">
                <ArrowUpRight className="w-3 h-3" /> +12.5%
              </span>
            </div>
          </div>

          {/* 2. Service Centers */}
          <div className="bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Service Centers
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-white">{stats.totalCenters}</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded flex items-center">
                <ArrowUpRight className="w-3 h-3" /> +8.6%
              </span>
            </div>
          </div>

          {/* 3. Total Bookings */}
          <div className="bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Total Bookings
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-white">{stats.totalBookings.toLocaleString()}</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded flex items-center">
                <ArrowUpRight className="w-3 h-3" /> +15.3%
              </span>
            </div>
          </div>

          {/* 4. Total Revenue */}
          <div className="bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Total Revenue
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                ₹{stats.totalRevenue.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded flex items-center">
                <ArrowUpRight className="w-3 h-3" /> +18.7%
              </span>
            </div>
          </div>
        </div>

        {/* Charts Grid matching Admin Screen 2 Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Booking Overview Weekly Trend */}
          <div className="lg:col-span-2 bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Booking Overview</h3>
                <p className="text-xs text-slate-400">Platform-wide daily volume</p>
              </div>
              <span className="text-xs font-semibold text-slate-300 bg-slate-700 px-2.5 py-1 rounded-lg">
                This Week ▾
              </span>
            </div>

            {/* Visual SVG / Bar Trend Graph */}
            <div className="h-52 flex items-end justify-between gap-3 pt-6 px-2">
              {weeklyTrends.map((t, i) => {
                const heightPercent = Math.round((t.bookings / maxTrend) * 100);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="opacity-0 group-hover:opacity-100 transition text-[10px] font-bold text-white bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
                      {t.bookings}
                    </div>
                    <div className="w-full bg-slate-700/60 rounded-t-lg h-36 flex items-end overflow-hidden">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-lg group-hover:brightness-110 transition-all duration-300"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">{t.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Service Centers Leaderboard matching Mockup 2 */}
          <div className="bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-white">Top Service Centers</h3>
                <Link to="/admin/service-centers" className="text-xs text-emerald-400 hover:underline">
                  View All
                </Link>
              </div>
              <p className="text-xs text-slate-400 mb-4">Highest volume & customer rated centers</p>

              <div className="space-y-3">
                {[
                  { name: 'Shree Auto Service', city: 'Pune', bookings: 124, revenue: '₹78,540' },
                  { name: 'Honda Care Center', city: 'Mumbai', bookings: 98, revenue: '₹56,230' },
                  { name: 'QuickFix Wheels', city: 'Nagpur', bookings: 76, revenue: '₹42,180' },
                  { name: 'Auto Pro Service', city: 'Nashik', bookings: 65, revenue: '₹38,900' }
                ].map((c, i) => (
                  <div key={i} className="p-2.5 bg-slate-700/50 border border-slate-700 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 font-bold flex items-center justify-center text-[10px]">
                        {i + 1}
                      </span>
                      <div>
                        <span className="font-bold text-white block">{c.name}</span>
                        <span className="text-[10px] text-slate-400">{c.city}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-400 block">{c.bookings} jobs</span>
                      <span className="text-[10px] text-slate-400">{c.revenue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Split: Recent Bookings Table & Booking Status Donut Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Global Bookings */}
          <div className="lg:col-span-2 bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Recent Global Bookings</h3>
              <Link to="/admin/bookings" className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
                <span>View Full Log</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-700 text-slate-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Center</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50 font-medium text-slate-300">
                  {data?.recentBookings?.map((b) => (
                    <tr key={b.BookingID} className="hover:bg-slate-700/30">
                      <td className="py-3">
                        <span className="font-bold text-white block">{b.CustomerName}</span>
                        <span className="text-[10px] text-slate-400">{b.VehicleBrand} {b.VehicleModel}</span>
                      </td>
                      <td className="py-3">{b.CenterName}</td>
                      <td className="py-3 text-slate-400">{b.BookingDate}</td>
                      <td className="py-3">
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
                      <td className="py-3 text-right font-bold text-white">
                        ₹{Math.round(b.TotalAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Booking Status Distribution Donut Card matching Mockup 2 */}
          <div className="bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white mb-1">Booking Status</h3>
              <p className="text-xs text-slate-400 mb-6">Distribution across lifecycle</p>

              {/* Graphical Donut Visualizer */}
              <div className="relative w-40 h-40 mx-auto my-2 flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  {/* Background Circle */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="3.8"
                  />
                  {/* Upcoming Arc (Blue) */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3.8"
                    strokeDasharray={`${upcomingPercent}, 100`}
                  />
                  {/* Completed Arc (Emerald) */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.8"
                    strokeDasharray={`${completedPercent}, 100`}
                    strokeDashoffset={`-${upcomingPercent}`}
                  />
                  {/* Cancelled Arc (Rose) */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="3.8"
                    strokeDasharray={`${cancelledPercent}, 100`}
                    strokeDashoffset={`-${upcomingPercent + completedPercent}`}
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-slate-400">Total</span>
                  <span className="text-xl font-black text-white">{totalStatus}</span>
                </div>
              </div>

              {/* Legend List */}
              <div className="space-y-2 mt-6 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-slate-300">Upcoming / Active</span>
                  </div>
                  <span className="font-bold text-white">{statusDist.upcoming} ({upcomingPercent}%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-slate-300">Completed</span>
                  </div>
                  <span className="font-bold text-white">{statusDist.completed} ({completedPercent}%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="text-slate-300">Cancelled</span>
                  </div>
                  <span className="font-bold text-white">{statusDist.cancelled} ({cancelledPercent}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
