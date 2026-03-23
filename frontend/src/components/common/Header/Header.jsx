import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingCart, User, Paintbrush, MapPin, Search, Package } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import styles from './Header.module.css';

const Header = () => {
  const { currentUser } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [defaultAddress, setDefaultAddress] = useState('Select delivery location');
  
  const isLoggedIn = !!currentUser;

  // Sync search input if URL changes remotely
  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    if (currentUser) {
      // Fetch user profile to get default address
      fetch(`http://localhost:5000/api/users/${currentUser.uid}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.addresses && data.addresses.length > 0) {
            const defAddr = data.addresses.find(a => a.isDefault) || data.addresses[0];
            if (defAddr && defAddr.tag) setDefaultAddress(defAddr.tag);
          } else {
             setDefaultAddress('Add an address');
          }
        })
        .catch(err => console.error("Could not fetch address", err));
    } else {
      setDefaultAddress('Select delivery location');
    }
  }, [currentUser]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate(`/`);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        
        {/* 1 & 2. Logo & Brand */}
        <Link to="/" className={styles.logoContainer}>
          <div className={styles.logoIcon}>
            <Paintbrush size={24} color="#fff" />
          </div>
          <span className={styles.logoText}>Chromo</span>
        </Link>
        
        {/* 3. Interactive Address Widget */}
        <div className={styles.addressWidget} onClick={() => navigate('/profile')}>
           <MapPin size={22} className={styles.addressIcon} />
           <div className={styles.addressTextStack}>
             <span className={styles.deliverToText}>Deliver to {currentUser ? currentUser.email.split('@')[0] : 'Guest'}</span>
             <span className={styles.addressTag}>{defaultAddress}</span>
           </div>
        </div>

        {/* 4. Universal Search Bar */}
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <input 
            type="text" 
            className={styles.searchInput} 
            placeholder="Search vibrant paints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className={styles.searchSubmitBtn}>
            <Search size={20} color="#05050c" />
          </button>
        </form>
        
        {/* 5, 6, 7. Navigation & Actions */}
        <div className={styles.navActions}>
          {isLoggedIn ? (
             <>
               <Link to="/orders" className={styles.actionBlock}>
                  <Package size={20} className={styles.actionIcon} />
                  <div className={styles.actionTextStack}>
                    <span className={styles.actionTitleTop}>Returns</span>
                    <span className={styles.actionTitleBottom}>& Orders</span>
                  </div>
               </Link>
               
               <Link to="/profile" className={styles.actionBlock}>
                 <User size={20} className={styles.actionIcon} />
                 <div className={styles.actionTextStack}>
                    <span className={styles.actionTitleTop}>Hello, {currentUser.email.split('@')[0]}</span>
                    <span className={styles.actionTitleBottom}>Profile & Lists</span>
                  </div>
               </Link>

               <Link to="/cart" className={styles.cartBlock} aria-label="Cart">
                 <div className={styles.cartIconWrapper}>
                   <ShoppingCart size={28} />
                   {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
                 </div>
                 <span className={styles.cartLabel}>Cart</span>
               </Link>
             </>
          ) : (
            <>
              <Link to="/login" className={styles.loginBtn}>Login</Link>
              <Link to="/register" className={styles.registerBtn}>Register</Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;
