import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import Cart from './pages/Cart/Cart';
import Orders from './pages/Orders/Orders';
import PaymentSelection from './pages/Checkout/PaymentSelection';
import ReviewOrder from './pages/Checkout/ReviewOrder';
import ProductPage from './pages/ProductPage/ProductPage';
import { CartProvider } from './context/CartContext';
import './App.css'; // Global overriding styles if needed

function App() {
  return (
    <AuthProvider>
      <Router>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout/payment" element={<PaymentSelection />} />
            <Route path="/checkout/review" element={<ReviewOrder />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/product/:id" element={<ProductPage />} />
          </Routes>
        </CartProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
