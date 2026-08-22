# 🚛 TransitOps
### Smart Fleet Management & Logistics Operations Platform

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?logo=postgresql)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

TransitOps is a modern **Fleet Management System** designed to simplify logistics operations by providing intelligent vehicle dispatching, driver management, maintenance tracking, and operational analytics.

Instead of relying on spreadsheets and manual coordination, TransitOps centralizes fleet operations into one secure platform with **role-based access control**, **real-time availability checks**, and **business insights**.

---

# ✨ Features

### 🚛 Vehicle Management
- Register and manage fleet vehicles
- Track vehicle availability
- Monitor maintenance status
- Prevent allocation of unavailable vehicles

### 👨‍✈️ Driver Management
- Maintain driver records
- Track driver availability
- Prevent driver double-booking
- Role-based permissions

### 📦 Smart Dispatch Engine
- Assign only available vehicles and drivers
- Prevent scheduling conflicts
- Create and manage logistics trips
- Real-time dispatch workflow

### 🔧 Maintenance Tracking
- Schedule maintenance records
- Monitor maintenance history
- Update vehicle status automatically

### 📊 Operational Analytics
- Fleet utilization metrics
- Fuel cost insights
- Maintenance expenditure
- Operational KPI dashboard

### 🔐 Authentication & Authorization
- JWT Authentication
- Secure password hashing using bcrypt
- Role-Based Access Control (RBAC)

Supported roles include:
- Fleet Manager
- Safety Officer
- Driver
- Financial Analyst

---

# 🏗️ System Architecture

```
                    React Frontend
                          │
                    REST API (Axios)
                          │
                 Express.js Backend
                          │
        JWT Authentication Middleware
                          │
                  Business Logic Layer
                          │
                    PostgreSQL Database
```

---

# 🛠 Tech Stack

## Frontend
- React 19
- Vite
- React Router
- Axios

## Backend
- Node.js
- Express.js
- JWT Authentication
- bcryptjs

## Database
- PostgreSQL

## Other Tools
- REST APIs
- Git & GitHub

---

# 📂 Project Structure

```
TransitOps
│
├── transitops-frontend
│   ├── src
│   ├── components
│   ├── assets
│   └── package.json
│
├── transitops-backend
│   ├── controllers
│   ├── middleware
│   ├── routes
│   ├── db.js
│   ├── seed.js
│   └── package.json
│
└── README.md
```

---

# 🚀 Getting Started

## Clone the repository

```bash
git clone https://github.com/yourusername/TransitOps.git

cd TransitOps
```

---

## Backend Setup

Navigate to backend

```bash
cd transitops-backend
```

Install dependencies

```bash
npm install
```

Create a `.env`

```env
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=transitops_db

JWT_SECRET=your_secret_key

PORT=5000
```

Start the server

```bash
node index.js
```

or

```bash
nodemon index.js
```

---

## Frontend Setup

Navigate to frontend

```bash
cd transitops-frontend
```

Install packages

```bash
npm install
```

Run

```bash
npm run dev
```

---

# 🔑 Core Modules

| Module | Description |
|---------|-------------|
| Authentication | JWT-based login system |
| Vehicle Registry | Fleet inventory management |
| Driver Management | Driver allocation & availability |
| Dispatch Engine | Intelligent trip assignment |
| Maintenance | Vehicle servicing records |
| Reports | Fleet KPIs & financial insights |

---

# 🔒 Security Features

- JWT Authentication
- Password Hashing (bcrypt)
- Protected API Routes
- Role-Based Access Control
- Authorization Middleware

---

# 📈 Future Improvements

- Live GPS Tracking
- Route Optimization
- Email Notifications
- Predictive Maintenance using AI
- Fuel Consumption Forecasting
- Driver Performance Analytics
- Mobile Application
- Real-time WebSocket Updates

---

# 💡 Why TransitOps?

Managing logistics manually often leads to:

- Vehicle conflicts
- Driver double-booking
- Poor fleet utilization
- Missing maintenance schedules
- Limited operational visibility

TransitOps solves these challenges with intelligent scheduling, secure access control, and centralized fleet management—helping organizations operate more efficiently and make data-driven decisions.

---
