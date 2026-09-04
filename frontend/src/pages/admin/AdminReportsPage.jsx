import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart3,
  TrendingUp,
  Download,
  Printer,
  Calendar,
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  Filter
} from 'lucide-react';
import { AdminSidebar } from '../../components/layout/AdminSidebar';

export const AdminReportsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/reports');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const revenueByDay = data?.revenueByDay || [
    { label: 'Mon', revenue: 24000, bookings: 20 },
    { label: 'Tue', revenue: 38000, bookings: 32 },
    { label: 'Wed', revenue: 31000, bookings: 26 },
    { label: 'Thu', revenue: 49000, bookings: 41 },
    { label: 'Fri', revenue: 56000, bookings: 48 },
    { label: 'Sat', revenue: 68000, bookings: 58 },
    { label: 'Sun', revenue: 32000, bookings: 28 }
  ];

  const maxRevenue = Math.max(...revenueByDay.map((d) => d.revenue), 70000);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Header matching Admin Screen 5 Mockup */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Reports & Analytics
            </h1>
            <p className="text-xs text-slate-400">
              Financial performance, operational throughput, and partner garage metrics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Statement</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Metric Summary Cards matching Screen 5 Mockup */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Revenue */}
          <div className="bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Total Revenue
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">₹2,45,850</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                +18.7%
              </span>
            </div>
          </div>

          {/* Total Bookings */}
          <div className="bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Total Bookings
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-white">1,754</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                +15.3%
              </span>
            </div>
          </div>

          {/* Completed Bookings */}
          <div className="bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Completed Bookings
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-blue-400">654</span>
              <span className="text-[10px] font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded">
                +10.2%
              </span>
            </div>
          </div>

          {/* Cancelled Bookings */}
          <div className="bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Cancelled Bookings
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-rose-400">255</span>
              <span className="text-[10px] font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded">
                -5.4%
              </span>
            </div>
          </div>
        </div>

        {/* Charts Row matching Admin Screen 5 Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Revenue Overview Visual Bar Graph */}
          <div className="lg:col-span-2 bg-slate-800/90 border border-slate-700/80 p-6 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Revenue Overview</h3>
                <p className="text-xs text-slate-400">Daily gross booking billing value</p>
              </div>
              <span className="text-xs text-slate-400 bg-slate-700/60 px-2.5 py-1 rounded-lg">
                20 May - 26 May 2026
              </span>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2">
              {revenueByDay.map((d, idx) => {
                const heightPercent = Math.round((d.revenue / maxRevenue) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="opacity-0 group-hover:opacity-100 transition text-[10px] font-bold text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 whitespace-nowrap">
                      ₹{d.revenue.toLocaleString()}
                    </div>
                    <div className="w-full bg-slate-700/60 rounded-t-xl h-40 flex items-end overflow-hidden">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-xl group-hover:brightness-110 transition-all duration-300"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">{d.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bookings by Status Donut Chart matching Mockup 5 */}
          <div className="bg-slate-800/90 border border-slate-700/80 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white mb-1">Bookings by Status</h3>
              <p className="text-xs text-slate-400 mb-6">Aggregate platform distribution</p>

              <div className="relative w-40 h-40 mx-auto mb-4 flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="3.8"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3.8"
                    strokeDasharray="48, 100"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.8"
                    strokeDasharray="37, 100"
                    strokeDashoffset="-48"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="3.8"
                    strokeDasharray="15, 100"
                    strokeDashoffset="-85"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-slate-400">Total</span>
                  <span className="text-lg font-black text-white">1,754</span>
                </div>
              </div>

              <div className="space-y-2 mt-4 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="text-slate-300">Upcoming</span>
                  </div>
                  <span className="font-bold text-white">845 (48%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-slate-300">Completed</span>
                  </div>
                  <span className="font-bold text-white">654 (37%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-slate-300">Cancelled</span>
                  </div>
                  <span className="font-bold text-white">255 (15%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Service Centers Table matching Mockup 5 */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-white mb-4">Top Performing Service Centers</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-700 text-slate-400 font-bold uppercase text-[10px]">
                <tr>
                  <th className="pb-3">Rank</th>
                  <th className="pb-3">Center Name</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Total Completed</th>
                  <th className="pb-3 text-right">Revenue Generated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 font-medium text-slate-300">
                {[
                  { rank: 1, name: 'Shree Auto Service', city: 'Pune', completed: 124, revenue: '₹78,540' },
                  { rank: 2, name: 'Honda Care Center', city: 'Mumbai', completed: 98, revenue: '₹56,230' },
                  { rank: 3, name: 'QuickFix Wheels', city: 'Nagpur', completed: 76, revenue: '₹42,180' },
                  { rank: 4, name: 'Auto Pro Service', city: 'Nashik', completed: 65, revenue: '₹38,900' }
                ].map((c) => (
                  <tr key={c.rank} className="hover:bg-slate-700/30">
                    <td className="py-3 font-bold text-emerald-400">#{c.rank}</td>
                    <td className="py-3 font-bold text-white">{c.name}</td>
                    <td className="py-3 text-slate-400">{c.city}</td>
                    <td className="py-3">{c.completed} orders</td>
                    <td className="py-3 text-right font-black text-emerald-400 text-sm">
                      {c.revenue}
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
