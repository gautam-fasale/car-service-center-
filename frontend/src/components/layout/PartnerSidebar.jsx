import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  Clock,
  Wrench,
  Store,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const PartnerSidebar = () => {
  const { logout, user } = useAuth();

  const links = [
    { name: 'Dashboard', path: '/partner/dashboard', icon: LayoutDashboard },
    { name: 'Bookings', path: '/partner/bookings', icon: CalendarCheck },
    { name: 'Availability', path: '/partner/availability', icon: Clock },
    { name: 'My Services', path: '/partner/services', icon: Wrench },
    { name: 'Center Profile', path: '/partner/profile', icon: Store }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-6rem)] p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* Partner Center Info Box */}
        <div className="p-3.5 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Store className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-semibold uppercase text-indigo-700 tracking-wider">Partner Portal</h4>
              <p className="text-sm font-bold text-slate-800 truncate">{user?.fullName || 'Shree Auto Service'}</p>
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Live Status
              </span>
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
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-200">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
