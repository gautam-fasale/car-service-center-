import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, CheckSquare, Square, Clock, ChevronRight, AlertCircle, Wrench } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export const SelectServicePage = () => {
  const { centerId } = useParams();
  const navigate = useNavigate();
  const {
    selectedCenter,
    setSelectedCenter,
    selectedServices,
    toggleService,
    isServiceSelected,
    subtotal
  } = useBooking();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const id = centerId || selectedCenter?.ServiceCenterID || 1;
        const res = await axios.get(`/api/services/center/${id}`);
        if (res.data.success) {
          setServices(res.data.data);
        }

        // If center details are missing in context, fetch it
        if (!selectedCenter) {
          const cRes = await axios.get(`/api/service-centers/${id}`);
          if (cRes.data.success) {
            setSelectedCenter(cRes.data.data);
          }
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load services for this workshop');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [centerId]);

  const handleNext = () => {
    if (selectedServices.length === 0) {
      setError('Please select at least one service to proceed');
      return;
    }
    navigate('/select-slot');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between min-h-[580px]">
        <div>
          {/* Top Bar */}
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-black text-slate-900">Select Service</h2>
              <p className="text-xs text-slate-500">
                {selectedCenter?.Name || 'Choose the services you need'}
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Services Checklist */}
          {loading ? (
            <div className="py-12 text-center">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-slate-400">Loading service catalog...</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
              {services.map((service) => {
                const selected = isServiceSelected(service.ServiceID);
                return (
                  <div
                    key={service.ServiceID}
                    onClick={() => {
                      setError('');
                      toggleService(service);
                    }}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                      selected
                        ? 'border-blue-600 bg-blue-50/60 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-blue-600">
                        {selected ? (
                          <CheckSquare className="w-5 h-5 fill-blue-600 text-white" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-300" />
                        )}
                      </div>
                      <div>
                        <h4
                          className={`text-sm font-bold ${
                            selected ? 'text-blue-950' : 'text-slate-800'
                          }`}
                        >
                          {service.ServiceName}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {service.Duration || 45} mins
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-slate-900">
                        ₹{Math.round(service.Price)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Total & Next Button */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-slate-500 font-medium">
              Selected ({selectedServices.length} items):
            </span>
            <span className="text-base font-black text-blue-600">
              ₹{Math.round(subtotal)}
            </span>
          </div>

          <button
            onClick={handleNext}
            disabled={selectedServices.length === 0}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition disabled:opacity-40"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
