import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, User, Paintbrush, Search, Package, Menu, X, 
  Mic, MicOff, Bell, Clock, Tag, Settings, LogOut, Heart, Shield, ShoppingBag
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import QuickLinks from '../QuickLinks/QuickLinks';
import API_URL from '../../../config';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { currentUser, userRole, logout } = useAuth();
  const { cart, cartCount } = useCart();
  const items = cart?.items || [];
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
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('readNotifIds') || '[]')); }
    catch { return new Set(); }
  });
  
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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      // Prevent mobile bounce scrolling
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isMobileMenuOpen]);

  // Load search history
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history);
  }, []);

  // Fetch user orders and build real notifications
  useEffect(() => {
    if (!currentUser) { setNotifications([]); return; }
    fetch(`${API_URL}/api/orders/${currentUser.uid}`)
      .then(r => r.json())
      .then(orders => {
        if (!Array.isArray(orders)) return;
        const notifs = orders.map(order => {
          const shortId = order._id.toString().slice(-6).toUpperCase();
          const statusIcon = {
            'Processing': '🕐',
            'Shipped': '🚚',
            'Out for Delivery': '📦',
            'Delivered': '✅',
            'Cancelled': '❌'
          }[order.status] || '📋';
          const firstItem = order.items?.[0]?.name || 'your items';
          const text = order.status === 'Processing'
            ? `${statusIcon} Order #${shortId} placed — ${firstItem}${order.items?.length > 1 ? ` +${order.items.length - 1} more` : ''} · ₹${order.totalAmount?.toLocaleString('en-IN')}`
            : `${statusIcon} Order #${shortId} is now ${order.status}`;
          return { id: order._id, text, orderId: order._id, status: order.status, createdAt: order.createdAt };
        });
        // Sort newest first
        notifs.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNotifications(notifs);
      })
      .catch(() => setNotifications([]));
  }, [currentUser]);

  const markAllRead = () => {
    const allIds = notifications.map(n => n.id);
    const newSet = new Set(allIds);
    setReadIds(newSet);
    localStorage.setItem('readNotifIds', JSON.stringify([...newSet]));
  };

  const markOneRead = (id) => {
    const newSet = new Set(readIds);
    newSet.add(id);
    setReadIds(newSet);
    localStorage.setItem('readNotifIds', JSON.stringify([...newSet]));
  };

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

  const unreadCount = notifications.filter(n => !readIds.has(n.id)).length;

  return (
    <>
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

          {/* Admin Button — visible for admin */}
          {(userRole === 'admin' || currentUser?.email === 'rajaryan620666@gmail.com') && (
            <Link
              to="/admin"
              title="Admin Dashboard"
              className={styles.adminLink}
            >
              <Shield size={16} />
              Admin
            </Link>
          )}

          <div className={styles.bellContainer} ref={notifRef}>
            <button className={styles.actionBtn} onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={22} />
              {unreadCount > 0 && <span className={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>}
            </button>
            
            <div className={`${styles.dropdown} ${showNotifications ? styles.show : ''}`}>
              <div className={styles.dropdownHeader}>
                Notifications
                {unreadCount > 0 && <span style={{fontSize:'0.8rem', color:'#00C9FF', cursor:'pointer'}} onClick={markAllRead}>Mark all read</span>}
              </div>
              <div className={styles.notificationList}>
                {notifications.length === 0 ? (
                  <div style={{padding:'1.5rem', textAlign:'center', color:'rgba(255,255,255,0.35)', fontSize:'0.88rem'}}>
                    {currentUser ? 'No notifications yet' : 'Log in to see notifications'}
                  </div>
                ) : notifications.slice(0, 8).map(n => (
                  <div
                    key={n.id}
                    className={`${styles.notificationItem} ${!readIds.has(n.id) ? styles.unread : ''}`}
                    onClick={() => {
                      markOneRead(n.id);
                      setShowNotifications(false);
                      navigate('/orders');
                    }}
                    style={{cursor:'pointer'}}
                  >
                    <div style={{flex: 1, fontSize:'0.88rem'}}>{n.text}</div>
                    {!readIds.has(n.id) && <div style={{width:8, height:8, borderRadius:'50%', background:'#00C9FF', flexShrink:0, marginLeft:'0.5rem'}}></div>}
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
                <Link to="/shop"><ShoppingBag size={18}/> All Products</Link>
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
                          <h4>#{idx + 1} - {item.productId?.name || 'Product'}</h4>
                          <div className={styles.cartItemPrice}>Qty: {item.quantity} | {item.variant?.weight}</div>
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

    </nav>

    {/* MOBILE OVERLAY + MENU — outside <nav> to avoid stacking context trap */}
    <div className={`${styles.menuOverlay} ${isMobileMenuOpen ? styles.show : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
    <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`} onClick={(e) => e.stopPropagation()}>

        {/* ── Fixed Header ── */}
        <div className={styles.menuHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className={styles.logoIcon} style={{ width: 30, height: 30 }}>
              <Paintbrush size={17} color="#05050c" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#fff' }}>Chromo</span>
          </div>
          <button className={styles.closeMenuBtn} onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className={styles.menuScrollArea}>

          {/* User Card */}
          {currentUser ? (
            <div className={styles.mobileUserSection} style={{ marginTop: '1rem' }}>
              <div className={styles.mobileUserAvatar}>
                {currentUser.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className={styles.mobileUserInfo}>
                <div className={styles.mobileUserName}>{currentUser.email?.split('@')[0]}</div>
                <div className={styles.mobileUserEmail}>{currentUser.email}</div>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className={styles.menuItem}
              style={{ background: 'linear-gradient(135deg,#00C9FF,#92FE9D)', color: '#05050c', justifyContent: 'center', fontWeight: 700, marginTop: '1rem' }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign In to Chromo
            </Link>
          )}

          {/* ── Shop ── */}
          <p className={styles.menuSectionLabel}>Shop</p>
          <Link to="/" className={styles.menuItem} onClick={() => setIsMobileMenuOpen(false)}>🏠 Home</Link>
          <Link to="/shop" className={styles.menuItem} onClick={() => setIsMobileMenuOpen(false)}>🛍️ All Products</Link>
          <Link to="/paints" className={styles.menuItem} onClick={() => setIsMobileMenuOpen(false)}>🎨 Premium Paints</Link>
          <Link to="/paints?category=new" className={styles.menuItem} onClick={() => setIsMobileMenuOpen(false)}>✨ New Colors</Link>

          {/* ── Studio & Tools ── */}
          <p className={styles.menuSectionLabel}>Studio & Tools</p>
          <Link to="/palette-studio" className={styles.menuItem} onClick={() => setIsMobileMenuOpen(false)}>🖌️ Palette Studio</Link>
          <Link to="/calculator" className={styles.menuItem} onClick={() => setIsMobileMenuOpen(false)}>🧮 Paint Calculator</Link>
          <Link to="/paint-guide" className={styles.menuItem} onClick={() => setIsMobileMenuOpen(false)}>📖 Paint Guide</Link>

          {/* ── Support ── */}
          <p className={styles.menuSectionLabel}>Support</p>
          <Link to="/expert" className={styles.menuItem} onClick={() => setIsMobileMenuOpen(false)}>👨‍🔧 Connect to Expert</Link>

          {/* ── Account (logged in) ── */}
          {currentUser && (
            <>
              <p className={styles.menuSectionLabel}>My Account</p>
              <Link to="/orders" className={styles.menuItem} onClick={() => setIsMobileMenuOpen(false)}>📦 My Orders</Link>
              <Link to="/liked-paints" className={styles.menuItem} onClick={() => setIsMobileMenuOpen(false)}>❤️ Liked Paints</Link>
              <Link to="/saved-palettes" className={styles.menuItem} onClick={() => setIsMobileMenuOpen(false)}>🎨 Saved Palettes</Link>
              <Link to="/cart" className={styles.menuItem} onClick={() => setIsMobileMenuOpen(false)}>🛒 My Cart</Link>
              <Link to="/profile" className={styles.menuItem} onClick={() => setIsMobileMenuOpen(false)}>⚙️ Settings & Profile</Link>

              {/* Admin (only visible for admin) */}
              {(userRole === 'admin' || currentUser?.email === 'rajaryan620666@gmail.com') && (
                <Link to="/admin" className={styles.menuItem} onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#00C9FF' }}>
                  🛡️ Admin Dashboard
                </Link>
              )}

              <div className={styles.menuDivider} />
              <button
                className={styles.menuSignOutBtn}
                onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
              >
                🚪 Sign Out
              </button>
            </>
          )}

          {/* Not logged in — show links */}
          {!currentUser && (
            <>
              <p className={styles.menuSectionLabel}>Account</p>
              <Link to="/login" className={styles.menuItem} onClick={() => setIsMobileMenuOpen(false)}>🔑 Sign In</Link>
              <Link to="/register" className={styles.menuItem} onClick={() => setIsMobileMenuOpen(false)}>✍️ Create Account</Link>
            </>
          )}

        </div>
      </div>

    </>
  );
};

export default Navbar;
