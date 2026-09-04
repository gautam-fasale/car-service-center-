import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [vehicleType, setVehicleType] = useState('4W'); // '2W' | '4W'
  const [selectedBrand, setSelectedBrand] = useState('Hyundai');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [bookingDate, setBookingDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:00 AM');
  const [notes, setNotes] = useState('');

  // Service toggle helper
  const toggleService = (service) => {
    setSelectedServices((prev) => {
      const exists = prev.find((s) => s.ServiceID === service.ServiceID || s.serviceId === service.ServiceID);
      if (exists) {
        return prev.filter((s) => (s.ServiceID || s.serviceId) !== service.ServiceID);
      } else {
        return [...prev, {
          serviceId: service.ServiceID,
          name: service.ServiceName,
          price: parseFloat(service.Price || service.price || 0),
          duration: service.Duration || 45
        }];
      }
    });
  };

  const isServiceSelected = (serviceId) => {
    return selectedServices.some((s) => (s.serviceId || s.ServiceID) === serviceId);
  };

  // Pricing calculations
  const subtotal = selectedServices.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  const convenienceFee = subtotal > 0 ? 0 : 0;
  const estimatedTotal = subtotal + convenienceFee;

  const resetBooking = () => {
    setSelectedServices([]);
    setBookingDate('');
    setTimeSlot('10:00 AM');
    setNotes('');
  };

  return (
    <BookingContext.Provider
      value={{
        vehicleType,
        setVehicleType,
        selectedBrand,
        setSelectedBrand,
        selectedVehicle,
        setSelectedVehicle,
        selectedCenter,
        setSelectedCenter,
        selectedServices,
        setSelectedServices,
        toggleService,
        isServiceSelected,
        bookingDate,
        setBookingDate,
        timeSlot,
        setTimeSlot,
        notes,
        setNotes,
        subtotal,
        convenienceFee,
        estimatedTotal,
        resetBooking
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
