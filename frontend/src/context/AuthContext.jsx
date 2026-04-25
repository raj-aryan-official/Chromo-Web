import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'user' or 'admin'
  const [loading, setLoading] = useState(true);

  // Fetch user role directly by UID — works even without phone field
  const fetchUserRole = async (firebaseUid) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/${firebaseUid}`
      );
      if (response.ok) {
        const userData = await response.json();
        setUserRole(userData.role || 'user');
        console.log('✅ User role fetched:', userData.role, 'for', userData.email);
      } else {
        console.warn('User not found in DB, defaulting to user');
        setUserRole('user');
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole('user');
    }
  };

  useEffect(() => {
    try {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setCurrentUser(user);
        if (user) {
          await fetchUserRole(user.uid);
        } else {
          setUserRole(null);
        }
        
        setLoading(false);
      });
      return unsubscribe;
    } catch (error) {
      console.error("Firebase auth not initialized yet", error);
      // Fallback for UI visualization
      setCurrentUser(null);
      setUserRole(null);
      setLoading(false);
    }
  }, []);

  const value = { currentUser, userRole };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
