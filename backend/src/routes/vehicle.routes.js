const express = require('express');
const router = express.Router();
const { getPool } = require('../config/db');
const { verifyToken } = require('../middleware/auth');

// 1. Get logged-in user's vehicles
router.get('/my', verifyToken, async (req, res) => {
  try {
    const db = getPool();
    const [rows] = await db.query(
      'SELECT * FROM vehicles WHERE UserID = ? ORDER BY CreatedAt DESC',
      [req.user.userId]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Fetch vehicles error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch vehicles' });
  }
});

// 2. Add New Vehicle
router.post('/', verifyToken, async (req, res) => {
  try {
    const db = getPool();
    const { vehicleType = '4W', brand, model, registrationNo, year = 2022 } = req.body;

    if (!brand || !model || !registrationNo) {
      return res.status(400).json({ success: false, message: 'Brand, model, and registration number are required' });
    }

    const [existing] = await db.query('SELECT VehicleID FROM vehicles WHERE RegistrationNo = ?', [registrationNo.toUpperCase()]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Vehicle with this registration number already exists' });
    }

    const [result] = await db.query(
      'INSERT INTO vehicles (UserID, VehicleType, Brand, Model, RegistrationNo, Year) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.userId, vehicleType, brand, model, registrationNo.toUpperCase(), parseInt(year, 10)]
    );

    res.status(201).json({
      success: true,
      message: 'Vehicle added successfully',
      data: {
        vehicleId: result.insertId,
        vehicleType,
        brand,
        model,
        registrationNo: registrationNo.toUpperCase(),
        year
      }
    });
  } catch (err) {
    console.error('Add vehicle error:', err);
    res.status(500).json({ success: false, message: 'Failed to add vehicle' });
  }
});

// 3. Delete Vehicle
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const db = getPool();
    const vehicleId = req.params.id;

    await db.query('DELETE FROM vehicles WHERE VehicleID = ? AND UserID = ?', [vehicleId, req.user.userId]);
    res.json({ success: true, message: 'Vehicle removed successfully' });
  } catch (err) {
    console.error('Delete vehicle error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete vehicle' });
  }
});

module.exports = router;
