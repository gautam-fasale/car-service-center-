const express = require('express');
const router = express.Router();
const { getPool } = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');

// Helper to generate readable Booking Code (e.g. CS12345678)
function generateBookingCode() {
  const randomNum = Math.floor(10000000 + Math.random() * 90000000);
  return `CS${randomNum}`;
}

// Helper to check if a date and slot time is in the past
function isTimeSlotPassed(bookingDateStr, timeSlotStr) {
  try {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // If selected date is before today
    if (bookingDateStr < todayStr) {
      return true;
    }

    // If selected date is in the future
    if (bookingDateStr > todayStr) {
      return false;
    }

    // If selected date is today, check slot time
    const [timePart, modifier] = timeSlotStr.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    const slotDateTime = new Date();
    slotDateTime.setHours(hours, minutes, 0, 0);

    return now.getTime() >= slotDateTime.getTime();
  } catch (e) {
    return false;
  }
}

// 1. Create New Booking (Customer)
router.post('/', verifyToken, async (req, res) => {
  try {
    const db = getPool();
    const {
      serviceCenterId,
      vehicleId,
      selectedServices = [],
      bookingDate,
      timeSlot,
      totalAmount,
      paymentMethod = 'UPI',
      notes = ''
    } = req.body;

    if (!serviceCenterId || !vehicleId || !bookingDate || !timeSlot) {
      return res.status(400).json({ success: false, message: 'Missing required booking details' });
    }

    // Restriction check: Cannot book past dates or passed time slots
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    if (bookingDate < todayStr) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking date: You cannot book an appointment for a past date.'
      });
    }

    if (isTimeSlotPassed(bookingDate, timeSlot)) {
      return res.status(400).json({
        success: false,
        message: `Invalid time slot: The ${timeSlot} slot on ${bookingDate} has already passed. Please select an upcoming time slot.`
      });
    }

    const bookingCode = generateBookingCode();
    const primaryServiceId = selectedServices.length > 0 && selectedServices[0].serviceId ? selectedServices[0].serviceId : null;
    const servicesJson = JSON.stringify(selectedServices);

    // Insert booking
    const [bRes] = await db.query(
      `INSERT INTO bookings (BookingCode, UserID, VehicleID, ServiceCenterID, ServiceID, SelectedServices, BookingDate, TimeSlot, Status, TotalAmount, Notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Upcoming', ?, ?)`,
      [
        bookingCode,
        req.user.userId,
        vehicleId,
        serviceCenterId,
        primaryServiceId,
        servicesJson,
        bookingDate,
        timeSlot,
        parseFloat(totalAmount || 0),
        notes
      ]
    );

    const bookingId = bRes.insertId;

    // Generate Transaction ID & Create Payment Record
    const transactionId = `TXN_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    await db.query(
      `INSERT INTO payments (BookingID, Amount, PaymentMethod, TransactionID, PaymentStatus)
       VALUES (?, ?, ?, ?, 'Success')`,
      [bookingId, parseFloat(totalAmount || 0), paymentMethod, transactionId]
    );

    // Fetch full created booking details
    const [created] = await db.query(
      `SELECT b.*, sc.Name as CenterName, sc.Address as CenterAddress, sc.Phone as CenterPhone,
              v.Brand as VehicleBrand, v.Model as VehicleModel, v.RegistrationNo as VehicleReg
       FROM bookings b
       JOIN service_centers sc ON b.ServiceCenterID = sc.ServiceCenterID
       JOIN vehicles v ON b.VehicleID = v.VehicleID
       WHERE b.BookingID = ?`,
      [bookingId]
    );

    res.status(201).json({
      success: true,
      message: 'Booking created successfully!',
      data: {
        ...created[0],
        transactionId
      }
    });
  } catch (err) {
    console.error('Create booking error:', err);
    res.status(500).json({ success: false, message: 'Failed to complete booking' });
  }
});

// 2. Get Customer's Bookings
router.get('/my', verifyToken, async (req, res) => {
  try {
    const db = getPool();
    const { status } = req.query;

    let query = `
      SELECT b.*, sc.Name as CenterName, sc.Type as CenterType, sc.Address as CenterAddress, sc.Phone as CenterPhone, sc.Image as CenterImage,
             v.Brand as VehicleBrand, v.Model as VehicleModel, v.RegistrationNo as VehicleReg, v.VehicleType,
             p.PaymentMethod, p.PaymentStatus, p.TransactionID
      FROM bookings b
      JOIN service_centers sc ON b.ServiceCenterID = sc.ServiceCenterID
      JOIN vehicles v ON b.VehicleID = v.VehicleID
      LEFT JOIN payments p ON b.BookingID = p.BookingID
      WHERE b.UserID = ?
    `;
    const params = [req.user.userId];

    if (status && status !== 'All') {
      if (status === 'Upcoming') {
        query += ' AND b.Status IN ("Upcoming", "In Progress")';
      } else if (status === 'Past' || status === 'Completed') {
        query += ' AND b.Status = "Completed"';
      } else if (status === 'Cancelled') {
        query += ' AND b.Status = "Cancelled"';
      }
    }

    query += ' ORDER BY b.BookingDate DESC, b.BookingID DESC';

    const [rows] = await db.query(query, params);
    
    rows.forEach(r => {
      try {
        r.selectedServices = r.SelectedServices ? JSON.parse(r.SelectedServices) : [];
      } catch (e) {
        r.selectedServices = [];
      }
    });

    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('Get my bookings error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
});

// 3. Get Partner's Bookings
router.get('/center', verifyToken, requireRole('ServiceCenter', 'Admin'), async (req, res) => {
  try {
    const db = getPool();
    const { status, search, centerId } = req.query;

    let targetCenterId = centerId;
    if (req.user.userType === 'ServiceCenter') {
      const [c] = await db.query('SELECT ServiceCenterID FROM service_centers WHERE UserID = ?', [req.user.userId]);
      if (c.length === 0) {
        return res.json({ success: true, count: 0, data: [] });
      }
      targetCenterId = c[0].ServiceCenterID;
    }

    let query = `
      SELECT b.*, u.FullName as CustomerName, u.Mobile as CustomerMobile, u.Email as CustomerEmail,
             v.Brand as VehicleBrand, v.Model as VehicleModel, v.RegistrationNo as VehicleReg,
             sc.Name as CenterName, p.PaymentMethod, p.PaymentStatus, p.TransactionID
      FROM bookings b
      JOIN users u ON b.UserID = u.UserID
      JOIN vehicles v ON b.VehicleID = v.VehicleID
      JOIN service_centers sc ON b.ServiceCenterID = sc.ServiceCenterID
      LEFT JOIN payments p ON b.BookingID = p.BookingID
      WHERE 1=1
    `;
    const params = [];

    if (targetCenterId) {
      query += ' AND b.ServiceCenterID = ?';
      params.push(targetCenterId);
    }

    if (status && status !== 'All') {
      query += ' AND b.Status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (u.FullName LIKE ? OR u.Mobile LIKE ? OR b.BookingCode LIKE ? OR v.RegistrationNo LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    query += ' ORDER BY b.BookingDate DESC, b.BookingID DESC';

    const [rows] = await db.query(query, params);
    rows.forEach(r => {
      try {
        r.selectedServices = r.SelectedServices ? JSON.parse(r.SelectedServices) : [];
      } catch (e) {
        r.selectedServices = [];
      }
    });

    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('Get partner bookings error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch partner bookings' });
  }
});

// 4. Get Single Booking by ID or Code
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const db = getPool();
    const idOrCode = req.params.id;

    const [rows] = await db.query(
      `SELECT b.*, u.FullName as CustomerName, u.Mobile as CustomerMobile, u.Email as CustomerEmail,
              sc.Name as CenterName, sc.Address as CenterAddress, sc.Phone as CenterPhone, sc.Type as CenterType,
              v.Brand as VehicleBrand, v.Model as VehicleModel, v.RegistrationNo as VehicleReg, v.VehicleType,
              p.PaymentMethod, p.PaymentStatus, p.TransactionID, p.PaymentDate
       FROM bookings b
       JOIN users u ON b.UserID = u.UserID
       JOIN service_centers sc ON b.ServiceCenterID = sc.ServiceCenterID
       JOIN vehicles v ON b.VehicleID = v.VehicleID
       LEFT JOIN payments p ON b.BookingID = p.BookingID
       WHERE b.BookingID = ? OR b.BookingCode = ?`,
      [idOrCode, idOrCode]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const booking = rows[0];
    try {
      booking.selectedServices = booking.SelectedServices ? JSON.parse(booking.SelectedServices) : [];
    } catch (e) {
      booking.selectedServices = [];
    }

    res.json({ success: true, data: booking });
  } catch (err) {
    console.error('Get booking error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch booking details' });
  }
});

// 5. Update Booking Status (Partner or Admin)
router.patch('/:id/status', verifyToken, requireRole('ServiceCenter', 'Admin'), async (req, res) => {
  try {
    const db = getPool();
    const bookingId = req.params.id;
    const { status } = req.body;

    const validStatuses = ['Upcoming', 'In Progress', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    await db.query('UPDATE bookings SET Status = ? WHERE BookingID = ?', [status, bookingId]);

    res.json({ success: true, message: `Booking status updated to ${status}` });
  } catch (err) {
    console.error('Update booking status error:', err);
    res.status(500).json({ success: false, message: 'Failed to update booking status' });
  }
});

// 6. Cancel Booking (Customer)
router.post('/:id/cancel', verifyToken, async (req, res) => {
  try {
    const db = getPool();
    const bookingId = req.params.id;
    const { reason = 'Cancelled by customer' } = req.body;

    const [rows] = await db.query(
      'SELECT * FROM bookings WHERE BookingID = ? AND UserID = ?',
      [bookingId, req.user.userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found or not owned by you' });
    }

    if (rows[0].Status === 'Completed') {
      return res.status(400).json({ success: false, message: 'Cannot cancel an already completed service' });
    }

    await db.query('UPDATE bookings SET Status = "Cancelled", Notes = CONCAT(COALESCE(Notes, ""), " | Cancel Reason: ", ?) WHERE BookingID = ?', [reason, bookingId]);

    res.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (err) {
    console.error('Cancel booking error:', err);
    res.status(500).json({ success: false, message: 'Failed to cancel booking' });
  }
});

module.exports = router;
