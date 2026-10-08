import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  MapPin,
  Star,
  Clock,
  Filter,
  Search,
  ChevronRight,
  ShieldCheck,
  Truck,
  Wrench,
  Phone,
  Sparkles,
  Award
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export const ServiceCenterListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { setSelectedCenter, selectedBrand } = useBooking();

  const brandParam = searchParams.get('brand') || '';
  const [activeFilter, setActiveFilter] = useState('All'); // All | TopRated | Open | Mobile
  const [searchQuery, setSearchQuery] = useState('');
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCenters();
  }, [activeFilter, brandParam]);

  const fetchCenters = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeFilter !== 'All') params.filter = activeFilter;
      if (searchQuery) params.search = searchQuery;

      const res = await axios.get('/api/service-centers', { params });
      if (res.data.success) {
        setCenters(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching centers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCenters();
  };

  const handleSelectCenter = (center) => {
    setSelectedCenter(center);
    navigate(`/service-centers/${center.ServiceCenterID}`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Title & Location */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
              <MapPin className="w-3.5 h-3.5" /> Pune, Maharashtra
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Nearby Local Service Centers & Garages
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing trusted local multi-brand mechanics and auto care workshops
            </p>
          </div>

          <Link
            to="/select-brand"
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-blue-600 hover:text-blue-600 transition shadow-sm flex items-center gap-1.5"
          >
            <Filter className="w-3.5 h-3.5" /> Filter by Brand
          </Link>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative mb-6">
          <input
            type="text"
            placeholder="Search local garage by name or area (e.g. Kothrud, Baner, Wakad, Karve Nagar)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-11 pr-24 rounded-2xl bg-white border border-slate-200 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition text-sm text-slate-800 outline-none"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <button
            type="submit"
            className="absolute right-2 top-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition"
          >
            Search
          </button>
        </form>

        {/* Filter Pills for Local Service Centers */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {[
            { id: 'All', label: '🔧 All Local Garages' },
            { id: 'TopRated', label: '⭐ Top Rated (4.5+)' },
            { id: 'Open', label: '🟢 Open Now' },
            { id: 'Mobile', label: '🚚 Doorstep Mobile Van' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition shadow-sm ${
                activeFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-blue-500/20'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Centers List */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm font-semibold text-slate-500">Finding local garages...</p>
          </div>
        ) : centers.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
            <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Local Service Centers Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn't find garages matching your search filter. Try resetting your search.
            </p>
            <button
              onClick={() => { setActiveFilter('All'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
            >
              Show All Local Garages
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {centers.map((center) => (
              <div
                key={center.ServiceCenterID}
                onClick={() => handleSelectCenter(center)}
                className="group bg-white rounded-2xl border border-slate-200/80 hover:border-blue-600 p-4 sm:p-5 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Left Thumbnail & Info */}
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                    <img
                      src={center.Image || 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=600&auto=format&fit=crop&q=80'}
                      alt={center.Name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    {center.Type === 'Mobile' ? (
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-amber-500 text-white text-[9px] font-bold rounded">
                        Mobile Van
                      </span>
                    ) : (
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-slate-800 text-white text-[9px] font-bold rounded">
                        Local Garage
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                        {center.Name}
                      </h3>
                      {center.OpenStatus ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                          Open
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                          Closed
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {center.Address}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                      <div className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{center.Rating || '4.6'}</span>
                        <span className="text-slate-400 font-normal">({center.ReviewCount || 120})</span>
                      </div>

                      <div className="flex items-center gap-1 text-slate-500 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-blue-500" />
                        <span>{center.Distance || '2.1 km'}</span>
                      </div>

                      <div className="hidden sm:flex items-center gap-1 text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{center.WorkingHours || '08:30 AM - 08:30 PM'}</span>
                      </div>
                    </div>

                    {/* Services Chips Preview */}
                    {center.services && center.services.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {center.services.slice(0, 3).map((s) => (
                          <span
                            key={s.ServiceID}
                            className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium"
                          >
                            {s.ServiceName} (₹{Math.round(s.Price)})
                          </span>
                        ))}
                        {center.services.length > 3 && (
                          <span className="px-1.5 py-0.5 text-blue-600 text-[10px] font-semibold">
                            +{center.services.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action Button */}
                <div className="w-full sm:w-auto flex items-center justify-between sm:flex-col sm:items-end gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                  <span className="text-xs text-slate-400 font-medium">
                    Starts ₹399
                  </span>
                  <button
                    className="px-4 py-2 bg-blue-600 group-hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/20 flex items-center gap-1.5 transition"
                  >
                    <span>View & Book</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
