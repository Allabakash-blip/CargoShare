# 🚚 CargoShare

### Logistics Management & Cargo Sharing Platform

CargoShare is a full-stack logistics management system designed to simplify and manage cargo transportation workflows between traders, logistics providers, and administrators.

The platform provides a centralized system for managing bookings, logistics assignments, shipment tracking, containers, payments, documents, notifications, activity logs, and user communication.

---

## 📌 Overview

Managing cargo transportation often involves multiple parties, manual coordination, and scattered information.

CargoShare brings these operations together into a single web-based platform where:

- Traders can create and manage shipment bookings.
- Administrators can manage users, bookings, logistics providers, containers, payments, and system activities.
- Logistics providers can view assigned shipments and update shipment tracking information.
- Users can communicate through the integrated chat system.
- Documents, payments, notifications, and activity history can be managed from the platform.

---

# ✨ Key Features

## 🔐 Authentication & Role-Based Access Control

- Secure user authentication
- JWT-based authorization
- Role-based access control
- Protected frontend routes
- Separate functionality for:
  - Admin
  - Trader
  - Logistics

---

## 📦 Booking Management

- Create cargo bookings
- View booking details
- Manage booking status
- Assign logistics providers
- Delete bookings
- Track booking information
- Booking amount management

---

## 🚛 Logistics Management

- Manage logistics providers
- View logistics availability
- Assign logistics providers to bookings
- Track assigned bookings
- Update logistics-related information

---

## 📍 Shipment Tracking

- Add shipment tracking information
- Update current shipment location
- Update shipment status
- Track shipment progress
- Support for statuses such as:
  - In Transit
  - Completed

---

## 🧰 Container Management

- Add containers
- View container information
- Manage container details
- Track container capacity and type

---

## 💳 Payment Management

- Create payments
- View payment records
- Update payment status
- Support payment methods such as:
  - UPI
  - Cash
  - Card
  - Bank Transfer
- Payment status management
- Payment completion notifications

---

## 📄 Document Management

- Upload booking documents
- View uploaded documents
- Download documents
- Delete documents
- Associate documents with specific bookings

---

## 🔔 Notifications

- Booking-related notifications
- Payment completion notifications
- Logistics assignment notifications
- User-specific notification management

---

## 📋 Activity Logs

The system records important activities performed by users.

Activity logs include:

- User
- Role
- Action
- Timestamp

Activity logs can also be exported for reporting purposes.

---

## 💬 Chat

CargoShare includes a communication module that allows users to communicate through conversations within the platform.

---

## 📊 Dashboard

The dashboard provides an overview of important logistics information and system activity.

It includes statistics and summarized information to help users quickly understand the current state of the platform.

---

## 🌓 Dark & Light Mode

CargoShare supports both:

- ☀️ Light Mode
- 🌙 Dark Mode

The interface is designed to remain readable and consistent across both themes.

---

## 📤 Data Export

Activity and management data can be exported for further use.

Supported formats include:

- Excel
- PDF

---

# 🛠️ Technology Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React
- React Toastify

## Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Alembic
- JWT Authentication

## Database

- MySQL

## Development Tools

- Visual Studio Code
- Git
- GitHub
- Postman

---

# 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      CargoShare      │
                    │    Web Application   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React Frontend     │
                    │   Vite + Tailwind    │
                    └──────────┬───────────┘
                               │
                         REST API / Axios
                               │
                               ▼
                    ┌──────────────────────┐
                    │    FastAPI Backend   │
                    │   Python + SQLAlchemy │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      MySQL DB        │
                    └──────────────────────┘