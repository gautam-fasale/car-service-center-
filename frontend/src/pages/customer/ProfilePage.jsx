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
  CheckCircle2,
  X,
  Lock,
  MessageSquare,
  HelpCircle as QuestionIcon,
  Globe,
  Save,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Modals state
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showAddresses, setShowAddresses] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // 1. Vehicle State
  const [newVehicle, setNewVehicle] = useState({
    brand: 'Hyundai',
    model: 'i20',
    registrationNo: '',
    vehicleType: '4W',
    year: 2023
  });

  // 2. Saved Addresses State
  const [addresses, setAddresses] = useState([
    { id: 1, label: 'Home', address: 'Flat 402, Green Meadows, Paud Road, Kothrud, Pune - 411038', isDefault: true },
    { id: 2, label: 'Office', address: 'Tower B, Tech Park, Hinjawadi Phase 1, Pune - 411057', isDefault: false }
  ]);
  const [newAddress, setNewAddress] = useState({ label: 'Home', address: '', pincode: '411038' });
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);

  // 3. Saved Payments State
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'UPI', value: 'rohan@okaxis', isDefault: true },
    { id: 2, type: 'Card', value: 'HDFC Bank Debit Card (•••• 4242)', isDefault: false }
  ]);
  const [newUPI, setNewUPI] = useState('');
  const [showAddUPI, setShowAddUPI] = useState(false);

  // 4. Notifications Preferences State
  const [notifications, setNotifications] = useState({
    whatsapp: true,
    sms: true,
    email: true,
    offers: false
  });

  // 5. Settings State
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || 'Rohan Sharma',
    mobile: user?.mobile || '9876543210',
    language: 'English',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 6. Support Ticket State
  const [supportMessage, setSupportMessage] = useState('');

  const triggerToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3500);
  };

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
        triggerToast('Vehicle added successfully to your garage!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add vehicle');
    }
  };

  const handleDeleteVehicle = async (id) => {
    try {
      await axios.delete(`/api/vehicles/${id}`);
      fetchVehicles();
      triggerToast('Vehicle removed from your account.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddress.address.trim()) return;
    const added = {
      id: Date.now(),
      label: newAddress.label,
      address: `${newAddress.address}, Pune - ${newAddress.pincode}`,
      isDefault: addresses.length === 0
    };
    setAddresses([...addresses, added]);
    setNewAddress({ label: 'Home', address: '', pincode: '411038' });
    setShowAddAddressForm(false);
    triggerToast('New service address saved!');
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter(a => a.id !== id));
    triggerToast('Address deleted.');
  };

  const handleAddUPI = (e) => {
    e.preventDefault();
    if (!newUPI.trim() || !newUPI.includes('@')) {
      alert('Please enter a valid UPI ID (e.g. yourname@upi)');
      return;
    }
    setPaymentMethods([...paymentMethods, { id: Date.now(), type: 'UPI', value: newUPI.trim(), isDefault: false }]);
    setNewUPI('');
    setShowAddUPI(false);
    triggerToast('UPI ID saved successfully!');
  };

  const handleDeletePayment = (id) => {
    setPaymentMethods(paymentMethods.filter(p => p.id !== id));
    triggerToast('Payment method removed.');
  };

  const handleSaveNotifications = () => {
    setShowNotifications(false);
    triggerToast('Notification preferences updated!');
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setShowSettings(false);
    triggerToast('Profile and security preferences updated!');
  };

  const handleSendSupport = (e) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setSupportMessage('');
    setShowSupport(false);
    triggerToast('Support ticket #TKT-' + Math.floor(1000 + Math.random() * 9000) + ' submitted! Our team will call you shortly.');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Success Toast */}
      {successToast && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center gap-2.5 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Profile Card Header matching Mockup 15 */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-6 text-white flex items-center justify-between">
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
          {/* Section 1: My Vehicles */}
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
              <div className="py-4 text-center text-xs text-slate-400">Loading vehicles...</div>
            ) : vehicles.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center">
                <p className="text-xs text-slate-500">No vehicles registered yet.</p>
                <button
                  onClick={() => setShowAddVehicle(true)}
                  className="mt-2 text-xs font-bold text-blue-600"
                >
                  + Add Your First Car/Bike
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {vehicles.map((v) => (
                  <div
                    key={v.VehicleID}
                    className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between group hover:border-blue-300 transition"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {v.Brand} {v.Model}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        <span className="font-mono font-semibold">{v.RegistrationNo}</span> • {v.VehicleType} • {v.Year}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteVehicle(v.VehicleID)}
                      title="Delete vehicle"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: All Interactive Profile Menu Links */}
          <div className="pt-3 space-y-1">
            {/* 1. My Bookings */}
            <Link
              to="/my-bookings"
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 text-slate-700 font-bold text-xs transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <span>My Bookings</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
            </Link>

            {/* 2. Saved Addresses */}
            <button
              type="button"
              onClick={() => setShowAddresses(true)}
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 text-slate-700 font-bold text-xs transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>Saved Addresses ({addresses.length})</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
            </button>

            {/* 3. Payment Methods */}
            <button
              type="button"
              onClick={() => setShowPayments(true)}
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 text-slate-700 font-bold text-xs transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition">
                  <CreditCard className="w-4 h-4" />
                </div>
                <span>Payment Methods</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
            </button>

            {/* 4. Notifications & SMS Alerts */}
            <button
              type="button"
              onClick={() => setShowNotifications(true)}
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 text-slate-700 font-bold text-xs transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition">
                  <Bell className="w-4 h-4" />
                </div>
                <span>Notifications & SMS Alerts</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
            </button>

            {/* 5. Help & Support */}
            <button
              type="button"
              onClick={() => setShowSupport(true)}
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 text-slate-700 font-bold text-xs transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:scale-105 transition">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <span>Help & Support</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600" />
            </button>

            {/* 6. Settings */}
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 text-slate-700 font-bold text-xs transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center group-hover:scale-105 transition">
                  <Settings className="w-4 h-4" />
                </div>
                <span>Account Settings</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
            </button>

            {/* 7. Logout */}
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-rose-50 text-rose-600 font-bold text-xs transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition">
                  <LogOut className="w-4 h-4" />
                </div>
                <span>Logout</span>
              </div>
              <ChevronRight className="w-4 h-4 text-rose-400 group-hover:text-rose-600" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. ADD VEHICLE MODAL */}
      {/* ========================================================= */}
      {showAddVehicle && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Add New Vehicle</h3>
              <button onClick={() => setShowAddVehicle(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-3 p-2 bg-red-50 text-red-700 text-xs font-semibold rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleAddVehicle} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {['4W', '2W'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewVehicle({ ...newVehicle, vehicleType: t })}
                      className={`py-2 text-xs font-bold rounded-xl border transition ${
                        newVehicle.vehicleType === t
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      {t === '4W' ? 'Four Wheeler (Car)' : 'Two Wheeler (Bike)'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Brand</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hyundai, Honda, Tata, Suzuki"
                  value={newVehicle.brand}
                  onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Model Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. i20 Asta, City ZX, Nexon, Activa"
                  value={newVehicle.model}
                  onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Registration Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MH12AB1234"
                  value={newVehicle.registrationNo}
                  onChange={(e) => setNewVehicle({ ...newVehicle, registrationNo: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 text-xs font-mono uppercase bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Year</label>
                <input
                  type="number"
                  min="2000"
                  max="2026"
                  value={newVehicle.year}
                  onChange={(e) => setNewVehicle({ ...newVehicle, year: parseInt(e.target.value, 10) })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddVehicle(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. SAVED ADDRESSES MODAL */}
      {/* ========================================================= */}
      {showAddresses && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Saved Service Addresses</h3>
              </div>
              <button onClick={() => setShowAddresses(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="space-y-2.5 max-h-60 overflow-y-auto">
              {addresses.map((a) => (
                <div key={a.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">{a.label}</span>
                      {a.isDefault && (
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Default</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{a.address}</p>
                  </div>
                  <button onClick={() => handleDeleteAddress(a.id)} className="text-slate-400 hover:text-rose-600 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Address Form */}
            {showAddAddressForm ? (
              <form onSubmit={handleAddAddress} className="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-2.5">
                <h4 className="text-xs font-bold text-emerald-900">Add New Address</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['Home', 'Office', 'Other'].map(lbl => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setNewAddress({ ...newAddress, label: lbl })}
                      className={`py-1 text-xs font-bold rounded-lg border ${
                        newAddress.label === lbl ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  required
                  placeholder="Street / Flat / Area (e.g. Survey 42, Baner Link Rd)"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none"
                />
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowAddAddressForm(false)} className="flex-1 py-1.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg">
                    Save Address
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowAddAddressForm(true)}
                className="w-full py-2.5 border-2 border-dashed border-emerald-300 text-emerald-700 font-bold text-xs rounded-2xl hover:bg-emerald-50 flex items-center justify-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" /> Add New Address
              </button>
            )}

            <button
              onClick={() => setShowAddresses(false)}
              className="w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. PAYMENT METHODS MODAL */}
      {/* ========================================================= */}
      {showPayments && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">Saved Payment Methods</h3>
              </div>
              <button onClick={() => setShowPayments(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {paymentMethods.map((p) => (
                <div key={p.id} className="p-3 bg-purple-50/50 border border-purple-200/80 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                      {p.type === 'UPI' ? 'UPI' : '💳'}
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-900 block">{p.value}</span>
                      <span className="text-[10px] text-purple-700 font-semibold">{p.type} Verified</span>
                    </div>
                  </div>
                  <button onClick={() => handleDeletePayment(p.id)} className="text-slate-400 hover:text-rose-600 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {showAddUPI ? (
              <form onSubmit={handleAddUPI} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Enter UPI VPA ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. mobile@paytm or name@okaxis"
                  value={newUPI}
                  onChange={(e) => setNewUPI(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none"
                />
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowAddUPI(false)} className="flex-1 py-1.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-lg">
                    Verify & Save
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowAddUPI(true)}
                className="w-full py-2.5 border-2 border-dashed border-purple-300 text-purple-700 font-bold text-xs rounded-2xl hover:bg-purple-50 flex items-center justify-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" /> Link New UPI ID
              </button>
            )}

            <button
              onClick={() => setShowPayments(false)}
              className="w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. NOTIFICATIONS & SMS ALERTS MODAL */}
      {/* ========================================================= */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">Alerts & Notification Preferences</h3>
              </div>
              <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 block">📱 WhatsApp Live Updates</span>
                  <span className="text-slate-500 text-[11px]">Real-time mechanic status & garage pickup alerts</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.whatsapp}
                  onChange={(e) => setNotifications({ ...notifications, whatsapp: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 block">💬 SMS Reminders</span>
                  <span className="text-slate-500 text-[11px]">1 hour before scheduled time slot appointment</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.sms}
                  onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 block">📧 Email Service Invoices</span>
                  <span className="text-slate-500 text-[11px]">Itemized bill breakdown and payment tax receipt</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 block">🏷️ Discounts & Seasonal Service Offers</span>
                  <span className="text-slate-500 text-[11px]">Monsoon checkup and festive discount coupons</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.offers}
                  onChange={(e) => setNotifications({ ...notifications, offers: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>
            </div>

            <button
              onClick={handleSaveNotifications}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md"
            >
              Save Notification Settings
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. HELP & SUPPORT MODAL */}
      {/* ========================================================= */}
      {showSupport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-600" />
                <h3 className="text-base font-bold text-slate-900">24/7 CarServ Helpdesk</h3>
              </div>
              <button onClick={() => setShowSupport(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Call Channels */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href="tel:18002677378"
                className="p-3 bg-cyan-50 border border-cyan-200 rounded-2xl flex flex-col items-center justify-center text-cyan-900 hover:bg-cyan-100 transition"
              >
                <Phone className="w-4 h-4 text-cyan-600 mb-1" />
                <span className="font-bold">Toll Free Call</span>
                <span className="text-[10px] text-cyan-700 font-mono">1800-267-7378</span>
              </a>

              <a
                href="mailto:support@carserv.com"
                className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex flex-col items-center justify-center text-blue-900 hover:bg-blue-100 transition"
              >
                <Mail className="w-4 h-4 text-blue-600 mb-1" />
                <span className="font-bold">Email Support</span>
                <span className="text-[10px] text-blue-700">support@carserv.com</span>
              </a>
            </div>

            {/* FAQs Accordion preview */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block">Frequently Asked Questions:</span>
              <div className="space-y-1 text-slate-600 text-[11px]">
                <p>• <strong>How do I cancel or reschedule?</strong> Go to 'My Bookings' and click Cancel / Reschedule.</p>
                <p>• <strong>Is pickup & drop free?</strong> Yes, doorstep pickup is included for all general service bookings.</p>
                <p>• <strong>What if extra parts are needed?</strong> The workshop technician calls you for approval before replacements.</p>
              </div>
            </div>

            {/* Submit Query */}
            <form onSubmit={handleSendSupport} className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Send us a direct message:</label>
              <textarea
                required
                rows="2"
                placeholder="Describe your issue or questions..."
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-600 resize-none"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs shadow-md"
              >
                Submit Support Query
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. SETTINGS MODAL */}
      {/* ========================================================= */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-700" />
                <h3 className="text-base font-bold text-slate-900">Account & Security Settings</h3>
              </div>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Mobile Phone Number</label>
                <input
                  type="tel"
                  required
                  value={profileForm.mobile}
                  onChange={(e) => setProfileForm({ ...profileForm, mobile: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">App Language</label>
                <select
                  value={profileForm.language}
                  onChange={(e) => setProfileForm({ ...profileForm, language: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600"
                >
                  <option value="English">English (Default)</option>
                  <option value="Marathi">मराठी (Marathi)</option>
                  <option value="Hindi">हिन्दी (Hindi)</option>
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Change Password (Optional)</label>
                <input
                  type="password"
                  placeholder="New Password"
                  value={profileForm.newPassword}
                  onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. LOGOUT CONFIRMATION MODAL */}
      {/* ========================================================= */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Are you sure you want to log out?</h3>
            <p className="text-xs text-slate-500">You will need to log back in to manage your appointments and vehicles.</p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
              >
                Stay Logged In
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                  navigate('/login');
                }}
                className="flex-1 py-2.5 bg-rose-600 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
