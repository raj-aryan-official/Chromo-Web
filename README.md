<div align="center">

# 🎨 Chromo
### Color-First Paint Discovery & E-Commerce Platform

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)

> **Discover, visualize, and purchase the perfect paint — all in one place.**

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Admin Panel](#-admin-panel)
- [Author](#-author)

---

## 🌟 Overview

**Chromo** is a full-stack, color-first paint discovery and e-commerce platform built to solve a very real problem: people struggle to choose the right paint color and product. With overwhelming brand options, complex technical specifications, and zero visualization — most users end up making costly mistakes.

Chromo fixes that. It gives users a guided, visual, and end-to-end experience to **discover, compare, calculate, and purchase** paint with confidence.

---

## ✨ Features

### 🛍️ Shopping & Commerce
- **Browse Paints** — Filter by brand, type (Interior/Exterior/Primer), and color
- **Product Detail Pages** — Full variant info, color swatches, price breakdown
- **Cart System** — Add/remove items, live cart preview in navbar
- **Checkout Flow** — Address selection, COD payment, order placement
- **Order Management** — Full order history with live status tracking

### 🎨 Color Tools
- **Palette Studio** — Generate harmonious color palettes from any base color
- **Liked Paints** — Save and revisit your favorite paint colors
- **Saved Palettes** — Persist generated palettes to your account
- **Paint Calculator** — Estimate paint quantity by room dimensions

### 👤 User Experience
- **Firebase Authentication** — Secure sign up / login / logout
- **Real-time Notifications** — Order-based alerts in the navbar bell icon
- **Profile Management** — Update name, manage delivery addresses
- **Expert Connect** — Book consultations with paint professionals
- **Paint Guide** — Educational content for DIY enthusiasts

### 🛡️ Admin Panel
- **Product Management** — Add, edit, delete paint products with variants
- **Order Management** — View all orders, update order status in real-time
- **Stats Dashboard** — Live product count and order count overview
- **Role-based Access** — Admin-only routes protected on both frontend and backend

---

## 🔧 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 (JSX), Vite 6, CSS Modules |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB Atlas + Mongoose |
| **Authentication** | Firebase Auth (Email/Password) |
| **Icons** | Lucide React |
| **Fonts** | Google Fonts — Inter |
| **API Style** | REST |

---

## 📁 Project Structure

```
Chromo-Web/
├── frontend/                    # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar/      # Main navigation bar
│   │   │   │   ├── Header/      # Alternate header
│   │   │   │   ├── Footer/      # Site footer
│   │   │   │   └── QuickLinks/  # Category quick links bar
│   │   │   ├── AdminProducts/   # Admin product management
│   │   │   └── AdminOrders/     # Admin order management
│   │   ├── context/
│   │   │   ├── AuthContext.jsx  # Firebase auth + role state
│   │   │   └── CartContext.jsx  # Shopping cart state
│   │   ├── pages/
│   │   │   ├── Home/            # Landing page
│   │   │   ├── Paints/          # Paint browser
│   │   │   ├── ProductPage/     # Individual product
│   │   │   ├── PaletteStudio/   # Color palette generator
│   │   │   ├── Cart/            # Shopping cart
│   │   │   ├── Checkout/        # Payment + review
│   │   │   ├── Orders/          # Order history
│   │   │   ├── Profile/         # User profile
│   │   │   ├── LikedPaints/     # Saved favourite paints
│   │   │   ├── SavedPalettes/   # Saved colour palettes
│   │   │   ├── Shop/            # General shop
│   │   │   ├── PaintGuide/      # Educational paint guide
│   │   │   ├── ExpertConnect/   # Consultation booking
│   │   │   ├── PaintCalculator/ # Paint quantity estimator
│   │   │   ├── Login/           # Auth pages
│   │   │   ├── Register/
│   │   │   └── Admin/           # Admin dashboard
│   │   ├── services/
│   │   │   └── adminService.js  # Admin API calls
│   │   ├── firebase.js          # Firebase config
│   │   ├── config.js            # API base URL
│   │   └── App.jsx              # Root routes
│   └── package.json
│
└── backend/                     # Node.js + Express API
    ├── src/
    │   ├── controllers/
    │   │   ├── userController.js
    │   │   ├── productController.js
    │   │   ├── cartController.js
    │   │   ├── orderController.js
    │   │   └── adminController.js
    │   ├── models/
    │   │   ├── User.js
    │   │   ├── Product.js
    │   │   ├── Cart.js
    │   │   └── Order.js
    │   ├── routes/
    │   │   ├── userRoutes.js
    │   │   ├── productRoutes.js
    │   │   ├── cartRoutes.js
    │   │   ├── orderRoutes.js
    │   │   └── adminRoutes.js
    │   ├── middleware/
    │   │   └── authMiddleware.js
    │   ├── database/
    │   │   └── connection.js
    │   ├── app.js
    │   └── server.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- MongoDB Atlas account
- Firebase project

### 1. Clone the repository

```bash
git clone https://github.com/raj-aryan-official/Chromo-Web.git
cd Chromo-Web
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 4. Set up environment variables

See [Environment Variables](#-environment-variables) below.

### 5. Run the backend

```bash
cd backend
npm start
# Server starts at http://localhost:5000
```

### 6. Run the frontend

```bash
cd frontend
npm run dev
# App starts at http://localhost:5173
```

---

## 🔐 Environment Variables

### Backend — `backend/.env`

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/chromo
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-service-account@email.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
JWT_SECRET=your_secure_jwt_secret
```

### Frontend — `frontend/.env`

```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 📡 API Reference

### Users
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/users` | Register / sync user |
| `GET` | `/api/users/:uid` | Get user profile by Firebase UID |
| `PUT` | `/api/users/:uid` | Update name / addresses |
| `POST` | `/api/users/:uid/like` | Toggle liked paint |
| `POST` | `/api/users/:uid/palette` | Save a palette |

### Products
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Get all products |
| `GET` | `/api/products/:id` | Get single product |

### Cart
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/cart/:uid` | Get user cart |
| `POST` | `/api/cart/:uid` | Add item to cart |
| `DELETE` | `/api/cart/:uid/:itemId` | Remove cart item |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/orders` | Place a new order |
| `GET` | `/api/orders/:uid` | Get user orders |
| `GET` | `/api/orders/all` | Get all orders (admin only) |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/admin/products` | Add new product |
| `PUT` | `/api/admin/products/:id` | Update product |
| `DELETE` | `/api/admin/products/:id` | Delete product |
| `PUT` | `/api/admin/orders/:id` | Update order status |

---

## 🛡️ Admin Panel

The Admin Dashboard is accessible at `/admin` and is protected by role-based access control.

**To promote a user to admin:**

```bash
cd backend
node updateUserRole.js rajaryan620666@gmail.com
```

**Admin capabilities:**
- 📦 Add / Edit / Delete paint products with multiple weight variants
- 🧾 View all customer orders and update status (Processing → Shipped → Delivered)
- 📊 Live stats: product count and order count
- 🔒 Role enforced on both frontend (redirect) and backend (middleware)

---

## 👤 Author

<div align="center">

**Raj Aryan**
2nd Year Computer Science Student

[![GitHub](https://img.shields.io/badge/GitHub-raj--aryan--official-181717?style=for-the-badge&logo=github)](https://github.com/raj-aryan-official)

*OJT Project — Chromo: Color-First Paint Discovery & E-Commerce Platform*

</div>

---

<div align="center">
Made with ❤️ and a lot of 🎨 by Raj Aryan
</div>
