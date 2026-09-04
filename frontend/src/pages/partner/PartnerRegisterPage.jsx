import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, User, Phone, Mail, Lock, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const PartnerRegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    centerName: '',
    mobile: '',
    email: '',
    address: '',
    city: 'Pune',
    password: '',
    userType: 'ServiceCenter'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      navigate('/partner/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto mb-2 font-bold text-xl">
            <Store className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white">Partner Registration</h2>
          <p className="text-xs text-slate-400 mt-1">List your workshop on the CarServ network</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950 border border-rose-800 text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Owner Name</label>
              <input
                type="text"
                required
                name="fullName"
                placeholder="e.g. Ramesh Deshmukh"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Workshop Name</label>
              <input
                type="text"
                required
                name="centerName"
                placeholder="e.g. Shree Auto Care"
                value={formData.centerName}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Mobile</label>
              <input
                type="tel"
                required
                name="mobile"
                placeholder="10 digit mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Email</label>
              <input
                type="email"
                required
                name="email"
                placeholder="garage@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">Workshop Address</label>
            <input
              type="text"
              required
              name="address"
              placeholder="Full garage location address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">City</label>
              <input
                type="text"
                required
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Password</label>
              <input
                type="password"
                required
                name="password"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition text-xs mt-4 disabled:opacity-50"
          >
            <span>{loading ? 'Registering...' : 'Complete Partner Onboarding'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-5">
          Already a partner?{' '}
          <Link to="/partner/login" className="text-indigo-400 font-bold hover:underline">
            Partner Login
          </Link>
        </p>
      </div>
    </div>
  );
};
