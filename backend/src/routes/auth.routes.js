const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getPool } = require('../config/db');
const { verifyToken, JWT_SECRET } = require('../middleware/auth');

// 1. Register User (Customer or ServiceCenter Partner)
router.post('/register', async (req, res) => {
  try {
    const db = getPool();
    const { fullName, mobile, email, password, userType = 'Customer', centerName, address, city } = req.body;

    if (!fullName || !mobile || !email || !password) {
      return res.status(400).json({ success: false, message: 'All required fields must be filled' });
    }

    // Check existing email or mobile
    const [existing] = await db.query(
      'SELECT UserID FROM users WHERE Email = ? OR Mobile = ?',
      [email, mobile]
    );
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email or Mobile number already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (FullName, Mobile, Email, Password, UserType) VALUES (?, ?, ?, ?, ?)',
      [fullName, mobile, email, hashedPassword, userType]
    );

    const userId = result.insertId;

    // If registering as ServiceCenter partner, create the linked service center record
    let centerId = null;
    if (userType === 'ServiceCenter') {
      const [centerRes] = await db.query(
        `INSERT INTO service_centers (UserID, Name, Type, Address, City, Phone, OpenStatus)
         VALUES (?, ?, 'Non-Branded', ?, ?, ?, 1)`,
        [userId, centerName || `${fullName}'s Service Hub`, address || 'City Road', city || 'Pune', mobile]
      );
      centerId = centerRes.insertId;

      // Seed default basic services
      const defaultServices = [
        ['General Service', 'Basic car service & inspection', 1499.00, 60],
        ['Oil Change', 'Engine oil and filter change', 699.00, 30],
        ['Brake Service', 'Brake pad inspection and cleaning', 1299.00, 60],
        ['Car Wash', 'Full water wash & vacuum', 499.00, 30]
      ];
      for (const s of defaultServices) {
        await db.query(
          'INSERT INTO services (ServiceCenterID, ServiceName, Description, Price, Duration) VALUES (?, ?, ?, ?, ?)',
          [centerId, ...s]
        );
      }
    }

    const token = jwt.sign(
      { userId, fullName, email, mobile, userType, centerId },
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
        email,
        mobile,
        userType,
        centerId
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Internal server error during registration' });
  }
});

// 2. Login User
router.post('/login', async (req, res) => {
  try {
    const db = getPool();
    const { identifier, email, mobile, password, userType } = req.body;
    const loginId = identifier || email || mobile;

    if (!loginId || !password) {
      return res.status(400).json({ success: false, message: 'Please provide Email/Mobile and Password' });
    }

    let query = 'SELECT * FROM users WHERE Email = ? OR Mobile = ?';
    let params = [loginId, loginId];

    if (userType) {
      query += ' AND UserType = ?';
      params.push(userType);
    }

    const [rows] = await db.query(query, params);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials or account does not exist' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.Password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
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
      return res.status(404).json({ success: false, message: 'Demo user not found' });
    }

    const user = rows[0];
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
      message: `Switched to ${user.UserType} Demo Account`,
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
    res.status(500).json({ success: false, message: 'Failed demo login' });
  }
});

// 4. Get Current User Profile
router.get('/me', verifyToken, async (req, res) => {
  try {
    const db = getPool();
    const [rows] = await db.query(
      'SELECT UserID as userId, FullName as fullName, Mobile as mobile, Email as email, UserType as userType, CreatedAt as createdAt FROM users WHERE UserID = ?',
      [req.user.userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = rows[0];
    let center = null;
    if (user.userType === 'ServiceCenter') {
      const [cRows] = await db.query('SELECT * FROM service_centers WHERE UserID = ?', [user.userId]);
      if (cRows.length > 0) {
        center = cRows[0];
      }
    }

    res.json({ success: true, user: { ...user, center } });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
});

// 5. Update Profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const db = getPool();
    const { fullName, mobile } = req.body;

    await db.query(
      'UPDATE users SET FullName = COALESCE(?, FullName), Mobile = COALESCE(?, Mobile) WHERE UserID = ?',
      [fullName, mobile, req.user.userId]
    );

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

module.exports = router;
