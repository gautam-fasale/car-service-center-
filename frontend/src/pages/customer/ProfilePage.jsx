import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  User,
  Car,
  CalendarCheck,
  MapPin,
  CreditCard,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  ChevronRight,
  Plus,
  Trash2,
  Phone,
  Mail,
  ShieldCheck,
  Edit2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    brand: 'Hyundai',
    model: 'i20',
    registrationNo: '',
    vehicleType: '4W',
    year: 2023
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchVehicles();
  }, [isAuthenticated]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/vehicles/my');
      if (res.data.success) {
        setVehicles(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/vehicles', newVehicle);
      if (res.data.success) {
        setShowAddVehicle(false);
        setNewVehicle({ brand: 'Hyundai', model: 'i20', registrationNo: '', vehicleType: '4W', year: 2023 });
        fetchVehicles();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add vehicle');
    }
  };

  const handleDeleteVehicle = async (id) => {
    try {
      await axios.delete(`/api/vehicles/${id}`);
      fetchVehicles();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Profile Card Header matching Mockup 15 */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white text-2xl font-black shadow-lg">
              {user?.fullName?.charAt(0) || 'R'}
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">{user?.fullName || 'Rohan Sharma'}</h2>
              <p className="text-xs text-blue-200 flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3" /> {user?.mobile || '9876543210'}
              </p>
              <p className="text-xs text-blue-200 flex items-center gap-1">
                <Mail className="w-3 h-3" /> {user?.email || 'rohan@example.com'}
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
            {user?.userType || 'Customer'}
          </span>
        </div>

        {/* Menu Items matching Mockup 15 */}
        <div className="p-5 space-y-1 divide-y divide-slate-100">
          {/* Section: My Vehicles */}
          <div className="pb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Car className="w-4 h-4 text-blue-600" /> My Vehicles ({vehicles.length})
              </span>
              <button
                onClick={() => setShowAddVehicle(true)}
                className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Vehicle
              </button>
            </div>

            {loading ? (
              <p className="text-xs text-slate-400">Loading vehicles...</p>
            ) : vehicles.length === 0 ? (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <p className="text-xs text-slate-500">No vehicles saved yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {vehicles.map((v) => (
                  <div
                    key={v.VehicleID}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">
                        {v.Brand} {v.Model}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500 font-semibold">
                        {v.RegistrationNo} • {v.VehicleType} • {v.Year}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteVehicle(v.VehicleID)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nav List items matching Mockup 15 */}
          <div className="pt-3 space-y-1">
            <Link
              to="/my-bookings"
              className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium text-xs transition"
            >
              <div className="flex items-center gap-3">
                <CalendarCheck className="w-4 h-4 text-blue-600" />
                <span>My Bookings</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium text-xs transition cursor-pointer">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Saved Addresses (Home, Office)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium text-xs transition cursor-pointer">
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-purple-600" />
                <span>Payment Methods</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium text-xs transition cursor-pointer">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-amber-600" />
                <span>Notifications & SMS Alerts</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium text-xs transition cursor-pointer">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4 text-sky-600" />
                <span>Help & Support</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium text-xs transition cursor-pointer">
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-slate-600" />
                <span>Settings</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-rose-50 text-rose-600 font-bold text-xs transition"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Add Vehicle Modal */}
        {showAddVehicle && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
              <h3 className="text-base font-black text-slate-900 mb-3">Add New Vehicle</h3>

              {error && (
                <div className="mb-3 p-2.5 rounded-lg bg-red-50 text-red-700 text-xs font-semibold">
                  {error}
                </div>
              )}

              <form onSubmit={handleAddVehicle} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Type</label>
                    <select
                      value={newVehicle.vehicleType}
                      onChange={(e) => setNewVehicle({ ...newVehicle, vehicleType: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    >
                      <option value="4W">Four Wheeler (4W)</option>
                      <option value="2W">Two Wheeler (2W)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Year</label>
                    <input
                      type="number"
                      value={newVehicle.year}
                      onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hyundai, Honda, Tata"
                    value={newVehicle.brand}
                    onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Model</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. i20, City, Nexon"
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Registration No
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MH12AB1234"
                    value={newVehicle.registrationNo}
                    onChange={(e) => setNewVehicle({ ...newVehicle, registrationNo: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddVehicle(false)}
                    className="flex-1 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
                  >
                    Add Vehicle
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
