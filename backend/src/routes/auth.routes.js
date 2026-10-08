const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getPool } = require('../config/db');
const { verifyToken } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'carserv_super_secret_jwt_key_2026';

// 1. Register New User (Customer or Partner)
router.post('/register', async (req, res) => {
  try {
    const db = getPool();
    const { fullName, mobile, email, password, userType = 'Customer', centerName, address, city } = req.body;

    if (!fullName || !mobile || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanMobile = mobile.trim();

    // Check if user already exists
    const [existing] = await db.query(
      'SELECT UserID FROM users WHERE LOWER(TRIM(Email)) = ? OR TRIM(Mobile) = ?',
      [cleanEmail, cleanMobile]
    );
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'User with this email or mobile already exists' });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const [userRes] = await db.query(
      'INSERT INTO users (FullName, Mobile, Email, Password, UserType) VALUES (?, ?, ?, ?, ?)',
      [fullName.trim(), cleanMobile, cleanEmail, hashedPassword, userType]
    );

    const userId = userRes.insertId;

    // If registering as ServiceCenter partner, create the linked service center record
    let centerId = null;
    if (userType === 'ServiceCenter') {
      const [centerRes] = await db.query(
        `INSERT INTO service_centers (UserID, Name, Type, Address, City, Phone, OpenStatus, Rating, ReviewCount)
         VALUES (?, ?, 'Non-Branded', ?, ?, ?, 1, 4.5, 0)`,
        [userId, centerName || `${fullName}'s Service Hub`, address || 'City Road', city || 'Pune', cleanMobile]
      );
      centerId = centerRes.insertId;

      // Seed default basic services
      const defaultServices = [
        ['General Service & Tune-Up', 'Basic car service & inspection', 1299.00, 60],
        ['Engine Oil & Filter Change', 'Engine oil and filter change', 649.00, 30],
        ['Brake Inspection & Service', 'Brake pad inspection and cleaning', 999.00, 60],
        ['Full Foam Wash', 'Full water wash & vacuum', 449.00, 30]
      ];
      for (const s of defaultServices) {
        await db.query(
          'INSERT INTO services (ServiceCenterID, ServiceName, Description, Price, Duration) VALUES (?, ?, ?, ?, ?)',
          [centerId, ...s]
        );
      }
    }

    const token = jwt.sign(
      { userId, fullName, email: cleanEmail, mobile: cleanMobile, userType, centerId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        userId,
        fullName,
        email: cleanEmail,
        mobile: cleanMobile,
        userType,
        centerId
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Internal server error during registration' });
  }
});

// 2. Login User (Customer, Partner, Admin)
router.post('/login', async (req, res) => {
  try {
    const db = getPool();
    const { identifier, email, mobile, password, userType } = req.body;
    const rawLoginId = (identifier || email || mobile || '').trim();
    const rawPassword = (password || '').trim();

    if (!rawLoginId || !rawPassword) {
      return res.status(400).json({ success: false, message: 'Please provide Email/Mobile and Password' });
    }

    let query = 'SELECT * FROM users WHERE (LOWER(TRIM(Email)) = LOWER(?) OR TRIM(Mobile) = ?)';
    let params = [rawLoginId, rawLoginId];

    if (userType) {
      if (userType === 'Partner' || userType === 'ServiceCenter') {
        query += ' AND UserType = "ServiceCenter"';
      } else {
        query += ' AND UserType = ?';
        params.push(userType);
      }
    }

    const [rows] = await db.query(query, params);
    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or account does not exist for this portal.'
      });
    }

    const user = rows[0];
    const match = await bcrypt.compare(rawPassword, user.Password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
    }

    let centerId = null;
    if (user.UserType === 'ServiceCenter') {
      const [cRows] = await db.query('SELECT ServiceCenterID FROM service_centers WHERE UserID = ?', [user.UserID]);
      if (cRows.length > 0) {
        centerId = cRows[0].ServiceCenterID;
      }
    }

    const token = jwt.sign(
      {
        userId: user.UserID,
        fullName: user.FullName,
        email: user.Email,
        mobile: user.Mobile,
        userType: user.UserType,
        centerId
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        userId: user.UserID,
        fullName: user.FullName,
        email: user.Email,
        mobile: user.Mobile,
        userType: user.UserType,
        centerId
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Internal server error during login' });
  }
});

// 3. Quick Demo Login (Customer, Partner, Admin)
router.post('/demo-login', async (req, res) => {
  try {
    const db = getPool();
    const { role = 'Customer' } = req.body;

    let emailToFind = 'rohan@example.com';
    if (role === 'ServiceCenter' || role === 'Partner') {
      emailToFind = 'shreeauto@example.com';
    } else if (role === 'Admin') {
      emailToFind = 'admin@carserv.com';
    }

    const [rows] = await db.query('SELECT * FROM users WHERE Email = ?', [emailToFind]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Demo user account not found' });
    }

    const user = rows[0];
    let centerId = null;
    if (user.UserType === 'ServiceCenter') {
      const [cRows] = await db.query('SELECT ServiceCenterID FROM service_centers WHERE UserID = ?', [user.UserID]);
      if (cRows.length > 0) centerId = cRows[0].ServiceCenterID;
    }

    const token = jwt.sign(
      {
        userId: user.UserID,
        fullName: user.FullName,
        email: user.Email,
        mobile: user.Mobile,
        userType: user.UserType,
        centerId
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Demo login successful',
      token,
      user: {
        userId: user.UserID,
        fullName: user.FullName,
        email: user.Email,
        mobile: user.Mobile,
        userType: user.UserType,
        centerId
      }
    });
  } catch (err) {
    console.error('Demo login error:', err);
    res.status(500).json({ success: false, message: 'Demo login failed' });
  }
});

// 4. Get Current User Profile (Token Verified)
router.get('/me', verifyToken, async (req, res) => {
  try {
    const db = getPool();
    const [rows] = await db.query(
      'SELECT UserID, FullName, Mobile, Email, UserType, CreatedAt FROM users WHERE UserID = ?',
      [req.user.userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = rows[0];
    let center = null;

    if (user.UserType === 'ServiceCenter') {
      const [cRows] = await db.query('SELECT * FROM service_centers WHERE UserID = ?', [user.UserID]);
      if (cRows.length > 0) {
        center = cRows[0];
      }
    }

    res.json({
      success: true,
      user: {
        userId: user.UserID,
        fullName: user.FullName,
        mobile: user.Mobile,
        email: user.Email,
        userType: user.UserType,
        createdAt: user.CreatedAt,
        centerId: center ? center.ServiceCenterID : null,
        center
      }
    });
  } catch (err) {
    console.error('Fetch me error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch user profile' });
  }
});

module.exports = router;
