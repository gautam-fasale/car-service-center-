import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Store,
  Calendar,
  Clock,
  Car,
  Wrench,
  ChevronRight,
  ShieldCheck,
  PlusCircle
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';

export const BookingSummaryPage = () => {
  const navigate = useNavigate();
  const {
    selectedCenter,
    selectedServices,
    bookingDate,
    timeSlot,
    selectedVehicle,
    setSelectedVehicle,
    notes,
    setNotes,
    subtotal,
    estimatedTotal
  } = useBooking();
  const { user, isAuthenticated } = useAuth();

  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    brand: 'Hyundai',
    model: 'i20 Asta',
    registrationNo: 'MH12AB1234',
    vehicleType: '4W',
    year: 2022
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserVehicles();
    } else {
      // Default placeholder vehicle
      if (!selectedVehicle) {
        setSelectedVehicle({
          VehicleID: 1,
          Brand: 'Hyundai',
          Model: 'i20 Asta',
          RegistrationNo: 'MH12AB1234',
          VehicleType: '4W'
        });
      }
    }
  }, [isAuthenticated]);

  const fetchUserVehicles = async () => {
    setLoadingVehicles(true);
    try {
      const res = await axios.get('/api/vehicles/my');
      if (res.data.success && res.data.data.length > 0) {
        setVehicles(res.data.data);
        if (!selectedVehicle) {
          setSelectedVehicle(res.data.data[0]);
        }
      } else {
        // Create default vehicle if none
        setSelectedVehicle({
          VehicleID: 1,
          Brand: 'Hyundai',
          Model: 'i20 Asta',
          RegistrationNo: 'MH12AB1234',
          VehicleType: '4W'
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingVehicles(false);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      if (isAuthenticated) {
        const res = await axios.post('/api/vehicles', newVehicle);
        if (res.data.success) {
          fetchUserVehicles();
          setSelectedVehicle(res.data.data);
        }
      } else {
        setSelectedVehicle({
          VehicleID: Date.now(),
          Brand: newVehicle.brand,
          Model: newVehicle.model,
          RegistrationNo: newVehicle.registrationNo,
          VehicleType: newVehicle.vehicleType
        });
      }
      setShowAddVehicleModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleProceedToPay = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/payment');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between min-h-[620px]">
        <div>
          {/* Top Header */}
          <div className="flex items-center gap-3 mb-5">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-black text-slate-900">Booking Summary</h2>
              <p className="text-xs text-slate-500">Review your service appointment</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Center Info Card */}
            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {selectedCenter?.Name || 'Hyundai Service Center'}
                  </h4>
                  <span className="text-xs text-blue-600 font-medium">
                    {selectedCenter?.Distance || '2.3 km'} • {selectedCenter?.City || 'Pune'}
                  </span>
                </div>
              </div>
            </div>

            {/* Selected Vehicle Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-blue-600" /> Vehicle Details
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddVehicleModal(true)}
                  className="text-xs text-blue-600 font-bold hover:underline"
                >
                  Change / Add
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {selectedVehicle?.Brand || 'Hyundai'} {selectedVehicle?.Model || 'i20 Asta'}
                  </h4>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {selectedVehicle?.RegistrationNo || 'MH12AB1234'}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[11px] font-bold">
                  {selectedVehicle?.VehicleType || '4W'}
                </span>
              </div>
            </div>

            {/* Appointment Schedule */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Service Date
                </span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>{bookingDate || '2026-08-25'}</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Time Slot
                </span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>{timeSlot || '03:00 PM'}</span>
                </div>
              </div>
            </div>

            {/* Itemized Services Breakdown */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Selected Services
              </span>
              <div className="space-y-2">
                {selectedServices.length === 0 ? (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700">General Service</span>
                    <span className="font-bold text-slate-900">₹1,499</span>
                  </div>
                ) : (
                  selectedServices.map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-slate-700 font-medium">{s.name}</span>
                      <span className="font-bold text-slate-900">₹{Math.round(s.price)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Special Instructions Input */}
            <div>
              <input
                type="text"
                placeholder="Add special instructions or issues (optional)..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:border-blue-600 focus:bg-white transition"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bill & Proceed to Pay */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs text-slate-400 block">Estimated Amount</span>
              <span className="text-2xl font-black text-slate-900">
                ₹{Math.round(estimatedTotal || 2198)}
              </span>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded">
              Taxes Included
            </span>
          </div>

          <button
            onClick={handleProceedToPay}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition"
          >
            <span>Proceed to Pay</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Add Vehicle Modal */}
        {showAddVehicleModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Add / Change Vehicle</h3>
              <form onSubmit={handleAddVehicle} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={newVehicle.brand}
                    onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Model</label>
                  <input
                    type="text"
                    required
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Registration No (e.g. MH12AB1234)
                  </label>
                  <input
                    type="text"
                    required
                    value={newVehicle.registrationNo}
                    onChange={(e) => setNewVehicle({ ...newVehicle, registrationNo: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddVehicleModal(false)}
                    className="flex-1 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
                  >
                    Save Vehicle
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
