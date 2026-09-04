# CarServ - Vehicle Service Center Management System (Online Platform)

A full-stack Vehicle Service Center Management and Online Booking web application built with **React.js**, **Node.js**, **Express.js**, and **MySQL**, designed precisely from the project specifications, Data Dictionary, and UI mockups.

---

## 🚀 Quick Start (Running the Website)

### 1. Database Setup (MySQL)
The backend connects to MySQL on `localhost:3306` with user `root` (password: `root` or configurable in `backend/.env`).
On server startup, it **automatically creates the database `carserv_db`**, sets up all 8 tables, and seeds initial demo data.

### 2. Start the Application

#### Step 1: Start Backend API (Port 5000)
```bash
cd backend
npm install
npm start
```
*Backend runs at: `http://localhost:5000`*

#### Step 2: Start Frontend Web App (Port 3000)
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at: `http://localhost:3000`*

---

## 👥 Demo Login Accounts (1-Click Switchable)

You can easily switch between roles using the **Demo Mode Toolbar** at the very top of the website or login manually with these credentials:

| Role | Name | Email | Password | Access / Portal |
| :--- | :--- | :--- | :--- | :--- |
| **Customer** | Rohan Sharma | `rohan@example.com` | `password123` | Booking flow, My Bookings, Profile & Vehicles |
| **Partner (Workshop)** | Shree Auto Service | `shreeauto@example.com` | `password123` | `/partner/dashboard` - Bookings, Availability, Services |
| **Super Admin** | CarServ Master Admin | `admin@carserv.com` | `password123` | `/admin/dashboard` - KPIs, Centers, Reports, Users |

---

## 📱 Implemented Features & Screens (Mockup Matched)

### Customer Experience (All 15 Screens)
1. **Splash Screen**: Brand identity, tagline ("Your Car, Our Care"), hero value propositions, quick action to book.
2. **Onboarding Screen**: Carousel introduction to certified workshops and transparent pricing.
3. **Login Screen**: Secure JWT login with email/mobile and password.
4. **Register Screen**: Customer registration with validation.
5. **Select Vehicle**: Two Wheeler (2W) vs Four Wheeler (4W) interactive selection.
6. **Select Brand**: Filter centers by car/bike brands (Hyundai, Honda, Suzuki, Skoda, Toyota, Tata, Mahindra, Kia, Volkswagen, Royal Enfield, Yamaha, etc.) with search filter.
7. **Service Center List**: Nearby workshop discovery, filters (`All`, `Branded`, `Non-Branded`, `Mobile Service`), distance, operating status, ratings.
8. **Service Center Details**: Workshop photo, address, phone with click-to-call, working hours, customer reviews, list of services offered.
9. **Select Service**: Interactive multi-select service menu with live total calculator (General Service, Oil Change, Brake Service, AC Service, Battery Check, Car Wash, Wheel Alignment).
10. **Select Date & Time Slot**: Calendar date strip (Next 7 days) and time slot grid (09:00 AM to 06:00 PM).
11. **Booking Summary**: Complete breakdown of workshop, vehicle details (brand, model, registration), itemized services, appointment time, and total billing.
12. **Payment Screen**: Multi-option payment simulation (UPI, Google Pay, PhonePe, Credit/Debit Card, Net Banking, Wallets, Pay at Service Center).
13. **Booking Confirmation**: Success checkmark animation, confetti effect, unique Booking ID (e.g. `CS12345678`), scheduled time, and print/download receipt.
14. **My Bookings**: Filter by `Upcoming`, `Past / Completed`, `Cancelled`, view booking cards, cancel booking with reason modal, write review.
15. **Profile & Vehicles**: User profile details, manage saved vehicles (Add/Remove vehicle modal), saved addresses, support, and logout.

### Service Center Partner Portal (All 5 Screens)
1. **Partner Login**: Workshop partner authentication with feature highlights.
2. **Partner Dashboard**: Metric cards (Today's Bookings: 12, Upcoming: 8, Completed Today: 6, Total Earnings: ₹8,540), weekly booking trend graph, recent bookings table, quick status toggle (Open/Closed).
3. **Bookings Manager**: Filter by status, search by customer name/phone/ID, update service status (`Upcoming` -> `In Progress` -> `Completed` / `Cancelled`).
4. **Update Availability**: Workshop status switch, Select Working Hours (From - To), Lunch Break Time (From - To), Available Days checklist (Mon - Sun), save changes.
5. **Profile & Services**: Service catalog management (Add New Service modal, edit price/duration, delete service), workshop contact details.

### Super Admin Dashboard (All 5 Screens)
1. **Admin Login**: Secure super admin authentication.
2. **Admin Dashboard**: System KPIs (Total Users: 1,245, Service Centers: 245, Total Bookings: 1,754, Total Revenue: ₹2,45,850), weekly booking volume graph, Top Service Centers leaderboard, Booking Status distribution donut chart.
3. **Manage Service Centers**: Table of all service centers (Owner, City, Status, Phone, Type, Rating), Add New Service Center modal, toggle Active/Inactive, delete action.
4. **Manage Bookings**: Global booking ledger with search, date filter, status filter, and inspect record modal.
5. **Reports & Analytics**: Financial revenue charts, booking performance metrics, service popularity breakdown, printable summary.
6. **Manage Users**: Registered customer and partner accounts, vehicle counts, booking history.

---

## 🗄️ MySQL Database Schema (Data Dictionary)

```sql
1. users (UserID, FullName, Mobile, Email, Password, UserType, CreatedAt)
2. service_centers (ServiceCenterID, UserID, Name, Type, Brand, Address, City, Pincode, Latitude, Longitude, Distance, Phone, WorkingHours, BreakTime, AvailableDays, OpenStatus, Rating, ReviewCount, Image, CreatedAt)
3. vehicles (VehicleID, UserID, VehicleType, Brand, Model, RegistrationNo, Year, CreatedAt)
4. services (ServiceID, ServiceCenterID, ServiceName, Description, Price, Duration, CreatedAt)
5. bookings (BookingID, BookingCode, UserID, VehicleID, ServiceCenterID, ServiceID, SelectedServices, BookingDate, TimeSlot, Status, TotalAmount, Notes, CreatedAt)
6. time_slots (SlotID, ServiceCenterID, SlotDate, StartTime, EndTime, Status)
7. payments (PaymentID, BookingID, Amount, PaymentMethod, TransactionID, PaymentDate, PaymentStatus)
8. reviews (ReviewID, UserID, ServiceCenterID, Rating, Comment, ReviewDate)
```

---

## 💻 Tech Stack Summary
- **Frontend**: HTML5, CSS3, JavaScript (ES6+), React 18, Vite 5, Tailwind CSS, Lucide React icons, Canvas Confetti, React Router v6, Axios
- **Backend**: Node.js, Express.js, JWT, bcryptjs, CORS, Dotenv
- **Database**: MySQL 8.0 / mysql2
