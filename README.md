# 🚚 CargoShare

## Logistics Management & Cargo Sharing Platform

CargoShare is a full-stack web-based logistics management platform
designed to centralize cargo booking, logistics assignment, shipment
tracking, container management, payments, documents, notifications,
activity monitoring, and user communication.

### User Roles

-   **Admin** --- manages users, bookings, logistics providers,
    containers, payments, and system activities.
-   **Trader** --- creates and manages cargo bookings and follows
    shipment and payment information.
-   **Logistics** --- views assigned shipments and updates tracking
    information.

------------------------------------------------------------------------

## 📌 Table of Contents

-   [Overview](#-overview)
-   [Objectives](#-objectives)
-   [Key Features](#-key-features)
-   [User Roles](#-user-roles)
-   [Application Workflow](#-application-workflow)
-   [System Architecture](#-system-architecture)
-   [Technology Stack](#-technology-stack)
-   [Project Structure](#-project-structure)
-   [Prerequisites](#-prerequisites)
-   [Installation](#-installation)
-   [Backend Setup](#-backend-setup)
-   [Database Setup](#-database-setup)
-   [Frontend Setup](#-frontend-setup)
-   [Running the Project](#-running-the-project)
-   [API Documentation](#-api-documentation)
-   [Authentication & RBAC](#-authentication--rbac)
-   [Database Migrations](#-database-migrations)
-   [Environment Variables](#-environment-variables)
-   [Mobile Testing with ngrok](#-mobile-testing-with-ngrok)
-   [Testing Checklist](#-testing-checklist)
-   [Git & GitHub](#-git--github)
-   [Troubleshooting](#-troubleshooting)
-   [Future Enhancements](#-future-enhancements)
-   [Project Status](#-project-status)
-   [License](#-license)

------------------------------------------------------------------------

# 📖 Overview

Cargo transportation involves multiple parties and several operational
stages. A trader may create a booking, an administrator may assign a
logistics provider, the logistics provider may transport the shipment
and update its location, and payment and document information may need
to be maintained throughout the process.

CargoShare brings these activities into one centralized application.

The platform is intended to provide better visibility, reduce manual
coordination, and keep booking, logistics, tracking, container, payment,
document, notification, and activity information organized.

------------------------------------------------------------------------

# 🎯 Objectives

-   Digitize the cargo booking workflow.
-   Provide centralized logistics management.
-   Implement role-based access control.
-   Allow administrators to assign logistics providers to bookings.
-   Allow logistics users to update shipment tracking.
-   Manage containers and capacity information.
-   Manage booking payments.
-   Store and manage booking documents.
-   Provide user-specific notifications.
-   Maintain an activity history.
-   Provide an internal chat system.
-   Provide dashboard and analytical information.
-   Support light and dark themes.
-   Provide export functionality where implemented.

------------------------------------------------------------------------

# ✨ Key Features

## 🔐 Authentication & Authorization

-   User login
-   JWT-based authentication
-   Protected frontend routes
-   Role-based access control
-   Separate Admin, Trader, and Logistics workflows

## 📦 Booking Management

-   Create bookings
-   View booking details
-   Update booking information
-   Manage booking status
-   Manage booking amount
-   Assign logistics providers
-   Delete bookings
-   Associate documents, payments, and tracking information with
    bookings

## 🚛 Logistics Management

-   Manage logistics providers
-   View logistics information
-   Check logistics availability
-   Assign logistics providers to bookings
-   View assigned shipments

## 📍 Shipment Tracking

-   Create tracking records
-   Associate tracking with a booking
-   Update current shipment location
-   Update shipment status
-   View tracking information
-   Delete tracking records

Example statuses:

-   `In Transit`
-   `Completed`

## 🧰 Container Management

-   Add containers
-   View container records
-   Manage container number
-   Manage container type
-   Manage capacity
-   Track container availability

## 💳 Payment Management

-   Create payment records
-   View payments
-   Edit payment information
-   Track payment status
-   Associate payments with bookings
-   Support payment methods such as UPI, Cash, Card, and Bank Transfer
-   Payment-related notifications

## 📄 Document Management

-   Upload booking documents
-   View documents
-   Download documents
-   Delete documents
-   Associate documents with bookings

## 🔔 Notifications

Notifications can be generated for important events such as:

-   Logistics assignment
-   Booking events
-   Payment completion
-   Other system activities

## 📋 Activity Logs

Important system actions can be recorded with:

-   User
-   Role
-   Action
-   Timestamp

Activity information can be exported where export functionality is
available.

## 💬 Chat

The application includes an internal communication module based around
conversations and messages.

## 📊 Dashboard & Analytics

The dashboard provides summarized operational information to help users
understand the current state of the system.

## 🔎 Global Search

A global search interface is available from the application header to
make navigation and information discovery faster.

## 🌓 Light & Dark Mode

The interface supports:

-   ☀️ Light mode
-   🌙 Dark mode

## 📤 Data Export

Export functionality is available for supported operational data,
including formats such as Excel and PDF where implemented.

------------------------------------------------------------------------

# 👥 User Roles

  -----------------------------------------------------------------------
  Role                                Main Responsibilities
  ----------------------------------- -----------------------------------
  **Admin**                           Manage users, bookings, logistics,
                                      containers, payments, activities,
                                      and system operations

  **Trader**                          Create/manage bookings and view
                                      relevant shipment, payment,
                                      document, and communication
                                      information

  **Logistics**                       View assigned bookings and update
                                      shipment tracking information
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 🔄 Application Workflow

``` text
                         USER LOGIN
                             │
                             ▼
                    Authentication / JWT
                             │
                             ▼
                       Role Verification
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
        ADMIN              TRADER           LOGISTICS
          │                  │                  │
          ▼                  ▼                  ▼
   Manage platform     Create booking     View assigned
          │                  │              shipments
          ▼                  ▼                  │
   Assign logistics    Booking created         │
          │                  │                  ▼
          └──────────────────┼────────── Update tracking
                             │
                             ▼
                       Shipment tracking
                             │
                    ┌────────┴────────┐
                    ▼                 ▼
                 Payments          Documents
                    │                 │
                    └────────┬────────┘
                             ▼
                    Delivery / Completion
```

------------------------------------------------------------------------

# 🏗️ System Architecture

``` text
┌─────────────────────────────────────────────┐
│                 USER / CLIENT               │
│        Desktop Browser / Mobile Browser     │
└──────────────────────┬──────────────────────┘
                       │
                       │ HTTP / HTTPS
                       ▼
┌─────────────────────────────────────────────┐
│              REACT FRONTEND                 │
│                                             │
│ React + Vite + Tailwind CSS                 │
│ React Router + Axios + UI Components        │
└──────────────────────┬──────────────────────┘
                       │
                       │ REST API
                       ▼
┌─────────────────────────────────────────────┐
│              FASTAPI BACKEND                │
│                                             │
│ Python + FastAPI                            │
│ Pydantic + SQLAlchemy                       │
│ JWT Authentication + Alembic               │
└──────────────────────┬──────────────────────┘
                       │
                       │ SQL
                       ▼
┌─────────────────────────────────────────────┐
│                  MYSQL                      │
└─────────────────────────────────────────────┘
```

------------------------------------------------------------------------

# 🛠️ Technology Stack

### Frontend

  Technology       Purpose
  ---------------- -----------------------------
  React.js         User interface
  Vite             Development/build tooling
  Tailwind CSS     Styling
  React Router     Client-side routing
  Axios            API communication
  Lucide React     Icons
  React Toastify   User feedback/notifications

### Backend

  Technology   Purpose
  ------------ ------------------------------
  Python       Backend language
  FastAPI      REST API framework
  SQLAlchemy   ORM/database access
  Pydantic     Data validation
  Alembic      Database migrations
  JWT          Authentication/authorization

### Database

-   MySQL

### Development Tools

-   Visual Studio Code
-   Git
-   GitHub
-   Postman
-   ngrok

------------------------------------------------------------------------

# 📁 Project Structure

``` text
CargoShare/
│
├── backend/
│   ├── alembic/
│   │   └── versions/
│   ├── app/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── database.py
│   │   └── main.py
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── ...
│
├── requirements.txt
├── .gitignore
└── README.md
```

------------------------------------------------------------------------

# 💻 Prerequisites

Install:

-   Python 3.x
-   Node.js
-   npm
-   MySQL Server
-   Git

Recommended:

-   Visual Studio Code
-   Postman
-   ngrok

Check installations:

``` bash
python --version
node --version
npm --version
git --version
```

------------------------------------------------------------------------

# 📥 Installation

## 1. Clone the Repository

``` bash
git clone https://github.com/Allabakash-blip/CargoShare.git
cd CargoShare
```

------------------------------------------------------------------------

# 🐍 Backend Setup

From the project root:

``` bash
cd backend
```

Create a virtual environment.

### Windows

``` powershell
python -m venv ../venv
../venv/Scripts/Activate.ps1
```

### Linux/macOS

``` bash
python3 -m venv ../venv
source ../venv/bin/activate
```

Install dependencies:

``` bash
pip install -r ../requirements.txt
```

------------------------------------------------------------------------

# 🗄️ Database Setup

Create the MySQL database:

``` sql
CREATE DATABASE CargoShare;
```

Verify:

``` sql
SHOW DATABASES;
```

Configure the backend environment with your MySQL connection details.

Example:

``` env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=CargoShare
DB_USER=root
DB_PASSWORD=your_password
```

**Never commit real passwords, JWT secrets, API keys, or other
credentials to GitHub.**

------------------------------------------------------------------------

# 🔄 Database Migrations

CargoShare uses Alembic.

From the backend directory:

``` bash
alembic upgrade head
```

After changing SQLAlchemy models:

``` bash
alembic revision --autogenerate -m "describe the change"
```

Then:

``` bash
alembic upgrade head
```

Review autogenerated migration files before applying them to an
important database.

------------------------------------------------------------------------

# ⚛️ Frontend Setup

Open a second terminal:

``` bash
cd frontend
npm install
npm run dev
```

Vite normally runs the frontend at:

``` text
http://localhost:5173
```

------------------------------------------------------------------------

# ▶️ Running the Project

### Terminal 1 --- Backend

``` bash
cd backend
python -m uvicorn app.main:app --reload
```

Backend:

``` text
http://127.0.0.1:8000
```

### Terminal 2 --- Frontend

``` bash
cd frontend
npm run dev
```

Frontend:

``` text
http://localhost:5173
```

------------------------------------------------------------------------

# 📚 API Documentation

FastAPI provides interactive documentation automatically.

### Swagger UI

``` text
http://127.0.0.1:8000/docs
```

### ReDoc

``` text
http://127.0.0.1:8000/redoc
```

------------------------------------------------------------------------

# 🔐 Authentication & RBAC

The authentication flow is based on JWT.

``` text
User Login
    ↓
Credential Validation
    ↓
JWT Token
    ↓
Authenticated Frontend State
    ↓
API Request with Token
    ↓
Backend Token Validation
    ↓
Role / Permission Check
    ↓
Authorized Operation
```

The frontend uses protected routes, while the backend performs
authentication and authorization checks.

------------------------------------------------------------------------

# 🌐 Frontend & Backend Communication

``` text
Frontend :5173
      │
      │ Axios / HTTP
      ▼
Backend :8000
      │
      ▼
MySQL :3306
```

Make sure the frontend API base URL points to the correct backend
address.

------------------------------------------------------------------------

# 📱 Mobile Testing with ngrok

For temporary mobile testing:

``` bash
npm run dev -- --host 0.0.0.0
```

Then:

``` bash
ngrok http 5173
```

If Vite reports:

``` text
Blocked request. This host is not allowed.
```

add the exact ngrok hostname to `vite.config.js`:

``` js
server: {
  host: "0.0.0.0",
  port: 5173,
  allowedHosts: [
    "your-host.ngrok-free.dev",
  ],
},
```

Restart Vite after changing the configuration.

### Backend for mobile

If the frontend calls:

``` text
http://localhost:8000
```

from a phone, `localhost` refers to the phone.

For complete mobile testing, expose the backend too:

``` bash
ngrok http 8000
```

Then configure the frontend API URL to use the backend's HTTPS ngrok
address.

``` text
Mobile Browser
      │
      ▼
Frontend ngrok URL
      │
      ▼
React / Vite :5173
      │
      ▼
Backend ngrok URL
      │
      ▼
FastAPI :8000
      │
      ▼
MySQL
```

------------------------------------------------------------------------

# 🧪 Testing Checklist

### Authentication

-   [ ] Login/logout
-   [ ] Protected routes
-   [ ] Admin workflow
-   [ ] Trader workflow
-   [ ] Logistics workflow

### Bookings

-   [ ] Create booking
-   [ ] View/update booking
-   [ ] Assign logistics
-   [ ] Delete booking
-   [ ] Booking amount

### Logistics

-   [ ] View logistics
-   [ ] Check availability
-   [ ] Assign logistics

### Tracking

-   [ ] Create tracking
-   [ ] Update location
-   [ ] Update status
-   [ ] Delete tracking

### Containers

-   [ ] Add container
-   [ ] View containers
-   [ ] Delete container

### Payments

-   [ ] Create payment
-   [ ] Edit payment
-   [ ] Update status
-   [ ] Verify booking association

### Documents

-   [ ] Upload
-   [ ] View
-   [ ] Download
-   [ ] Delete

### Other

-   [ ] Notifications
-   [ ] Activity logs
-   [ ] Chat
-   [ ] Global search
-   [ ] Profile
-   [ ] Dashboard
-   [ ] Analytics
-   [ ] Dark/light mode
-   [ ] Export functionality

------------------------------------------------------------------------

# 🔧 Troubleshooting

## Uvicorn launcher error

If Windows reports:

``` text
Fatal error in launcher:
Unable to create process using ...
```

check:

``` powershell
python -c "import sys; print(sys.executable)"
```

Then try:

``` powershell
python -m uvicorn app.main:app --reload
```

This uses Uvicorn from the active Python environment.

## Vite ngrok host error

If you see:

``` text
Blocked request. This host is not allowed.
```

make sure the exact current ngrok hostname is present in
`server.allowedHosts`, then restart Vite.

## Blank frontend page

Check:

1.  Browser Developer Tools → Console
2.  Vite terminal
3.  Backend terminal
4.  Frontend API base URL
5.  Backend availability
6.  Network tab for failed API requests

## API works on computer but not phone

A phone cannot use the development computer's `localhost` through its
own browser. Use an accessible backend address for mobile testing.

------------------------------------------------------------------------

# 🌿 Git & GitHub

Check changes:

``` bash
git status
```

Stage:

``` bash
git add .
```

Commit:

``` bash
git commit -m "Describe the changes"
```

Push:

``` bash
git push origin main
```

Check the remote:

``` bash
git remote -v
```

Before pushing, confirm that `.env` and other secrets are ignored.

------------------------------------------------------------------------

# 🔒 Security

Never commit:

-   `.env`
-   Database passwords
-   JWT secret keys
-   API keys
-   Cloud credentials
-   Private certificates
-   Personal credentials

Typical `.gitignore` entries:

``` gitignore
__pycache__/
*.py[cod]

venv/
.venv/

.env
.env.*

node_modules/
dist/

.vscode/
.idea/

.DS_Store
Thumbs.db
```

------------------------------------------------------------------------

# 🚀 Production Considerations

The current setup is primarily intended for development and
demonstration.

For production, consider:

-   Production hosting
-   HTTPS
-   Secure environment variables
-   Strong JWT secrets
-   Restricted CORS
-   Production database configuration
-   Database backups
-   Logging and monitoring
-   Production frontend build
-   Production API server
-   Reliable document/file storage
-   CI/CD
-   Automated testing
-   Domain configuration

Development servers and `--reload` should not be used as the production
architecture.

------------------------------------------------------------------------

# 🔮 Future Enhancements

Potential improvements include:

-   Real-time GPS shipment tracking
-   Interactive maps
-   Route optimization
-   Automated logistics matching
-   Email/SMS notifications
-   Push notifications
-   WebSocket-based real-time chat
-   Online payment gateway integration
-   Advanced analytics
-   Advanced reporting
-   Document preview
-   Docker deployment
-   Cloud deployment
-   CI/CD pipeline
-   Automated unit and integration tests

------------------------------------------------------------------------

# 🎓 Learning Outcomes

This project demonstrates practical experience with:

-   Full-stack web development
-   React.js
-   Vite
-   Tailwind CSS
-   REST API development
-   FastAPI
-   SQLAlchemy
-   Pydantic
-   MySQL
-   Alembic
-   JWT authentication
-   Role-based access control
-   CRUD operations
-   Axios
-   Responsive UI development
-   Reusable React components
-   Git and GitHub
-   API testing
-   Mobile testing with ngrok

------------------------------------------------------------------------

# 📈 Project Benefits

### Centralized Operations

Major logistics activities are managed from one application.

### Better Visibility

Users can follow bookings, logistics assignments, tracking, containers,
payments, and documents.

### Role-Based Control

Users receive functionality according to their assigned role.

### Reduced Manual Coordination

Digital workflows reduce dependence on scattered records and manual
communication.

### Maintainable Architecture

Separating frontend, backend, and database layers makes the project
easier to maintain and extend.

------------------------------------------------------------------------

# 🏁 Project Status

**CargoShare is a functional full-stack logistics management project
built with React, FastAPI, and MySQL.**

Major modules include:

-   Authentication
-   Role-based access
-   Dashboard
-   Analytics
-   Bookings
-   Logistics
-   Containers
-   Shipment Tracking
-   Payments
-   Documents
-   Notifications
-   Activity Logs
-   Chat
-   Global Search
-   Profile
-   Data Export
-   Light/Dark Mode

------------------------------------------------------------------------

# 🤝 Contributing

Suggested workflow:

``` text
Fork
  ↓
Create feature branch
  ↓
Make changes
  ↓
Test
  ↓
Commit
  ↓
Push
  ↓
Pull Request
```

------------------------------------------------------------------------

# 📄 License

No specific open-source license is currently declared for this
repository.

If you plan to distribute CargoShare as open-source software, add an
appropriate license.

------------------------------------------------------------------------

## 🚚 CargoShare

**One platform for managing the cargo journey --- from booking to
delivery.**
