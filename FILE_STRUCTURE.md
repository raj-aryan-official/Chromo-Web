# Chromo-Web File Structure

This document explains the purpose of each major file and directory in the Chromo-Web project.

---

## 📂 Project Root
- **`backend/`**: Contains the Node.js/Express server code.
- **`frontend/`**: Contains the React/Vite frontend code.
- **`API_DOCUMENTATION.md`**: Detailed documentation of API endpoints.
- **`FILE_STRUCTURE.md`**: This document.
- **`website_flow.md`**: Explains the overall logic and user flow of the website.

---

## 🏗️ Backend Structure (`backend/src/`)

### 📁 `controllers/`
Contains the business logic for each API route.
- **`userController.js`**: Handles user profile registration, retrieval, and updates.
- **`productController.js`**: Fetches product listings and details from the DB.
- **`cartController.js`**: Logic for adding, removing, and updating items in the cart.
- **`orderController.js`**: Logic for creating and fetching customer orders.
- **`paymentController.js`**: (In development) Logic for handling payment processing.

### 📁 `models/`
Defines the Mongoose schemas for MongoDB.
- **`User.js`**: Defines user data (Name, Email, Firebase UID, Phone, Addresses).
- **`Product.js`**: Defines product information (Name, Company, Variants/Price, Rating).
- **`Cart.js`**: Structure for storing user cart items temporarily.
- **`Order.js`**: Defines the finalized order data (Items, Total, Address, Payment Status).

### 📁 `routes/`
Defines the URL endpoints and maps them to controllers.
- **`userRoutes.js`**, **`productRoutes.js`**, **`cartRoutes.js`**, **`orderRoutes.js`**: Endpoint definitions for each feature.

### 📁 `database/`
- **`connection.js`**: Handles the connection to MongoDB Atlas and provides error diagnostics.

### 🛠️ Core Files
- **`app.js`**: Initializes Express, sets up Middlewares (CORS, JSON), and registers routes.
- **`server.js`**: Entry point that starts the server on the specified port.
- **`.env`**: Stores sensitive environment variables (MONGO_URI, PORT).

---

## 🎨 Frontend Structure (`frontend/src/`)

### 📁 `pages/`
Complete view components for each route.
- **`Home/`**: The landing page with product grids and search.
- **`Login/`** & **`Register/`**: User authentication interfaces.
- **`Cart/`**: View and manage items before checkout.
- **`Checkout/`**: Multi-step process to finalize an order.
- **`Profile/`**: Manage user details, addresses, and phone numbers.
- **`Orders/`**: View the user's order history.

### 📁 `components/`
Reusable UI units used across multiple pages.
- **`common/Header/`** & **`Footer/`**: Global navigation and footer.
- **`common/ProductCard/`**: Display individual product info/actions.

### 📁 `context/`
State management providers.
- **`AuthContext.jsx`**: Manages the Firebase authenticated user state.
- **`CartContext.jsx`**: Synchronizes the cart state with the backend.

### 🛠️ Core Files
- **`App.jsx`**: Main routing file using `react-router-dom`.
- **`config.js`**: Central configuration for the API Base URL.
- **`firebase.js`**: Firebase configuration and initialization.
- **`.env`**: Local development configuration (VITE_API_URL).
- **`.env.example`**: Template for environment variables.

---
*Created by Antigravity*
