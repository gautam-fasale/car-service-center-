import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Store,
  Plus,
  Search,
  Edit2,
  Trash2,
  MapPin,
  Phone,
  Star,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AdminSidebar } from '../../components/layout/AdminSidebar';

export const AdminServiceCentersPage = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Branded',
    brand: 'All',
    address: '',
    city: 'Pune',
    pincode: '411001',
    phone: '',
    workingHours: '09:00 AM - 07:00 PM',
    image: 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?w=800&auto=format&fit=crop&q=80'
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/service-centers', {
        params: { search: searchQuery || undefined }
      });
      if (res.data.success) {
        setCenters(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCenters();
  };

  const handleAddCenter = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await axios.post('/api/service-centers', formData);
      if (res.data.success) {
        setShowAddModal(false);
        setFormData({
          name: '',
          type: 'Branded',
          brand: 'All',
          address: '',
          city: 'Pune',
          pincode: '411001',
          phone: '',
          workingHours: '09:00 AM - 07:00 PM',
          image: 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?w=800&auto=format&fit=crop&q=80'
        });
        fetchCenters();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add service center');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (center) => {
    try {
      await axios.patch(`/api/service-centers/${center.ServiceCenterID}/availability`, {
        openStatus: !center.OpenStatus
      });
      fetchCenters();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this service center?')) return;
    try {
      await axios.delete(`/api/service-centers/${id}`);
      fetchCenters();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Header matching Admin Screen 3 Mockup */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Manage Service Centers
            </h1>
            <p className="text-xs text-slate-400">
              Review, onboard, verify, and monitor authorized workshops and local garages.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Service Center</span>
          </button>
        </div>

        {/* Search Bar matching Mockup 3 */}
        <form onSubmit={handleSearch} className="relative mb-6">
          <input
            type="text"
            placeholder="Search service center by name, owner, city or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-11 pr-24 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-emerald-500 shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <button
            type="submit"
            className="absolute right-2 top-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition"
          >
            Search
          </button>
        </form>

        {/* Table matching Admin Screen 3 Mockup */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-slate-400">Loading service stations...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/60 border-b border-slate-700 text-slate-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-5">Center Name</th>
                    <th className="py-3 px-5">Type / Brand</th>
                    <th className="py-3 px-5">City & Phone</th>
                    <th className="py-3 px-5">Rating</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 font-medium text-slate-300">
                  {centers.map((c) => (
                    <tr key={c.ServiceCenterID} className="hover:bg-slate-700/30">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={c.Image || 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?w=600&auto=format&fit=crop&q=80'}
                            alt={c.Name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                          />
                          <div>
                            <span className="font-bold text-white block">{c.Name}</span>
                            <span className="text-[10px] text-slate-400 max-w-xs truncate block">
                              {c.Address}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-300 text-[10px] font-bold">
                          {c.Type} • {c.Brand || 'All'}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="text-white block font-bold">{c.City}</span>
                        <span className="text-[10px] text-slate-400">{c.Phone}</span>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1 font-bold text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{c.Rating || '4.5'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <button
                          onClick={() => handleToggleActive(c)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                            c.OpenStatus
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}
                        >
                          {c.OpenStatus ? '● Active' : '○ Inactive'}
                        </button>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDelete(c.ServiceCenterID)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 transition"
                            title="Delete center"
                          >
                            <Trash2 className="w-4 h-4" />
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

        {/* Add Service Center Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 text-white">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-black text-white">+ Onboard New Service Center</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-950 border border-rose-800 text-rose-300 text-xs font-semibold">
                  {error}
                </div>
              )}

              <form onSubmit={handleAddCenter} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Center Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SpeedWorks Garage"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs outline-none focus:border-emerald-500 text-white"
                    >
                      <option value="Branded">Branded Authorized</option>
                      <option value="Non-Branded">Non-Branded Multi</option>
                      <option value="Mobile">Mobile Service Van</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Address</label>
                  <input
                    type="text"
                    required
                    placeholder="Full street address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="10 digit phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition disabled:opacity-50"
                  >
                    {saving ? 'Creating...' : 'Onboard Center'}
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
