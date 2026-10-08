import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  MapPin,
  Star,
  Clock,
  Phone,
  ArrowLeft,
  ShieldCheck,
  Wrench,
  CheckCircle2,
  Share2,
  Heart,
  MessageSquarePlus,
  Send
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';

export const ServiceCenterDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setSelectedCenter } = useBooking();
  const { user, isAuthenticated } = useAuth();

  const [center, setCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('services'); // services | reviews | about
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    fetchCenterDetail();
  }, [id]);

  const fetchCenterDetail = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/service-centers/${id}`);
      if (res.data.success) {
        setCenter(res.data.data);
        setSelectedCenter(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching center:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    setSelectedCenter(center);
    navigate(`/select-services/${center.ServiceCenterID}`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setReviewSubmitting(true);
    try {
      const res = await axios.post('/api/reviews', {
        serviceCenterId: id,
        rating: newRating,
        comment: newComment
      });
      if (res.data.success) {
        setReviewMsg('Thank you! Your review has been posted.');
        setNewComment('');
        fetchCenterDetail();
      }
    } catch (err) {
      setReviewMsg(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-slate-500 font-semibold">Loading service center...</p>
        </div>
      </div>
    );
  }

  if (!center) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-800">Service Center Not Found</h2>
          <Link to="/service-centers" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">
            Back to List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 pb-20">
      {/* Top Header Image Banner */}
      <div className="relative h-64 sm:h-80 w-full bg-slate-900 overflow-hidden">
        <img
          src={center.Image || 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?w=1200&auto=format&fit=crop&q=80'}
          alt={center.Name}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

        {/* Top Floating Actions */}
        <div className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between z-10">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-900 backdrop-blur-md flex items-center justify-center shadow-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-900 backdrop-blur-md flex items-center justify-center shadow-lg transition">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-900 backdrop-blur-md flex items-center justify-center shadow-lg transition">
              <Heart className="w-4 h-4 text-rose-500" />
            </button>
          </div>
        </div>

        {/* Bottom Banner Content */}
        <div className="absolute bottom-6 inset-x-4 sm:inset-x-8 max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-bold tracking-wider uppercase">
                {center.Type} Center
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[11px] font-bold">
                {center.OpenStatus ? 'Open Now' : 'Closed'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{center.Name}</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{center.Address}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-center">
              <div className="flex items-center justify-center gap-1 font-bold text-amber-400 text-base">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{center.Rating || '4.5'}</span>
              </div>
              <span className="text-[10px] text-slate-300">({center.ReviewCount || 0} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Quick Highlights Strip */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="w-4 h-4 text-blue-600" />
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase">Hours</span>
              <span className="font-semibold text-slate-800">{center.WorkingHours || '09:00 AM - 08:00 PM'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="w-4 h-4 text-indigo-600" />
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase">Distance</span>
              <span className="font-semibold text-slate-800">{center.Distance || '2.3 km'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Phone className="w-4 h-4 text-emerald-600" />
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase">Contact</span>
              <span className="font-semibold text-slate-800">{center.Phone || '+91 9876543210'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase">Warranty</span>
              <span className="font-semibold text-slate-800">1000 km / 1 Month</span>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 mt-8 mb-6">
          <button
            onClick={() => setActiveTab('services')}
            className={`pb-3 px-4 font-bold text-sm transition border-b-2 ${
              activeTab === 'services'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Services Offered ({center.services?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 px-4 font-bold text-sm transition border-b-2 ${
              activeTab === 'reviews'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Customer Reviews ({center.reviews?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`pb-3 px-4 font-bold text-sm transition border-b-2 ${
              activeTab === 'about'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            About Center
          </button>
        </div>

        {/* Tab: Services */}
        {activeTab === 'services' && (
          <div className="space-y-3">
            {center.services?.map((s) => (
              <div
                key={s.ServiceID}
                className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between shadow-sm hover:border-blue-300 transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{s.ServiceName}</h4>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-semibold">
                      ⏱ {s.Duration} mins
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 max-w-lg">{s.Description}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-base font-black text-slate-900">₹{Math.round(s.Price)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {/* Write Review Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <MessageSquarePlus className="w-4 h-4 text-blue-600" /> Leave a Review & Rating
              </h4>
              {reviewMsg && (
                <div className="mb-3 p-2.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold">
                  {reviewMsg}
                </div>
              )}
              <form onSubmit={handleReviewSubmit} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">Your Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-1 hover:scale-110 transition"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  rows="2"
                  placeholder="Share your experience about service quality, mechanic behavior, and timeliness..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-none focus:border-blue-600 focus:bg-white transition"
                  required
                />
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{reviewSubmitting ? 'Posting...' : 'Submit Feedback'}</span>
                </button>
              </form>
            </div>

            {/* Reviews List */}
            <div className="space-y-3">
              {center.reviews?.map((r) => (
                <div key={r.ReviewID} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                        {r.FullName?.charAt(0) || 'U'}
                      </div>
                      <span className="text-xs font-bold text-slate-800">{r.FullName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(r.Rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{r.Comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: About */}
        {activeTab === 'about' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4 text-xs text-slate-600 leading-relaxed shadow-sm">
            <h3 className="text-sm font-bold text-slate-900">About {center.Name}</h3>
            <p>
              {center.Name} is a certified auto-care station equipped with state-of-the-art diagnostic OBD-II scanners, automated tire balancing bays, OEM-approved lubricants, and trained service mechanics.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-800 block mb-1">Available Days:</span>
                <span>{center.AvailableDays || 'Monday to Saturday'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-800 block mb-1">Lunch Break:</span>
                <span>{center.BreakTime || '01:00 PM - 02:00 PM'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Action Bar matching Mockup */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-3.5 px-4 z-30 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <a
            href={`tel:${center.Phone || '9876543210'}`}
            className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 transition"
          >
            <Phone className="w-4 h-4 text-blue-600" />
            <span>Call Center</span>
          </a>

          <button
            onClick={handleBookNow}
            className="flex-1 sm:flex-initial px-8 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
          >
            <span>Book Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
