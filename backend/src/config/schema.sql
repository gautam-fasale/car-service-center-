-- CarServ - Vehicle Service Center Database Schema & Seed Data

CREATE DATABASE IF NOT EXISTS `carserv_db`;
USE `carserv_db`;

-- 1. User Table (Data Dictionary: UserID, FullName, Mobile, Email, Password, UserType, CreatedAt)
CREATE TABLE IF NOT EXISTS `users` (
  `UserID` INT AUTO_INCREMENT PRIMARY KEY,
  `FullName` VARCHAR(100) NOT NULL,
  `Mobile` VARCHAR(15) NOT NULL UNIQUE,
  `Email` VARCHAR(100) NOT NULL UNIQUE,
  `Password` VARCHAR(255) NOT NULL,
  `UserType` ENUM('Customer', 'Admin', 'ServiceCenter') NOT NULL DEFAULT 'Customer',
  `CreatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Service Center Table (Data Dictionary: ServiceCenterID, Name, Type, Address, Phone, OpenStatus + ER Diagram extensions)
CREATE TABLE IF NOT EXISTS `service_centers` (
  `ServiceCenterID` INT AUTO_INCREMENT PRIMARY KEY,
  `UserID` INT NULL,
  `Name` VARCHAR(100) NOT NULL,
  `Type` ENUM('Branded', 'Non-Branded', 'Mobile') NOT NULL DEFAULT 'Branded',
  `Brand` VARCHAR(50) DEFAULT 'All',
  `Address` TEXT NOT NULL,
  `City` VARCHAR(50) NOT NULL DEFAULT 'Pune',
  `Pincode` VARCHAR(10) NOT NULL DEFAULT '411001',
  `Latitude` DECIMAL(10, 8) NULL,
  `Longitude` DECIMAL(11, 8) NULL,
  `Distance` VARCHAR(20) DEFAULT '2.3 km',
  `Phone` VARCHAR(15) NOT NULL,
  `WorkingHours` VARCHAR(100) DEFAULT '09:00 AM - 07:00 PM',
  `BreakTime` VARCHAR(100) DEFAULT '01:00 PM - 02:00 PM',
  `AvailableDays` VARCHAR(255) DEFAULT 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
  `OpenStatus` BOOLEAN DEFAULT TRUE,
  `Rating` DECIMAL(2, 1) DEFAULT 4.5,
  `ReviewCount` INT DEFAULT 120,
  `Image` VARCHAR(255) DEFAULT 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?w=600&auto=format&fit=crop&q=80',
  `CreatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Vehicle Table (Data Dictionary: VehicleID, UserID, VehicleType, Brand, Model, RegistrationNo, Year)
CREATE TABLE IF NOT EXISTS `vehicles` (
  `VehicleID` INT AUTO_INCREMENT PRIMARY KEY,
  `UserID` INT NOT NULL,
  `VehicleType` ENUM('2W', '4W') NOT NULL DEFAULT '4W',
  `Brand` VARCHAR(50) NOT NULL,
  `Model` VARCHAR(50) NOT NULL,
  `RegistrationNo` VARCHAR(20) NOT NULL UNIQUE,
  `Year` YEAR NOT NULL DEFAULT 2022,
  `CreatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Service Table (Data Dictionary: ServiceID, ServiceCenterID, ServiceName, Price, Duration)
CREATE TABLE IF NOT EXISTS `services` (
  `ServiceID` INT AUTO_INCREMENT PRIMARY KEY,
  `ServiceCenterID` INT NOT NULL,
  `ServiceName` VARCHAR(100) NOT NULL,
  `Description` TEXT NULL,
  `Price` DECIMAL(10, 2) NOT NULL DEFAULT 499.00,
  `Duration` INT NOT NULL DEFAULT 45,
  `CreatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`ServiceCenterID`) REFERENCES `service_centers` (`ServiceCenterID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Booking Table (Data Dictionary: BookingID, UserID, VehicleID, ServiceCenterID, ServiceID, BookingDate, TimeSlot, Status, TotalAmount)
CREATE TABLE IF NOT EXISTS `bookings` (
  `BookingID` INT AUTO_INCREMENT PRIMARY KEY,
  `BookingCode` VARCHAR(30) NOT NULL UNIQUE,
  `UserID` INT NOT NULL,
  `VehicleID` INT NOT NULL,
  `ServiceCenterID` INT NOT NULL,
  `ServiceID` INT NULL,
  `SelectedServices` TEXT NULL,
  `BookingDate` DATE NOT NULL,
  `TimeSlot` VARCHAR(30) NOT NULL,
  `Status` ENUM('Upcoming', 'In Progress', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Upcoming',
  `TotalAmount` DECIMAL(10, 2) NOT NULL,
  `Notes` TEXT NULL,
  `CreatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE,
  FOREIGN KEY (`VehicleID`) REFERENCES `vehicles` (`VehicleID`) ON DELETE CASCADE,
  FOREIGN KEY (`ServiceCenterID`) REFERENCES `service_centers` (`ServiceCenterID`) ON DELETE CASCADE,
  FOREIGN KEY (`ServiceID`) REFERENCES `services` (`ServiceID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Time Slot Table (Data Dictionary: SlotID, ServiceCenterID, SlotDate, StartTime, EndTime, Status)
CREATE TABLE IF NOT EXISTS `time_slots` (
  `SlotID` INT AUTO_INCREMENT PRIMARY KEY,
  `ServiceCenterID` INT NOT NULL,
  `SlotDate` DATE NOT NULL,
  `StartTime` TIME NOT NULL,
  `EndTime` TIME NOT NULL,
  `Status` ENUM('Available', 'Booked') NOT NULL DEFAULT 'Available',
  FOREIGN KEY (`ServiceCenterID`) REFERENCES `service_centers` (`ServiceCenterID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Payment Table (Data Dictionary: PaymentID, BookingID, Amount, PaymentMethod, TransactionID, PaymentDate, PaymentStatus)
CREATE TABLE IF NOT EXISTS `payments` (
  `PaymentID` INT AUTO_INCREMENT PRIMARY KEY,
  `BookingID` INT NOT NULL,
  `Amount` DECIMAL(10, 2) NOT NULL,
  `PaymentMethod` ENUM('UPI', 'Credit/Debit Card', 'Net Banking', 'Wallets', 'Cash') NOT NULL DEFAULT 'UPI',
  `TransactionID` VARCHAR(60) NOT NULL UNIQUE,
  `PaymentDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `PaymentStatus` ENUM('Success', 'Pending', 'Failed') NOT NULL DEFAULT 'Success',
  FOREIGN KEY (`BookingID`) REFERENCES `bookings` (`BookingID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Review Table (Data Dictionary: ReviewID, UserID, ServiceCenterID, Rating, Comment, ReviewDate)
CREATE TABLE IF NOT EXISTS `reviews` (
  `ReviewID` INT AUTO_INCREMENT PRIMARY KEY,
  `UserID` INT NOT NULL,
  `ServiceCenterID` INT NOT NULL,
  `Rating` INT NOT NULL CHECK (`Rating` BETWEEN 1 AND 5),
  `Comment` TEXT NULL,
  `ReviewDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE,
  FOREIGN KEY (`ServiceCenterID`) REFERENCES `service_centers` (`ServiceCenterID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
