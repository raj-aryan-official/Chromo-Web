import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, User, Paintbrush, Search, Package, Menu, X, 
  Mic, MicOff, Bell, Clock, Tag, Settings, LogOut, Heart
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import QuickLinks from '../QuickLinks/QuickLinks';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { cartCount, items } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Feature states
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Search feature states
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Dropdown states
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Your order #1024 has shipped!", unread: true },
    { id: 2, text: "New Palette Studio features available", unread: true },
    { id: 3, text: "Save 20% on Matte finishes this weekend", unread: false }
  ]);
  
  // Refs for click outside
  const searchRef = useRef(null);
  const accountRef = useRef(null);
  const notifRef = useRef(null);
  const cartRef = useRef(null);
  const searchInputRef = useRef(null);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load search history
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history);
  }, []);

  // Click outside detection
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setShowAccountMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setShowCartPreview(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Features Actions
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Add to history
      const newHistory = [searchTerm, ...searchHistory.filter(h => h !== searchTerm)].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      setShowSearchDropdown(false);
      navigate(`/?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice search isn't supported in your browser.");
      return;
    }
    
    // Use Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
      setTimeout(() => {
        navigate(`/?q=${encodeURIComponent(transcript.trim())}`);
      }, 500);
    };
    
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleLogout = async () => {
    try {
      if (logout) await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <nav className={styles.navbar} style={isScrolled ? { boxShadow: '0 5px 20px rgba(0,0,0,0.3)' } : {}}>
      
      <div className={styles.topSection}>
        {/* LEFT: Hamburger + Logo */}
        <div className={styles.leftContainer}>
          <button className={styles.hamburgerBtn} onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>

          <Link to="/" className={styles.logoContainer}>
            <div className={styles.logoIcon}>
              <Paintbrush size={24} color="#05050c" />
            </div>
            <span className={styles.logoText}>Chromo</span>
          </Link>
        </div>

        {/* CENTER: Search Bar */}
        <div className={styles.searchContainer} ref={searchRef}>
          <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
            <Search size={18} className={styles.searchIcon} style={{marginLeft: '0.5rem', color: 'var(--text-muted)'}} />
            <input 
              ref={searchInputRef}
              type="text" 
              className={styles.searchInput} 
              placeholder="Search colors, products, brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowSearchDropdown(true)}
            />
            <button type="button" className={`${styles.voiceSearchBtn} ${isListening ? styles.active : ''}`} onClick={startVoiceSearch}>
              {isListening ? <Mic size={18} /> : <MicOff size={18} />}
            </button>
            <button type="submit" className={styles.searchSubmitBtn}>
              Search
            </button>
          </form>

          {/* Search Dropdown / History */}
          {showSearchDropdown && searchHistory.length > 0 && !searchTerm && (
            <div className={styles.searchResults}>
              <div className={styles.historyHeader}>Recent Searches</div>
              {searchHistory.map((item, index) => (
                <div key={index} className={styles.searchItem} onClick={() => {
                  setSearchTerm(item);
                  navigate(`/?q=${encodeURIComponent(item)}`);
                  setShowSearchDropdown(false);
                }}>
                  <Clock size={14} color="var(--text-muted)" />
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Actions */}
        <div className={styles.rightActions}>
          <div className={styles.bellContainer} ref={notifRef}>
            <button className={styles.actionBtn} onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={22} />
              {unreadCount > 0 && <span className={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>}
            </button>
            
            <div className={`${styles.dropdown} ${showNotifications ? styles.show : ''}`}>
              <div className={styles.dropdownHeader}>
                Notifications
                {unreadCount > 0 && <span style={{fontSize:'0.8rem', color:'#00C9FF', cursor:'pointer'}} onClick={() => setNotifications(notifications.map(n => ({...n, unread: false})))}>Mark all read</span>}
              </div>
              <div className={styles.notificationList}>
                {notifications.map(n => (
                  <div key={n.id} className={`${styles.notificationItem} ${n.unread ? styles.unread : ''}`}>
                    <div style={{flex: 1}}>{n.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.accountContainer} ref={accountRef}>
            {currentUser ? (
              <div className={styles.accountMenu} onClick={() => setShowAccountMenu(!showAccountMenu)}>
                <User size={22} className={styles.actionBtn} />
              </div>
            ) : (
              <Link to="/login" className={styles.signInBtn}>Sign In</Link>
            )}

            <div className={`${styles.dropdown} ${styles.accountDropdown} ${showAccountMenu ? styles.show : ''}`}>
              <div className={styles.accountHeader}>
                <span className={styles.userName}>Hello, {currentUser?.email?.split('@')[0] || 'User'}</span>
                <span className={styles.userEmail}>{currentUser?.email || ''}</span>
              </div>
              <div className={styles.accountLinks}>
                <Link to="/profile"><User size={18}/> My Account</Link>
                <Link to="/orders"><Package size={18}/> Order History</Link>
                <Link to="/liked-paints"><Heart size={18} fill="#FF4757" color="#FF4757" /> Liked Paints</Link>
                <Link to="/saved-palettes"><Heart size={18}/> Saved Palettes</Link>
                <Link to="/profile"><Settings size={18}/> Settings</Link>
                <button className={styles.signOutBtn} onClick={handleLogout}><LogOut size={18}/> Sign Out</button>
              </div>
            </div>
          </div>

          <div className={styles.cartContainer} ref={cartRef} onMouseEnter={() => setShowCartPreview(true)} onMouseLeave={() => setShowCartPreview(false)}>
            <Link to="/cart" className={styles.actionBtn}>
              <ShoppingCart size={24} />
              {cartCount > 0 && <span className={styles.badge}>{cartCount > 9 ? '9+' : cartCount}</span>}
            </Link>

            <div className={`${styles.dropdown} ${styles.cartPreview} ${showCartPreview ? styles.show : ''}`}>
              <div className={styles.dropdownHeader}>Cart Preview ({cartCount} items)</div>
              {(!items || items.length === 0) ? (
                <div className={styles.cartEmpty}>Your cart is empty</div>
              ) : (
                <>
                  <div className={styles.cartItems}>
                    {items.slice(0,3).map((item, idx) => (
                      <div key={idx} className={styles.cartItem}>
                        <div className={styles.cartItemInfo}>
                          <h4>Product ID: {item.product}</h4>
                          <div className={styles.cartItemPrice}>Qty: {item.quantity}</div>
                        </div>
                      </div>
                    ))}
                    {items.length > 3 && <div style={{textAlign:'center', padding:'0.5rem', color:'var(--text-muted)'}}>...and {items.length - 3} more items</div>}
                  </div>
                  <div className={styles.cartFooter}>
                    <Link to="/cart" className={styles.checkoutBtn}>View Full Cart</Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <QuickLinks />

      {/* MOBILE HAMBURGER MENU */}
      <div className={`${styles.menuOverlay} ${isMobileMenuOpen ? styles.show : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
        <button className={styles.closeMenuBtn} onClick={() => setIsMobileMenuOpen(false)}>
          <X size={28} />
        </button>
        <div className={styles.menuCategories}>
          <h3 style={{color: '#888', marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.9rem'}}>Browse Colors</h3>
          <Link to="/" className={styles.menuItem}>Enamel Finishes</Link>
          <Link to="/" className={styles.menuItem}>Matte Finishes</Link>
          <Link to="/" className={styles.menuItem}>Glossy Finishes</Link>
          
          <h3 style={{color: '#888', margin: '2rem 0 1rem', textTransform: 'uppercase', fontSize: '0.9rem'}}>Palette Studio</h3>
          <Link to="/palette-studio" className={styles.menuItem}>Create Harmonies</Link>
          <Link to="/palette-studio" className={styles.menuItem}>Trending Combos</Link>

          <h3 style={{color: '#888', margin: '2rem 0 1rem', textTransform: 'uppercase', fontSize: '0.9rem'}}>More</h3>
          <Link to="/calculator" className={styles.menuItem}>Paint Calculator</Link>
          <Link to="/expert" className={styles.menuItem}>Live Consultations</Link>
          {currentUser && <button className={styles.menuItem} style={{background:'none', border:'none', textAlign:'left', width:'100%', color:'#ff4757', borderBottom:'1px solid var(--border-color)', cursor:'pointer'}} onClick={handleLogout}>Sign Out</button>}
        </div>
      </div>

    </nav>
  );
};

export default Navbar;
