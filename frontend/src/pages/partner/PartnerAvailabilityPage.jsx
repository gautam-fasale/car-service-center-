import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Calendar, Check, Save, AlertCircle, Sparkles } from 'lucide-react';
import { PartnerSidebar } from '../../components/layout/PartnerSidebar';

export const PartnerAvailabilityPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [centerId, setCenterId] = useState(1);

  const [openStatus, setOpenStatus] = useState(true);
  const [workFrom, setWorkFrom] = useState('09:00 AM');
  const [workTo, setWorkTo] = useState('07:00 PM');
  const [lunchFrom, setLunchFrom] = useState('01:00 PM');
  const [lunchTo, setLunchTo] = useState('02:00 PM');
  const [availableDays, setAvailableDays] = useState([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ]);

  const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const timeOptions = [
    '07:00 AM', '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM',
    '12:00 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '05:00 PM', '06:00 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM'
  ];

  useEffect(() => {
    fetchCenterAvailability();
  }, []);

  const fetchCenterAvailability = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/partner/dashboard');
      if (res.data.success && res.data.data.center) {
        const c = res.data.data.center;
        setCenterId(c.ServiceCenterID);
        setOpenStatus(c.OpenStatus ? true : false);

        if (c.WorkingHours && c.WorkingHours.includes(' - ')) {
          const parts = c.WorkingHours.split(' - ');
          setWorkFrom(parts[0].trim());
          setWorkTo(parts[1].trim());
        }
        if (c.BreakTime && c.BreakTime.includes(' - ')) {
          const parts = c.BreakTime.split(' - ');
          setLunchFrom(parts[0].trim());
          setLunchTo(parts[1].trim());
        }
        if (c.AvailableDays) {
          setAvailableDays(c.AvailableDays.split(',').map((d) => d.trim()));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (day) => {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const payload = {
        openStatus,
        workingHours: `${workFrom} - ${workTo}`,
        breakTime: `${lunchFrom} - ${lunchTo}`,
        availableDays: availableDays.join(',')
      };

      const res = await axios.patch(`/api/service-centers/${centerId}/availability`, payload);
      if (res.data.success) {
        setMsg('Workshop availability updated successfully!');
      }
    } catch (err) {
      setMsg('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-100 flex flex-col md:flex-row">
      <PartnerSidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-2xl">
          {/* Header matching Partner Screen 4 Mockup */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Update Availability & Slots
            </h1>
            <p className="text-xs text-slate-500">
              Configure daily operating hours, lunch break, and weekly working days.
            </p>
          </div>

          {msg && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{msg}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            {/* 1. Service Center Status Switch matching Mockup */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Service Center Status</h3>
                <p className="text-xs text-slate-500">Toggle whether customers can book today</p>
              </div>

              <button
                type="button"
                onClick={() => setOpenStatus(!openStatus)}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                  openStatus ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    openStatus ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* 2. Select Working Hours (From - To) matching Mockup */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" /> Select Working Hours
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 mb-1">From:</span>
                  <select
                    value={workFrom}
                    onChange={(e) => setWorkFrom(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-600"
                  >
                    {timeOptions.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 mb-1">To:</span>
                  <select
                    value={workTo}
                    onChange={(e) => setWorkTo(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-600"
                  >
                    {timeOptions.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Break Time (Lunch) matching Mockup */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" /> Break Time (Lunch)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 mb-1">From:</span>
                  <select
                    value={lunchFrom}
                    onChange={(e) => setLunchFrom(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-600"
                  >
                    {timeOptions.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 mb-1">To:</span>
                  <select
                    value={lunchTo}
                    onChange={(e) => setLunchTo(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-600"
                  >
                    {timeOptions.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 4. Available Days checkboxes matching Mockup */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" /> Available Days
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {allDays.map((day) => {
                  const isChecked = availableDays.includes(day);
                  return (
                    <label
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 cursor-pointer transition ${
                        isChecked
                          ? 'border-indigo-600 bg-indigo-50/60 text-indigo-900'
                          : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{day}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Save Changes Button matching Mockup */}
            <div className="pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving Changes...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
