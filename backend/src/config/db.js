const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  multipleStatements: true,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool = null;

async function initDB(forceReseed = false) {
  try {
    // 1. Connect without database to ensure DB exists
    const rootConn = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password
    });

    const dbName = process.env.DB_NAME || 'carserv_db';
    await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await rootConn.end();

    // 2. Create connection pool to the database
    pool = mysql.createPool({
      ...dbConfig,
      database: dbName
    });

    console.log(`[Database] Connected to MySQL database: ${dbName}`);

    // 3. Execute schema definitions
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    await pool.query(schemaSQL);

    // 4. Check if seed data exists or if forced reseed
    const [userRows] = await pool.query('SELECT COUNT(*) as cnt FROM users WHERE UserType = "ServiceCenter"');
    
    if (userRows[0].cnt < 5 || forceReseed) {
      console.log('[Database] Populating all 5 local partner accounts & demo data...');
      await resetAndSeedDatabase(pool);
      console.log('[Database] 5 Local Service Center Partner accounts seeded successfully!');
    }

    return pool;
  } catch (err) {
    console.error('[Database] Connection / initialization error:', err);
    throw err;
  }
}

async function resetAndSeedDatabase(db) {
  await db.query('SET FOREIGN_KEY_CHECKS = 0;');
  await db.query('TRUNCATE TABLE reviews;');
  await db.query('TRUNCATE TABLE payments;');
  await db.query('TRUNCATE TABLE bookings;');
  await db.query('TRUNCATE TABLE services;');
  await db.query('TRUNCATE TABLE time_slots;');
  await db.query('TRUNCATE TABLE vehicles;');
  await db.query('TRUNCATE TABLE service_centers;');
  await db.query('TRUNCATE TABLE users;');
  await db.query('SET FOREIGN_KEY_CHECKS = 1;');

  const defaultPassword = await bcrypt.hash('password123', 10);

  // 1. Users (Customers, 5 Local Service Center Partners, and Admin)
  const users = [
    // Customers
    ['Rohan Sharma', '9876543210', 'rohan@example.com', defaultPassword, 'Customer'],
    ['Amit Patel', '9876543211', 'amit@example.com', defaultPassword, 'Customer'],
    ['Sneha Joshi', '9876543212', 'sneha@example.com', defaultPassword, 'Customer'],
    ['Vikram More', '9876543213', 'vikram@example.com', defaultPassword, 'Customer'],

    // All 5 Local Service Center Partners
    ['Shree Auto Partner', '9876543214', 'shreeauto@example.com', defaultPassword, 'ServiceCenter'],
    ['Om Sai Partner', '9876543215', 'omsai@example.com', defaultPassword, 'ServiceCenter'],
    ['Royal Motors Partner', '9876543216', 'royalmotors@example.com', defaultPassword, 'ServiceCenter'],
    ['Ganesh Auto Partner', '9876543217', 'ganeshauto@example.com', defaultPassword, 'ServiceCenter'],
    ['QuickFix Mobile Partner', '9876543218', 'quickfix@example.com', defaultPassword, 'ServiceCenter'],

    // Super Admin
    ['CarServ Master Admin', '9876543299', 'admin@carserv.com', defaultPassword, 'Admin']
  ];

  for (const u of users) {
    await db.query(
      'INSERT INTO users (FullName, Mobile, Email, Password, UserType) VALUES (?, ?, ?, ?, ?)',
      u
    );
  }

  // Map user IDs
  const [uRows] = await db.query('SELECT UserID, Email FROM users');
  const userMap = {};
  uRows.forEach(r => { userMap[r.Email] = r.UserID; });

  // 2. 5 Local Service Centers linked to their respective partner UserIDs
  const localCenters = [
    [
      userMap['shreeauto@example.com'],
      'Shree Auto Service & Garage',
      'Non-Branded',
      'All Multi-Brand',
      'Shop 12, Kothrud Industrial Estate, Near Paud Road, Pune, Maharashtra 411038',
      'Pune',
      '411038',
      18.5074,
      73.8077,
      '1.8 km',
      '9876543214',
      '08:30 AM - 08:30 PM',
      '01:00 PM - 02:00 PM',
      'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
      1,
      4.6,
      145,
      'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800&auto=format&fit=crop&q=80'
    ],
    [
      userMap['omsai@example.com'],
      'Om Sai Multi-Car Care & Auto Garage',
      'Non-Branded',
      'All Multi-Brand',
      'Survey 42, Baner-Pashan Link Road, Baner, Pune, Maharashtra 411045',
      'Pune',
      '411045',
      18.5590,
      73.7868,
      '2.4 km',
      '9876543215',
      '09:00 AM - 08:00 PM',
      '01:00 PM - 02:00 PM',
      'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
      1,
      4.7,
      180,
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=80'
    ],
    [
      userMap['royalmotors@example.com'],
      'Royal Motors & Local Garage Works',
      'Non-Branded',
      'All Multi-Brand',
      'Plot 8, Wakad Flyover Chowk, Wakad, Pune, Maharashtra 411057',
      'Pune',
      '411057',
      18.5987,
      73.7689,
      '2.1 km',
      '9876543216',
      '09:00 AM - 07:30 PM',
      '01:00 PM - 02:00 PM',
      'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
      1,
      4.5,
      210,
      'https://images.unsplash.com/photo-1613214149922-f1809c99b414?w=800&auto=format&fit=crop&q=80'
    ],
    [
      userMap['ganeshauto@example.com'],
      'Ganesh Auto Repairs & Service Point',
      'Non-Branded',
      'All Multi-Brand',
      'Near Cummins College, Karve Road, Karve Nagar, Pune, Maharashtra 411052',
      'Pune',
      '411052',
      18.4912,
      73.8180,
      '3.0 km',
      '9876543217',
      '09:00 AM - 08:00 PM',
      '01:00 PM - 02:00 PM',
      'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
      1,
      4.4,
      95,
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80'
    ],
    [
      userMap['quickfix@example.com'],
      'QuickFix Local Mobile Garage (Doorstep)',
      'Mobile',
      'All Multi-Brand',
      'Doorstep On-Demand Mobile Mechanic Van, All Localities, Pune',
      'Pune',
      '411001',
      18.5204,
      73.8567,
      'Doorstep Van',
      '9876543218',
      '08:00 AM - 09:00 PM',
      '01:30 PM - 02:30 PM',
      'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
      1,
      4.8,
      130,
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&auto=format&fit=crop&q=80'
    ]
  ];

  for (const c of localCenters) {
    await db.query(
      `INSERT INTO service_centers (UserID, Name, Type, Brand, Address, City, Pincode, Latitude, Longitude, Distance, Phone, WorkingHours, BreakTime, AvailableDays, OpenStatus, Rating, ReviewCount, Image) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      c
    );
  }

  // 3. Services Catalog for all 5 centers
  const [cRows] = await db.query('SELECT ServiceCenterID, Name FROM service_centers');
  
  const standardServices = [
    { name: 'General Service & Tune-Up', desc: 'Complete multi-point check, fluid top-up, filter cleaning & engine tuning', price: 1299.00, duration: 60 },
    { name: 'Engine Oil & Filter Change', desc: 'High-grade engine oil replacement, oil filter check & engine flush', price: 649.00, duration: 30 },
    { name: 'Brake Inspection & Pad Service', desc: 'Front and rear brake pads check, caliper cleaning, disc rotor spray', price: 999.00, duration: 45 },
    { name: 'Car AC Cooling & Filter Service', desc: 'AC filter clean, gas pressure testing, cooling coil sanitization', price: 1099.00, duration: 45 },
    { name: 'Battery Health Check & Jumpstart', desc: 'Voltage testing, terminal cleaning, health diagnosis & boost', price: 399.00, duration: 25 },
    { name: 'Full Foam Wash & Interior Vacuum', desc: 'Pressure foam wash, underbody clean, interior deep vacuum & polish', price: 449.00, duration: 35 },
    { name: 'Wheel Alignment & Balancing', desc: 'Laser 3D alignment, computerized weight balancing for smooth drive', price: 699.00, duration: 40 },
    { name: 'OBD-II Computer Diagnostic Scan', desc: 'Computer fault code check, sensor verification & warning clearing', price: 799.00, duration: 30 }
  ];

  for (const center of cRows) {
    for (const s of standardServices) {
      await db.query(
        'INSERT INTO services (ServiceCenterID, ServiceName, Description, Price, Duration) VALUES (?, ?, ?, ?, ?)',
        [center.ServiceCenterID, s.name, s.desc, s.price, s.duration]
      );
    }
  }

  // 4. Vehicles for demo users
  const vehicles = [
    [userMap['rohan@example.com'], '4W', 'Hyundai', 'i20 Asta', 'MH12AB1234', 2022],
    [userMap['rohan@example.com'], '2W', 'Honda', 'Activa 6G', 'MH12XY7890', 2021],
    [userMap['amit@example.com'], '4W', 'Honda', 'City ZX', 'MH12CD5678', 2020],
    [userMap['sneha@example.com'], '4W', 'Tata', 'Nexon XZ+', 'MH12EF9012', 2023],
    [userMap['vikram@example.com'], '2W', 'Royal Enfield', 'Classic 350', 'MH12GH3456', 2022]
  ];

  for (const v of vehicles) {
    await db.query(
      'INSERT INTO vehicles (UserID, VehicleType, Brand, Model, RegistrationNo, Year) VALUES (?, ?, ?, ?, ?, ?)',
      v
    );
  }

  // 5. Sample Bookings & Payments
  const [vRows] = await db.query('SELECT VehicleID, UserID, RegistrationNo FROM vehicles');
  const [sRows] = await db.query('SELECT ServiceID, ServiceCenterID, ServiceName, Price FROM services');

  const shreeCenter = cRows[0];
  const omSaiCenter = cRows[1];
  const royalCenter = cRows[2];

  const sampleBookings = [
    {
      code: 'CS12345678',
      userId: userMap['rohan@example.com'],
      vehicleId: vRows[0].VehicleID,
      centerId: shreeCenter.ServiceCenterID,
      serviceId: sRows[0].ServiceID,
      selected: JSON.stringify([
        { name: 'General Service & Tune-Up', price: 1299 },
        { name: 'Engine Oil & Filter Change', price: 649 }
      ]),
      date: '2026-09-08',
      slot: '03:00 PM',
      status: 'Upcoming',
      total: 1948.00,
      notes: 'Please check slight noise in front suspension.'
    },
    {
      code: 'CS12345679',
      userId: userMap['amit@example.com'],
      vehicleId: vRows[2].VehicleID,
      centerId: omSaiCenter.ServiceCenterID,
      serviceId: sRows[1].ServiceID,
      selected: JSON.stringify([{ name: 'Engine Oil & Filter Change', price: 649 }]),
      date: '2026-09-09',
      slot: '01:00 PM',
      status: 'Upcoming',
      total: 649.00,
      notes: 'Synthetic engine oil requested.'
    },
    {
      code: 'CS12345680',
      userId: userMap['sneha@example.com'],
      vehicleId: vRows[3].VehicleID,
      centerId: royalCenter.ServiceCenterID,
      serviceId: sRows[3].ServiceID,
      selected: JSON.stringify([{ name: 'Car AC Cooling & Filter Service', price: 1099 }]),
      date: '2026-09-02',
      slot: '04:00 PM',
      status: 'Completed',
      total: 1099.00,
      notes: 'AC cooling is running perfectly now.'
    }
  ];

  for (const b of sampleBookings) {
    const [bRes] = await db.query(
      `INSERT INTO bookings (BookingCode, UserID, VehicleID, ServiceCenterID, ServiceID, SelectedServices, BookingDate, TimeSlot, Status, TotalAmount, Notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [b.code, b.userId, b.vehicleId, b.centerId, b.serviceId, b.selected, b.date, b.slot, b.status, b.total, b.notes]
    );

    await db.query(
      `INSERT INTO payments (BookingID, Amount, PaymentMethod, TransactionID, PaymentStatus)
       VALUES (?, ?, ?, ?, 'Success')`,
      [bRes.insertId, b.total, 'UPI', `TXN_${Date.now()}_${b.code}`]
    );
  }

  // 6. Reviews
  const sampleReviews = [
    [userMap['rohan@example.com'], shreeCenter.ServiceCenterID, 5, 'Best local garage in Kothrud! Transparent charges, no unnecessary replacements.'],
    [userMap['amit@example.com'], omSaiCenter.ServiceCenterID, 5, 'Very quick turnaround time and honest mechanic advice. Highly recommended for multi-brand cars.'],
    [userMap['sneha@example.com'], royalCenter.ServiceCenterID, 4, 'Good experience. Neat job on AC cooling and foam wash.']
  ];

  for (const r of sampleReviews) {
    await db.query(
      'INSERT INTO reviews (UserID, ServiceCenterID, Rating, Comment) VALUES (?, ?, ?, ?)',
      r
    );
  }
}

function getPool() {
  if (!pool) {
    throw new Error('Database pool not initialized. Call initDB() first.');
  }
  return pool;
}

module.exports = {
  initDB,
  getPool,
  resetAndSeedDatabase
};
