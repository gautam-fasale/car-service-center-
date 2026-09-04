const express = require('express');
const router = express.Router();
const { getPool } = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');

// 1. Get All Local Service Centers (with filters)
router.get('/', async (req, res) => {
  try {
    const db = getPool();
    const { type, filter, search, city } = req.query;

    let query = 'SELECT * FROM service_centers WHERE 1=1';
    const params = [];

    if (type === 'Mobile' || filter === 'Mobile') {
      query += ' AND Type = "Mobile"';
    } else if (filter === 'Open') {
      query += ' AND OpenStatus = 1';
    } else if (filter === 'TopRated') {
      query += ' AND Rating >= 4.5';
    }

    if (city) {
      query += ' AND City = ?';
      params.push(city);
    }

    if (search) {
      query += ' AND (Name LIKE ? OR Address LIKE ? OR City LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    query += ' ORDER BY Rating DESC, ServiceCenterID ASC';

    const [centers] = await db.query(query, params);

    // Attach popular services sample for each center
    for (const c of centers) {
      const [services] = await db.query(
        'SELECT ServiceID, ServiceName, Price, Duration FROM services WHERE ServiceCenterID = ? LIMIT 4',
        [c.ServiceCenterID]
      );
      c.services = services;
    }

    res.json({ success: true, count: centers.length, data: centers });
  } catch (err) {
    console.error('Fetch service centers error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch service centers' });
  }
});

// 2. Get Single Service Center Details
router.get('/:id', async (req, res) => {
  try {
    const db = getPool();
    const centerId = req.params.id;

    const [centers] = await db.query('SELECT * FROM service_centers WHERE ServiceCenterID = ?', [centerId]);
    if (centers.length === 0) {
      return res.status(404).json({ success: false, message: 'Service center not found' });
    }

    const center = centers[0];

    // Fetch services offered by this center
    const [services] = await db.query(
      'SELECT * FROM services WHERE ServiceCenterID = ? ORDER BY Price ASC',
      [centerId]
    );
    center.services = services;

    // Fetch reviews with user full names
    const [reviews] = await db.query(
      `SELECT r.ReviewID, r.Rating, r.Comment, r.ReviewDate, u.FullName, u.UserID
       FROM reviews r
       JOIN users u ON r.UserID = u.UserID
       WHERE r.ServiceCenterID = ?
       ORDER BY r.ReviewDate DESC`,
      [centerId]
    );
    center.reviews = reviews;

    res.json({ success: true, data: center });
  } catch (err) {
    console.error('Fetch service center detail error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch service center details' });
  }
});

// 3. Update Service Center Availability (Partner / Admin)
router.patch('/:id/availability', verifyToken, async (req, res) => {
  try {
    const db = getPool();
    const centerId = req.params.id;
    const { openStatus, workingHours, breakTime, availableDays } = req.body;

    const [centers] = await db.query('SELECT * FROM service_centers WHERE ServiceCenterID = ?', [centerId]);
    if (centers.length === 0) {
      return res.status(404).json({ success: false, message: 'Service center not found' });
    }

    const center = centers[0];
    if (req.user.userType !== 'Admin' && center.UserID !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this service center' });
    }

    await db.query(
      `UPDATE service_centers 
       SET OpenStatus = COALESCE(?, OpenStatus),
           WorkingHours = COALESCE(?, WorkingHours),
           BreakTime = COALESCE(?, BreakTime),
           AvailableDays = COALESCE(?, AvailableDays)
       WHERE ServiceCenterID = ?`,
      [
        openStatus !== undefined ? (openStatus ? 1 : 0) : null,
        workingHours || null,
        breakTime || null,
        availableDays || null,
        centerId
      ]
    );

    res.json({ success: true, message: 'Availability updated successfully' });
  } catch (err) {
    console.error('Update availability error:', err);
    res.status(500).json({ success: false, message: 'Failed to update availability' });
  }
});

// 4. Update Service Center Profile Details
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const db = getPool();
    const centerId = req.params.id;
    const { name, type, brand, address, city, pincode, phone, workingHours } = req.body;

    const [centers] = await db.query('SELECT * FROM service_centers WHERE ServiceCenterID = ?', [centerId]);
    if (centers.length === 0) {
      return res.status(404).json({ success: false, message: 'Service center not found' });
    }

    const center = centers[0];
    if (req.user.userType !== 'Admin' && center.UserID !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await db.query(
      `UPDATE service_centers 
       SET Name = COALESCE(?, Name),
           Type = COALESCE(?, Type),
           Brand = COALESCE(?, Brand),
           Address = COALESCE(?, Address),
           City = COALESCE(?, City),
           Pincode = COALESCE(?, Pincode),
           Phone = COALESCE(?, Phone),
           WorkingHours = COALESCE(?, WorkingHours)
       WHERE ServiceCenterID = ?`,
      [name, type, brand, address, city, pincode, phone, workingHours, centerId]
    );

    res.json({ success: true, message: 'Service center updated successfully' });
  } catch (err) {
    console.error('Update service center error:', err);
    res.status(500).json({ success: false, message: 'Failed to update service center' });
  }
});

// 5. Add New Local Service Center (Admin)
router.post('/', verifyToken, requireRole('Admin'), async (req, res) => {
  try {
    const db = getPool();
    const { name, type = 'Non-Branded', brand = 'All Multi-Brand', address, city = 'Pune', pincode = '411001', phone, workingHours = '09:00 AM - 08:00 PM', image } = req.body;

    if (!name || !address || !phone) {
      return res.status(400).json({ success: false, message: 'Name, address, and phone are required' });
    }

    const [result] = await db.query(
      `INSERT INTO service_centers (Name, Type, Brand, Address, City, Pincode, Phone, WorkingHours, OpenStatus, Rating, ReviewCount, Image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 4.5, 0, ?)`,
      [name, type, brand, address, city, pincode, phone, workingHours, image || 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800&auto=format&fit=crop&q=80']
    );

    const centerId = result.insertId;

    // Seed standard service menu
    const defaultServices = [
      ['General Service & Tune-Up', 'Complete multi-point check, fluid top-up & tune-up', 1299.00, 60],
      ['Engine Oil & Filter Change', 'High-grade engine oil replacement & flush', 649.00, 30],
      ['Brake Inspection & Service', 'Front/rear brake pad check & cleaning', 999.00, 45],
      ['Car AC Cooling Service', 'AC filter cleaning & gas pressure check', 1099.00, 45],
      ['Full Foam Wash', 'Pressure foam wash & interior vacuum', 449.00, 30]
    ];
    for (const s of defaultServices) {
      await db.query(
        'INSERT INTO services (ServiceCenterID, ServiceName, Description, Price, Duration) VALUES (?, ?, ?, ?, ?)',
        [centerId, ...s]
      );
    }

    res.status(201).json({ success: true, message: 'Local Service Center added successfully', centerId });
  } catch (err) {
    console.error('Create service center error:', err);
    res.status(500).json({ success: false, message: 'Failed to create service center' });
  }
});

// 6. Delete Service Center (Admin)
router.delete('/:id', verifyToken, requireRole('Admin'), async (req, res) => {
  try {
    const db = getPool();
    const centerId = req.params.id;

    await db.query('DELETE FROM service_centers WHERE ServiceCenterID = ?', [centerId]);
    res.json({ success: true, message: 'Service center deleted successfully' });
  } catch (err) {
    console.error('Delete service center error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete service center' });
  }
});

module.exports = router;
