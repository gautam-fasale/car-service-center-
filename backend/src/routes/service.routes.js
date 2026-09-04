const express = require('express');
const router = express.Router();
const { getPool } = require('../config/db');
const { verifyToken, requireRole } = require('../middleware/auth');

// 1. Get services by Service Center ID
router.get('/center/:centerId', async (req, res) => {
  try {
    const db = getPool();
    const [rows] = await db.query(
      'SELECT * FROM services WHERE ServiceCenterID = ? ORDER BY Price ASC',
      [req.params.centerId]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Fetch services error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch services' });
  }
});

// 2. Add New Service (Partner or Admin)
router.post('/', verifyToken, requireRole('ServiceCenter', 'Admin'), async (req, res) => {
  try {
    const db = getPool();
    const { serviceCenterId, serviceName, description, price, duration = 45 } = req.body;

    if (!serviceName || !price) {
      return res.status(400).json({ success: false, message: 'Service name and price are required' });
    }

    let targetCenterId = serviceCenterId;
    if (req.user.userType === 'ServiceCenter') {
      const [c] = await db.query('SELECT ServiceCenterID FROM service_centers WHERE UserID = ?', [req.user.userId]);
      if (c.length === 0) {
        return res.status(400).json({ success: false, message: 'No associated service center found' });
      }
      targetCenterId = c[0].ServiceCenterID;
    }

    const [result] = await db.query(
      'INSERT INTO services (ServiceCenterID, ServiceName, Description, Price, Duration) VALUES (?, ?, ?, ?, ?)',
      [targetCenterId, serviceName, description || '', parseFloat(price), parseInt(duration, 10)]
    );

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: {
        serviceId: result.insertId,
        serviceName,
        description,
        price,
        duration
      }
    });
  } catch (err) {
    console.error('Create service error:', err);
    res.status(500).json({ success: false, message: 'Failed to create service' });
  }
});

// 3. Update Service (Partner or Admin)
router.put('/:id', verifyToken, requireRole('ServiceCenter', 'Admin'), async (req, res) => {
  try {
    const db = getPool();
    const serviceId = req.params.id;
    const { serviceName, description, price, duration } = req.body;

    await db.query(
      `UPDATE services 
       SET ServiceName = COALESCE(?, ServiceName),
           Description = COALESCE(?, Description),
           Price = COALESCE(?, Price),
           Duration = COALESCE(?, Duration)
       WHERE ServiceID = ?`,
      [serviceName, description, price, duration, serviceId]
    );

    res.json({ success: true, message: 'Service updated successfully' });
  } catch (err) {
    console.error('Update service error:', err);
    res.status(500).json({ success: false, message: 'Failed to update service' });
  }
});

// 4. Delete Service (Partner or Admin)
router.delete('/:id', verifyToken, requireRole('ServiceCenter', 'Admin'), async (req, res) => {
  try {
    const db = getPool();
    const serviceId = req.params.id;

    await db.query('DELETE FROM services WHERE ServiceID = ?', [serviceId]);
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (err) {
    console.error('Delete service error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete service' });
  }
});

module.exports = router;
