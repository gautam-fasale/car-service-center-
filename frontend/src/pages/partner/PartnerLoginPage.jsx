import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, Mail, Lock, Eye, EyeOff, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const PartnerLoginPage = () => {
  const navigate = useNavigate();
  const { login, loginAsDemo } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(identifier, password, 'ServiceCenter');
      navigate('/partner/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid partner credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    try {
      await loginAsDemo('Partner');
      navigate('/partner/dashboard');
    } catch (err) {
      setError('Failed partner demo login');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2">
        {/* Left Side: Brand Promo matching Partner Screen 1 Mockup */}
        <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 p-8 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold">
                <Store className="w-5 h-5" />
              </div>
              <span className="text-xl font-black">
                Car<span className="text-blue-400">Serv</span> Partner
              </span>
            </div>

            <h2 className="text-3xl font-black tracking-tight leading-tight">
              Welcome Back!
            </h2>
            <p className="text-sm text-blue-200 mt-2">
              Login to your Service Center dashboard to manage appointments and streamline shop operations.
            </p>

            {/* Feature bullets matching mockup */}
            <div className="mt-8 space-y-4 text-xs font-semibold text-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>Manage Customer Bookings in Real-Time</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>Update Workshop Availability & Time Slots</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>Grow Your Business & Track Daily Earnings</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 text-[11px] text-blue-300">
            Authorized Garage Partner Network • 24/7 Support Desk
          </div>
        </div>

        {/* Right Side: Form matching Partner Screen 1 Mockup */}
        <div className="p-8 flex flex-col justify-between bg-slate-900">
          <div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto mb-2">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white">Service Center Login</h3>
              <p className="text-xs text-slate-400">Enter partner email or registered mobile</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Email / Mobile
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. shreeauto@example.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 rounded-xl bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs text-white outline-none"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter partner password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 pr-10 rounded-xl bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs text-white outline-none"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition text-xs disabled:opacity-50"
              >
                <span>{loading ? 'Authenticating...' : 'Login to Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 space-y-3 text-center">
            <button
              onClick={handleQuickDemo}
              type="button"
              className="w-full py-2 bg-indigo-950 hover:bg-indigo-900 border border-indigo-700/50 text-indigo-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
            >
              <ShieldCheck className="w-4 h-4" /> 1-Click Demo (Shree Auto Service)
            </button>
            <p className="text-xs text-slate-400">
              New workshop?{' '}
              <Link to="/partner/register" className="text-indigo-400 font-bold hover:underline">
                Register Your Service Center
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
