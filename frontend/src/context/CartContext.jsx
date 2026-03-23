import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = async () => {
    if (!currentUser) {
      setCart(null);
      setCartCount(0);
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${currentUser.uid}`);
      if (res.ok) {
        const data = await res.json();
        setCart(data);
        const count = data.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
        setCartCount(count);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  // Synchronize cart instantly when a user logs in or out
  useEffect(() => {
    fetchCart();
  }, [currentUser]);

  const addToCart = async (productId, variant, quantity = 1) => {
    if (!currentUser) {
      navigate('/login', { state: { message: 'First login to add to cart' } });
      return false;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${currentUser.uid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, variant, quantity })
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data);
        const count = data.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
        setCartCount(count);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error adding to cart:', err);
      return false;
    }
  };

  const removeFromCart = async (itemId) => {
    if (!currentUser) return false;
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${currentUser.uid}/item/${itemId}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        setCart(data);
        const count = data.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
        setCartCount(count);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error removing from cart:', err);
      return false;
    }
  };

  const clearCart = async () => {
    if (!currentUser) return false;
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${currentUser.uid}/clear`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        setCart(data);
        setCartCount(0);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error clearing cart:', err);
      return false;
    }
  };

  const updateQuantity = async (itemId, type) => {
    if (!currentUser) return false;
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${currentUser.uid}/item/${itemId}`, { 
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ type })
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data);
        const count = data.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
        setCartCount(count);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating quantity:', err);
      return false;
    }
  };

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, removeFromCart, clearCart, updateQuantity, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}
