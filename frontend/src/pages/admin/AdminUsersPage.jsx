import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Search, Car, CalendarCheck, ShieldCheck, Mail, Phone, Clock } from 'lucide-react';
import { AdminSidebar } from '../../components/layout/AdminSidebar';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.FullName.toLowerCase().includes(q) ||
      u.Email.toLowerCase().includes(q) ||
      u.Mobile.includes(q) ||
      u.UserType.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Manage Registered Users
            </h1>
            <p className="text-xs text-slate-400">
              Customer accounts, service center partner logins, and vehicle ownership directory.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search by user name, email, mobile or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-11 pr-4 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-emerald-500 shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        </div>

        {/* Table */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-slate-400">Loading user directory...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/60 border-b border-slate-700 text-slate-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-5">User</th>
                    <th className="py-3 px-5">Contact Details</th>
                    <th className="py-3 px-5">Role</th>
                    <th className="py-3 px-5">Vehicles</th>
                    <th className="py-3 px-5">Total Bookings</th>
                    <th className="py-3 px-5 text-right">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 font-medium text-slate-300">
                  {filtered.map((u) => (
                    <tr key={u.UserID} className="hover:bg-slate-700/30">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-700 text-emerald-400 flex items-center justify-center font-bold">
                            {u.FullName?.charAt(0) || 'U'}
                          </div>
                          <span className="font-bold text-white">{u.FullName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="text-white">{u.Email}</div>
                        <div className="text-[11px] text-slate-400">{u.Mobile}</div>
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            u.UserType === 'Admin'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : u.UserType === 'ServiceCenter'
                              ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                              : 'bg-blue-950 text-blue-300 border border-blue-800'
                          }`}
                        >
                          {u.UserType}
                        </span>
                      </td>
                      <td className="py-4 px-5 font-semibold text-slate-200">
                        {u.vehicleCount || 0} registered
                      </td>
                      <td className="py-4 px-5 font-bold text-emerald-400">
                        {u.bookingCount || 0} orders
                      </td>
                      <td className="py-4 px-5 text-right text-slate-400">
                        {u.CreatedAt ? new Date(u.CreatedAt).toLocaleDateString() : 'Active'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
