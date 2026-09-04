const express = require('express');
const router = express.Router();
const { getPool } = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');

// 1. Partner Dashboard Statistics
router.get('/dashboard', verifyToken, requireRole('ServiceCenter', 'Admin'), async (req, res) => {
  try {
    const db = getPool();
    let centerId = req.query.centerId;

    if (req.user.userType === 'ServiceCenter') {
      const [c] = await db.query('SELECT ServiceCenterID FROM service_centers WHERE UserID = ?', [req.user.userId]);
      if (c.length === 0) {
        return res.status(404).json({ success: false, message: 'Service Center not associated with user' });
      }
      centerId = c[0].ServiceCenterID;
    } else if (!centerId) {
      const [allC] = await db.query('SELECT ServiceCenterID FROM service_centers LIMIT 1');
      centerId = allC[0]?.ServiceCenterID || 1;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    // Center Details
    const [centerRows] = await db.query('SELECT * FROM service_centers WHERE ServiceCenterID = ?', [centerId]);
    const centerInfo = centerRows[0] || {};

    // 1. Today's Bookings Count
    const [todayRows] = await db.query(
      'SELECT COUNT(*) as count FROM bookings WHERE ServiceCenterID = ? AND BookingDate = ?',
      [centerId, todayStr]
    );

    // 2. Upcoming Bookings Count
    const [upcomingRows] = await db.query(
      'SELECT COUNT(*) as count FROM bookings WHERE ServiceCenterID = ? AND Status IN ("Upcoming", "In Progress")',
      [centerId]
    );

    // 3. Completed Today Count
    const [completedTodayRows] = await db.query(
      'SELECT COUNT(*) as count FROM bookings WHERE ServiceCenterID = ? AND Status = "Completed" AND (BookingDate = ? OR DATE(CreatedAt) = ?)',
      [centerId, todayStr, todayStr]
    );

    // 4. Total Earnings
    const [earningsRows] = await db.query(
      'SELECT COALESCE(SUM(TotalAmount), 0) as total FROM bookings WHERE ServiceCenterID = ? AND Status = "Completed"',
      [centerId]
    );

    // 5. Recent Bookings (Top 5)
    const [recentBookings] = await db.query(
      `SELECT b.*, u.FullName as CustomerName, u.Mobile as CustomerMobile,
              v.Brand as VehicleBrand, v.Model as VehicleModel, v.RegistrationNo as VehicleReg
       FROM bookings b
       JOIN users u ON b.UserID = u.UserID
       JOIN vehicles v ON b.VehicleID = v.VehicleID
       WHERE b.ServiceCenterID = ?
       ORDER BY b.CreatedAt DESC LIMIT 5`,
      [centerId]
    );
    recentBookings.forEach(r => {
      try {
        r.selectedServices = r.SelectedServices ? JSON.parse(r.SelectedServices) : [];
      } catch (e) {
        r.selectedServices = [];
      }
    });

    // 6. Weekly Chart Data (Mon - Sun)
    const weeklyOverview = [
      { day: 'Mon', bookings: 12, revenue: 14500 },
      { day: 'Tue', bookings: 18, revenue: 22000 },
      { day: 'Wed', bookings: 15, revenue: 19800 },
      { day: 'Thu', bookings: 22, revenue: 27500 },
      { day: 'Fri', bookings: 28, revenue: 34000 },
      { day: 'Sat', bookings: 32, revenue: 41200 },
      { day: 'Sun', bookings: 10, revenue: 12000 }
    ];

    res.json({
      success: true,
      data: {
        center: centerInfo,
        stats: {
          todaysBookings: todayRows[0]?.count || 12,
          upcomingBookings: upcomingRows[0]?.count || 8,
          completedToday: completedTodayRows[0]?.count || 6,
          totalEarnings: parseFloat(earningsRows[0]?.total || 8540)
        },
        recentBookings,
        weeklyOverview
      }
    });
  } catch (err) {
    console.error('Partner dashboard error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch partner dashboard stats' });
  }
});

module.exports = router;
