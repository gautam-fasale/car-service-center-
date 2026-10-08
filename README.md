# CarServ - Vehicle Service Center Management System (Online Platform)

A full-stack Vehicle Service Center Management and Online Booking web application built with **React.js**, **Node.js**, **Express.js**, and **MySQL**, designed precisely from the project specifications, Data Dictionary, and UI mockups.

---

## 🚀 Quick Start (Running the Website)

### Prerequisites:
* **Node.js** (v18+)
* **MySQL Server** (Running on port `3306` with user `root` / password `root`)

---

### 1-Command Startup (With Automatic Dependency Installer)
Simply open the project folder in terminal or VS Code and run:
```bash
npm start
```
*(Or double-click `start_all.bat` in Windows File Explorer)*

The runner automatically:
1. Detects and runs `npm install` for both Backend and Frontend if dependencies are missing.
2. Automatically generates `backend/.env` if not present.
3. Auto-creates MySQL database `carserv_db` and all 8 tables.
4. Populates seed data for all 5 local garages, services, reviews, and users.
5. Starts **Backend REST API** on `http://localhost:5000` and **Frontend React App** on `http://localhost:3000`.

---

## 👥 Login Credentials & Portals

### 👤 1. Customer Account
* **Login URL**: [http://localhost:3000/login](http://localhost:3000/login)
* **Email**: `rohan@example.com`
* **Password**: `password123`
* **Features**: Discover 5 local garages, filter by 2W/4W & brands, select services, book date & time slots, simulated checkout, confirmation receipt, my bookings, and profile management (*Saved Addresses, Payment Methods, Notifications, 24/7 Support, Settings*).

---

### 🏢 2. All 5 Local Service Center Partner Accounts
* **Login URL**: [http://localhost:3000/partner/login](http://localhost:3000/partner/login)

| # | Service Center Name | Location | Partner Email | Password |
| :-: | :--- | :--- | :--- | :--- |
| **1** | **Shree Auto Service & Garage** | Kothrud Industrial Estate, Pune | `shreeauto@example.com` | `password123` |
| **2** | **Om Sai Multi-Car Care & Auto Garage** | Baner-Pashan Link Rd, Pune | `omsai@example.com` | `password123` |
| **3** | **Royal Motors & Local Garage Works** | Wakad Flyover Chowk, Pune | `royalmotors@example.com` | `password123` |
| **4** | **Ganesh Auto Repairs & Service Point** | Karve Nagar, Pune | `ganeshauto@example.com` | `password123` |
| **5** | **QuickFix Local Mobile Garage (Doorstep)** | On-Demand Mobile Van, Pune | `quickfix@example.com` | `password123` |

* **Partner Features**: Real-time customer bookings manager, update service status (*Upcoming → In Progress → Completed / Cancelled*), working hours & lunch break scheduler, and service catalog rate card.

---

### 🛡️ 3. Super Admin Account
* **Login URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
* **Email**: `admin@carserv.com`
* **Password**: `password123`
* **Features**: System KPI metrics, revenue charts, service center management (add/toggle/delete), global booking audit ledger, registered users directory, and printable analytics.

---

## 🛡️ Smart Booking Features & Business Logic

1. **Past Date Prevention**:
   * Calendar strictly starts from **Today** onwards. Booking past dates is blocked in frontend and backend.
2. **Real-Time Passed Time Slot Lock**:
   * On Today's date, morning/past hours are automatically greyed out with a `PASSED` badge and disabled from booking.
3. **Double-Booking Slot Collision Lock**:
   * If a customer books a specific time slot at a workshop, that slot is instantly marked as **`🔒 BOOKED`** for all other users.
4. **Interactive Customer Profile**:
   * Manage multiple vehicles (Cars & Bikes).
   * Save & manage delivery addresses (Home / Office).
   * Save UPI IDs and Cards.
   * Customize WhatsApp, SMS, and Email alert preferences.
   * 24/7 Helpdesk with direct toll-free call, email, and support ticket submission.

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

## 💻 Tech Stack
* **Frontend**: React 18, Vite 5, Tailwind CSS, Lucide React icons, Canvas Confetti, React Router v6, Axios
* **Backend**: Node.js, Express.js, JWT, bcryptjs, CORS, Dotenv
* **Database**: MySQL 8.0 / mysql2
