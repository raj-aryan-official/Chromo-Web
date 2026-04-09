# Chromo-Web API Documentation

This document outlines the API endpoints, request/response structures, and the overall workflow for the Chromo-Web application.

## Base URL
- **Production**: Defined by your `VITE_API_URL` environment variable.
- **Development**: `http://localhost:5000`

---

## 1. User Management
Endpoints for user profiles and registration.

### `POST /api/users`
Registers a new user in MongoDB (typically called after Firebase Authentication).
- **Body**:
  ```json
  {
    "firebaseUid": "UNIQUE_ID",
    "name": "Full Name",
    "email": "user@example.com",
    "phone": "9988776655",
    "address": "Street, City, Zip"
  }
  ```

### `GET /api/users/:uid`
Retrieves a user's profile data using their Firebase UID.

### `PUT /api/users/:uid`
Updates user profile information.
- **Body** (all fields optional):
  ```json
  {
    "name": "Updated Name",
    "phone": "Updated Phone",
    "altPhone": "Alternative Phone",
    "addresses": [
      { "tag": "Home", "text": "New Address", "isDefault": true }
    ]
  }
  ```

---

## 2. Product Management
Endpoints for browsing and viewing products.

### `GET /api/products`
Returns a list of all products (paints).

### `GET /api/products/:id`
Returns detailed information for a specific product by its MongoDB ID.

---

## 3. Cart Management
Endpoints for managing the user's shopping cart.

### `GET /api/cart/:uid`
Retrieves the current cart for a specific user.

### `POST /api/cart/:uid`
Adds an item to the user's cart.
- **Body**:
  ```json
  {
    "productId": "PRODUCT_ID",
    "variant": { "size": "1L", "price": 500 },
    "quantity": 1
  }
  ```

### `PUT /api/cart/:uid/item/:itemId`
Updates the quantity of a specific item in the cart.
- **Body**:
  ```json
  { "type": "increment" } // or "decrement"
  ```

### `DELETE /api/cart/:uid/item/:itemId`
Removes a specific item from the cart.

### `DELETE /api/cart/:uid/clear`
Clears the entire cart for a user.

---

## 4. Order Management
Endpoints for placing and viewing orders.

### `POST /api/orders`
Creates a new order.
- **Body**:
  ```json
  {
    "userId": "FIREBASE_UID",
    "items": [...],
    "totalAmount": 1500,
    "shippingAddress": "...",
    "paymentMethod": "Card"
  }
  ```

### `GET /api/orders/:uid`
Retrieves all orders placed by a specific user.

---

## Technical Details
- **Frontend**: Built with React + Vite. Uses `API_URL` from `src/config.js`.
- **Backend**: Built with Node.js and Express. Connects to MongoDB Atlas using Mongoose.
- **Environment**: Managed via `.env` files and deployment platform settings.
