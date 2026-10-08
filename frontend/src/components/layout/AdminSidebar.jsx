import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Store,
  CalendarCheck,
  BarChart3,
  LogOut,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminSidebar = () => {
  const { logout, user } = useAuth();

  const links = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Service Centers', path: '/admin/service-centers', icon: Store },
    { name: 'All Bookings', path: '/admin/bookings', icon: CalendarCheck },
    { name: 'Manage Users', path: '/admin/users', icon: Users },
    { name: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 min-h-[calc(100vh-6rem)] p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* Admin Info Card */}
        <div className="p-3.5 bg-slate-800/80 border border-slate-700/80 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Super Admin</h4>
              <p className="text-sm font-bold text-white truncate">{user?.fullName || 'CarServ Master'}</p>
              <span className="text-[11px] text-slate-400">System Monitoring</span>
            </div>
          </div>
        </div>

        {/* Links */}
        <nav className="space-y-1.5">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-40" />
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-950/40 transition"
        >
          <LogOut className="w-5 h-5" />
          <span>Admin Logout</span>
        </button>
      </div>
    </aside>
  );
};
