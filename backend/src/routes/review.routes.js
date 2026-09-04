const express = require('express');
const router = express.Router();
const { getPool } = require('../config/db');
const { verifyToken } = require('../middleware/auth');

// 1. Submit a review for a Service Center
router.post('/', verifyToken, async (req, res) => {
  try {
    const db = getPool();
    const { serviceCenterId, rating, comment } = req.body;

    if (!serviceCenterId || !rating) {
      return res.status(400).json({ success: false, message: 'Service Center ID and Rating (1-5) are required' });
    }

    const numRating = parseInt(rating, 10);
    if (numRating < 1 || numRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    await db.query(
      'INSERT INTO reviews (UserID, ServiceCenterID, Rating, Comment) VALUES (?, ?, ?, ?)',
      [req.user.userId, serviceCenterId, numRating, comment || '']
    );

    // Update the average rating & review count for the service center
    const [stats] = await db.query(
      'SELECT AVG(Rating) as avgRating, COUNT(*) as reviewCount FROM reviews WHERE ServiceCenterID = ?',
      [serviceCenterId]
    );

    const avg = parseFloat(stats[0].avgRating || 4.5).toFixed(1);
    const count = parseInt(stats[0].reviewCount || 1, 10);

    await db.query(
      'UPDATE service_centers SET Rating = ?, ReviewCount = ? WHERE ServiceCenterID = ?',
      [avg, count, serviceCenterId]
    );

    res.status(201).json({ success: true, message: 'Review submitted successfully!' });
  } catch (err) {
    console.error('Submit review error:', err);
    res.status(500).json({ success: false, message: 'Failed to submit review' });
  }
});

// 2. Get reviews for a Service Center
router.get('/:centerId', async (req, res) => {
  try {
    const db = getPool();
    const [rows] = await db.query(
      `SELECT r.ReviewID, r.Rating, r.Comment, r.ReviewDate, u.FullName, u.UserID
       FROM reviews r
       JOIN users u ON r.UserID = u.UserID
       WHERE r.ServiceCenterID = ?
       ORDER BY r.ReviewDate DESC`,
      [req.params.centerId]
    );
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('Get reviews error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
});

module.exports = router;
