import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Wrench,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Store,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { PartnerSidebar } from '../../components/layout/PartnerSidebar';

export const PartnerServicesPage = () => {
  const [center, setCenter] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentServiceId, setCurrentServiceId] = useState(null);

  const [formData, setFormData] = useState({
    serviceName: '',
    description: '',
    price: '',
    duration: 45
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const dRes = await axios.get('/api/partner/dashboard');
      if (dRes.data.success && dRes.data.data.center) {
        const c = dRes.data.data.center;
        setCenter(c);

        const sRes = await axios.get(`/api/services/center/${c.ServiceCenterID}`);
        if (sRes.data.success) {
          setServices(sRes.data.data);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentServiceId(null);
    setFormData({ serviceName: '', description: '', price: '', duration: 45 });
    setError('');
    setShowModal(true);
  };

  const handleOpenEdit = (s) => {
    setIsEditing(true);
    setCurrentServiceId(s.ServiceID);
    setFormData({
      serviceName: s.ServiceName,
      description: s.Description || '',
      price: s.Price,
      duration: s.Duration || 45
    });
    setError('');
    setShowModal(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isEditing) {
        await axios.put(`/api/services/${currentServiceId}`, formData);
      } else {
        await axios.post('/api/services', {
          ...formData,
          serviceCenterId: center.ServiceCenterID
        });
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service from catalog?')) return;
    try {
      await axios.delete(`/api/services/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-100 flex flex-col md:flex-row">
      <PartnerSidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Top Header matching Partner Screen 5 Mockup */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Services & Rates
            </h1>
            <p className="text-xs text-slate-500">
              Customize labor rates, service packages, and estimated job duration.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Service</span>
          </button>
        </div>

        {/* Services Table matching Mockup */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-6">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-blue-600" /> Active Service Menu ({services.length})
            </h3>
            <span className="text-xs text-slate-400">Real-time synced with customer portal</span>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-slate-500">Loading catalog...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-5">Service Name</th>
                    <th className="py-3 px-5">Description</th>
                    <th className="py-3 px-5">Duration</th>
                    <th className="py-3 px-5">Price (₹)</th>
                    <th className="py-3 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {services.map((s) => (
                    <tr key={s.ServiceID} className="hover:bg-slate-50">
                      <td className="py-4 px-5 font-bold text-slate-900">
                        {s.ServiceName}
                      </td>
                      <td className="py-4 px-5 text-slate-500 max-w-xs truncate">
                        {s.Description || 'Standard service check'}
                      </td>
                      <td className="py-4 px-5 font-semibold text-slate-600">
                        <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded">
                          <Clock className="w-3 h-3 text-slate-400" /> {s.Duration} min
                        </span>
                      </td>
                      <td className="py-4 px-5 font-black text-slate-900 text-sm">
                        ₹{Math.round(s.Price)}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(s)}
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteService(s.ServiceID)}
                            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Service Center Information Card matching Partner Screen 5 Mockup */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <Store className="w-4 h-4 text-indigo-600" /> Service Center Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Workshop Name</span>
              <span className="font-bold text-slate-900 text-sm">{center?.Name || 'Shree Auto Service'}</span>
              <span className="block text-slate-500 text-[11px] mt-0.5">{center?.City || 'Pune, Maharashtra'}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Mobile Hotline</span>
              <span className="font-bold text-slate-900 text-sm">{center?.Phone || '9876543210'}</span>
              <span className="block text-emerald-600 text-[11px] font-semibold mt-0.5">Verified Partner</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Partner Email</span>
              <span className="font-bold text-slate-900 text-sm truncate block">
                {center?.Email || 'shreeautoservice@gmail.com'}
              </span>
              <span className="block text-slate-500 text-[11px] mt-0.5">Invoicing & Notifications</span>
            </div>
          </div>
        </div>

        {/* Add / Edit Service Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-base font-black text-slate-900">
                  {isEditing ? 'Edit Service' : 'Add New Service Package'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>

              {error && (
                <div className="p-2.5 rounded-xl bg-red-50 text-red-700 text-xs font-semibold">
                  {error}
                </div>
              )}

              <form onSubmit={handleSaveService} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Service Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full Synthetic Oil Change"
                    value={formData.serviceName}
                    onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows="2"
                    placeholder="What is included in this service..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 1499"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 60"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : isEditing ? 'Update Service' : 'Add to Catalog'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
