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
import PaletteStudio from './pages/PaletteStudio/PaletteStudio';
import PaintCalculator from './pages/PaintCalculator/PaintCalculator';
import ExpertConnect from './pages/ExpertConnect/ExpertConnect';
import PaintGuide from './pages/PaintGuide/PaintGuide';
import Shop from './pages/Shop/Shop';
import Paints from './pages/Paints/Paints';
import LikedPaints from './pages/LikedPaints/LikedPaints';
import SavedPalettes from './pages/SavedPalettes/SavedPalettes';
import AdminDashboard from './pages/Admin/AdminDashboard';
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
            <Route path="/palette-studio" element={<PaletteStudio />} />
            <Route path="/calculator" element={<PaintCalculator />} />
            <Route path="/expert" element={<ExpertConnect />} />
            <Route path="/guide" element={<PaintGuide />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/paints" element={<Paints />} />
            <Route path="/liked-paints" element={<LikedPaints />} />
            <Route path="/saved-palettes" element={<SavedPalettes />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </CartProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
