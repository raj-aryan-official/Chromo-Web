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
- [Architecture](#-architecture)
- [User Journey](#-user-journey)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Admin Panel](#-admin-panel)
- [Testing Guide](#-testing-guide)
- [Troubleshooting](#-troubleshooting)
- [Author](#-author)

---

## 🌟 Overview

**Chromo** is a full-stack, color-first paint discovery and e-commerce platform. Users struggle to choose the right paint color due to overwhelming brand options, complex specifications, and zero visualization — leading to costly mistakes. Chromo solves this by offering a guided, visual, end-to-end experience to **discover, compare, calculate, and purchase** paint with confidence.

---

## ✨ Features

### 🛍️ Shopping & Commerce
- **Browse Paints** — Filter by brand, type (Interior/Exterior/Primer), and color
- **Product Detail Pages** — Full variant info, color swatches, price breakdown
- **Cart System** — Persistent cart synced to MongoDB, live preview in navbar
- **Checkout Flow** — Address selection, COD payment, order review & placement
- **Order Management** — Full order history with live status tracking

### 🎨 Color Tools
- **Palette Studio** — Generate harmonious color palettes from any base color
- **Liked Paints** — Save and revisit your favourite paint colors
- **Saved Palettes** — Persist generated palettes to your account
- **Paint Calculator** — Estimate paint quantity by room dimensions

### 👤 User Experience
- **Firebase Authentication** — Secure sign up / login / logout
- **Real-time Notifications** — Live order-based alerts in the navbar bell (order placed, shipped, delivered)
- **Profile Management** — Update name, manage multiple delivery addresses
- **Expert Connect** — Book consultations with paint professionals
- **Paint Guide** — Educational content for DIY enthusiasts

### 🛡️ Admin Panel
- **Product Management** — Add, edit, delete paint products with multiple weight variants
- **Duplicate Prevention** — Blocks duplicate products (same name + company + type, case-insensitive)
- **Order Management** — View all orders, update status in real-time (Processing → Shipped → Delivered)
- **Stats Dashboard** — Live product count and total order count
- **Role-based Access** — Admin-only routes protected on both frontend and backend

---

## 🏗️ Architecture

The application follows a modern decoupled architecture:

```mermaid
graph TD
    User((User))

    subgraph Frontend [Vite Dev Server / Netlify]
        React[React + Vite SPA]
        Config[config.js: API Management]
    end

    subgraph Auth [Google Cloud]
        Firebase[Firebase Authentication]
    end

    subgraph Backend [Node.js / Render]
        Express[Express REST API]
    end

    subgraph Database [MongoDB Atlas]
        Atlas[(MongoDB Cluster)]
    end

    User --> React
    React -- Auth Request --> Firebase
    Firebase -- UID Token --> React
    React -- API Calls + UID --> Express
    Express -- CRUD Ops --> Atlas
```

---

## 🚶 User Journey

### Phase 1 — Authentication & Onboarding
1. **Landing Page (`/`)** — User views featured paint products
2. **Register (`/register`)** — Firebase creates credentials → backend syncs UID to MongoDB
3. **Login (`/login`)** — Existing users sign in via Firebase

### Phase 2 — Browsing & Discovery
1. **Search & Filters** — Search by brand, filter by finish type
2. **Product Detail (`/product/:id`)** — View variants, select weight (1L / 4L / 20L), see live price

### Phase 3 — Cart & Shipping
1. **Add to Cart** — Persisted in MongoDB via `/api/cart`, available across devices
2. **Cart Page (`/cart`)** — Review items, adjust quantities, manage addresses

### Phase 4 — Checkout & Fulfillment
1. **Payment Selection** — Choose payment method (Cash on Delivery)
2. **Order Review** — Final summary of items, address, and total
3. **Place Order** — `POST /api/orders` → cart cleared → order record created
4. **Order History (`/orders`)** — View all past orders and their statuses

### Phase 5 — Notifications
- Bell icon fetches live order data; shows per-user notifications
- Each notification is clickable → navigates to `/orders`
- Status icons: 🕐 Processing · 🚚 Shipped · 📦 Out for Delivery · ✅ Delivered · ❌ Cancelled

---

## 🔧 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 (JSX), Vite 6, CSS Modules |
| **Styling** | Vanilla CSS, Lucide React icons, Google Fonts (Inter) |
| **State** | React Context API (AuthContext + CartContext) |
| **Authentication** | Firebase Auth (Email/Password) |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB Atlas + Mongoose 9 |
| **API Style** | REST |

---

## 📁 Project Structure

```
Chromo-Web/
├── frontend/                        # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar/          # Main navigation bar with live notifications
│   │   │   │   ├── Header/          # Alternate header component
│   │   │   │   ├── Footer/          # Site footer
│   │   │   │   └── QuickLinks/      # Category quick links bar
│   │   │   ├── AdminProducts/       # Admin product CRUD component
│   │   │   └── AdminOrders/         # Admin order management component
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Firebase auth + role state
│   │   │   └── CartContext.jsx      # Shopping cart state + sync
│   │   ├── pages/
│   │   │   ├── Home/                # Landing page
│   │   │   ├── Paints/              # Paint browser with filters
│   │   │   ├── ProductPage/         # Individual product detail
│   │   │   ├── PaletteStudio/       # Color palette generator
│   │   │   ├── Cart/                # Shopping cart
│   │   │   ├── Checkout/            # Payment + review
│   │   │   ├── Orders/              # Order history
│   │   │   ├── Profile/             # User profile & addresses
│   │   │   ├── LikedPaints/         # Saved favourite paints
│   │   │   ├── SavedPalettes/       # Saved colour palettes
│   │   │   ├── Shop/                # General shop
│   │   │   ├── PaintGuide/          # Educational paint guide
│   │   │   ├── ExpertConnect/       # Consultation booking
│   │   │   ├── PaintCalculator/     # Paint quantity estimator
│   │   │   ├── Login/ & Register/   # Auth pages
│   │   │   └── Admin/               # Admin dashboard (protected)
│   │   ├── services/
│   │   │   └── adminService.js      # Admin API calls
│   │   ├── firebase.js              # Firebase config & init
│   │   ├── config.js                # API base URL config
│   │   └── App.jsx                  # Root routes (react-router-dom)
│   └── package.json
│
└── backend/                         # Node.js + Express API
    ├── src/
    │   ├── controllers/
    │   │   ├── userController.js    # User profile, likes, palettes
    │   │   ├── productController.js # Product listing & detail
    │   │   ├── cartController.js    # Cart CRUD
    │   │   ├── orderController.js   # Order creation & retrieval
    │   │   └── adminController.js   # Admin product & order management
    │   ├── models/
    │   │   ├── User.js              # role: 'user' | 'admin'
    │   │   ├── Product.js           # Name, company, variants, colorHex
    │   │   ├── Cart.js              # User cart items
    │   │   └── Order.js             # Finalized orders
    │   ├── routes/
    │   │   ├── userRoutes.js
    │   │   ├── productRoutes.js
    │   │   ├── cartRoutes.js
    │   │   ├── orderRoutes.js
    │   │   └── adminRoutes.js
    │   ├── middleware/
    │   │   ├── authMiddleware.js    # Firebase UID verification
    │   │   └── isAdminMiddleware.js # Admin role gate
    │   ├── database/
    │   │   └── connection.js
    │   ├── app.js                   # Express setup, CORS, routes
    │   └── server.js                # Entry point
    ├── updateUserRole.js            # CLI script to promote users to admin
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18, npm ≥ 9
- MongoDB Atlas account
- Firebase project (Email/Password auth enabled)

### 1. Clone the repo
```bash
git clone https://github.com/raj-aryan-official/Chromo-Web.git
cd Chromo-Web
```

### 2. Install dependencies
```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 3. Configure environment variables
See [Environment Variables](#-environment-variables) below.

### 4. Run backend
```bash
cd backend
npm start
# → http://localhost:5000
```

### 5. Run frontend
```bash
cd frontend
npm run dev
# → http://localhost:5173
```

---

## 🔐 Environment Variables

### `backend/.env`
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/chromo
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-service-account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
JWT_SECRET=your_secure_jwt_secret
```

### `frontend/.env`
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

Base URL: `http://localhost:5000` (dev) · `VITE_API_URL` (prod)

### 👤 Users — `/api/users`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/` | Register / sync user after Firebase auth |
| `GET` | `/:uid` | Get user profile by Firebase UID |
| `PUT` | `/:uid` | Update name, phone, addresses |
| `POST` | `/:uid/like` | Toggle liked paint |
| `POST` | `/:uid/palette` | Save a generated palette |

**PUT body example:**
```json
{
  "name": "Raj Aryan",
  "addresses": [{ "tag": "Home", "text": "123 Main St", "isDefault": true }]
}
```

### 🎨 Products — `/api/products`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | All products |
| `GET` | `/:id` | Single product by MongoDB ID |

### 🛒 Cart — `/api/cart`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/:uid` | Get user cart |
| `POST` | `/:uid` | Add item to cart |
| `PUT` | `/:uid/item/:itemId` | Increment / decrement quantity |
| `DELETE` | `/:uid/item/:itemId` | Remove specific item |
| `DELETE` | `/:uid/clear` | Clear entire cart |

**Add to cart body:**
```json
{ "productId": "PRODUCT_ID", "variant": { "weight": "1L", "price": 500 }, "quantity": 1 }
```

### 📦 Orders — `/api/orders`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/` | Place a new order |
| `GET` | `/all` | All orders (admin only) |
| `GET` | `/:uid` | Orders for a specific user |

**Place order body:**
```json
{
  "firebaseUid": "UID",
  "items": [...],
  "shippingAddress": { "tag": "Home", "text": "123 St" },
  "contactInfo": { "phone": "9876543210" },
  "paymentMethod": "Cash on Delivery",
  "totalAmount": 3276
}
```

### 🛡️ Admin — `/api/admin`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/products` | Add new product |
| `PUT` | `/products/:id` | Update product |
| `DELETE` | `/products/:id` | Delete product |
| `GET` | `/orders` | All orders with stats |
| `PUT` | `/orders/:id/status` | Update order status |
| `GET` | `/stats` | Revenue + order breakdown |

---

## 🛡️ Admin Panel

### Accessing the Admin Dashboard

1. Log in with the admin account
2. Click the **Admin** button in the navbar (visible only to admins)
3. Or navigate directly to `http://localhost:5173/admin`

### Promoting a User to Admin

```bash
cd backend
node updateUserRole.js rajaryan620666@gmail.com
```

### Admin Capabilities

| Feature | Details |
|---|---|
| **Products** | Add, edit, delete with multiple weight/price variants |
| **Duplicate Guard** | Blocks same name + company + type (case-insensitive) |
| **Orders** | View all orders, filter by status, update status in real-time |
| **Stats** | Live product count + total order count on dashboard |
| **Security** | Role enforced on frontend (redirect) + backend (middleware chain) |

### Security Layers

```
Request → authMiddleware (Firebase UID check) → isAdminMiddleware (role check) → controller
```

### Duplicate Product Logic
```javascript
// Checked on every add/edit:
const existing = await Product.findOne({
  name: { $regex: `^${name}$`, $options: 'i' },
  company: { $regex: `^${company}$`, $options: 'i' },
  type: type
});
if (existing) return res.status(409).json({ message: 'Product already exists' });
```

---

## 🧪 Testing Guide

### Core User Flows

| Scenario | Steps | Expected |
|---|---|---|
| **Register** | `/register` → fill form → submit | Firebase account created + MongoDB record synced |
| **Login** | `/login` → enter credentials | Auth token stored, navbar updates |
| **Add to Cart** | Product page → select variant → Add to Cart | Item persists across page refreshes |
| **Checkout** | Cart → Checkout → Place Order | Order created, cart cleared, redirect to `/orders` |
| **Notifications** | Bell icon after placing order | Order notification appears with details |

### Admin Test Scenarios

| Scenario | Expected |
|---|---|
| Login as admin → visit `/admin` | Dashboard loads with Products & Orders tabs |
| Add product (unique) | ✅ Success message, product appears in grid |
| Add same product again | ❌ `409` error: "Product already exists" |
| Change company/type of duplicate | ✅ Added successfully |
| Update order status | Status badge changes, customer notification updates |
| Filter orders by status | Only matching orders shown |
| Login as non-admin → visit `/admin` | "Access Denied" page with redirect |

### API Testing with Postman

```
// Add product
POST http://localhost:5000/api/admin/products
Headers: { Authorization: "Bearer YOUR_FIREBASE_UID" }
Body: {
  "name": "Test Paint",
  "company": "Asian Paints",
  "type": "Interior",
  "colorHex": "#3498DB",
  "variants": [{ "weight": "1L", "price": 299 }]
}
```

---

## 🔧 Troubleshooting

| Problem | Solution |
|---|---|
| Admin button not visible | Ensure you're logged in as `rajaryan620666@gmail.com`. Run `node updateUserRole.js your@email.com` if needed. |
| Orders count shows 0 | Ensure backend is running and `/api/orders/all` returns data |
| `phone` validation error on register | Backend uses `updateOne` with `$set` to bypass Mongoose strict validation |
| `500` on `/api/users` | Check backend logs; `phone` field fallback is handled automatically |
| CORS errors | Ensure backend `.env` `VITE_API_URL` matches your frontend origin |
| Notifications empty | User must have placed at least one order; notifications are per-user |

---

## 👤 Author

<div align="center">

**Raj Aryan**
2nd Year Computer Science · OJT Project

[![GitHub](https://img.shields.io/badge/GitHub-raj--aryan--official-181717?style=for-the-badge&logo=github)](https://github.com/raj-aryan-official)

*Chromo — Color-First Paint Discovery & E-Commerce Platform*

</div>

---

<div align="center">
Made with ❤️ and a lot of 🎨 by Raj Aryan
</div>
