import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import AdminProducts from '../../components/AdminProducts';
import AdminOrders from '../../components/AdminOrders';
import './AdminDashboard.css';

function AdminDashboard() {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [productsCount, setProductsCount] = useState('—');
  const [ordersCount, setOrdersCount] = useState('—');
  const [usersCount, setUsersCount] = useState('—');

  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (currentUser) {
      fetch(`${API}/api/products`).then(r => r.json()).then(d => setProductsCount(Array.isArray(d) ? d.length : '—')).catch(() => {});
      fetch(`${API}/api/orders/all`).then(r => r.json()).then(d => setOrdersCount(Array.isArray(d) ? d.length : '—')).catch(() => {});
    }
  }, [currentUser]);

  // --- Access Denied ---
  if (!currentUser) {
    return (
      <div className="admin-access-denied">
        <div className="admin-denied-card">
          <div className="admin-denied-icon">🔐</div>
          <h2>Not Logged In</h2>
          <p>Please log in with an admin account to access the dashboard.</p>
          <button onClick={() => navigate('/login')}>Go to Login</button>
        </div>
      </div>
    );
  }

  if (userRole !== 'admin' && currentUser?.email !== 'rajaryan620666@gmail.com') {
    return (
      <div className="admin-access-denied">
        <div className="admin-denied-card">
          <div className="admin-denied-icon">🚫</div>
          <h2>Access Denied</h2>
          <p>You do not have admin privileges. Only administrators can access this panel.</p>
          <button onClick={() => navigate('/')}>Return to Home</button>
        </div>
      </div>
    );
  }

  const adminName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Admin';

  return (
    <div className="admin-page">

      {/* ── TOP NAV ──────────────────────────────────────── */}
      <nav className="admin-topnav">
        <Link to="/" className="admin-nav-brand">
          <div className="admin-nav-logo-icon">🎨</div>
          <span className="admin-nav-title">Chromo <span>Admin</span></span>
        </Link>

        <div className="admin-nav-right">
          <span className="admin-nav-badge">
            👑 Administrator
          </span>
          <span className="admin-nav-email">{currentUser?.email}</span>
          <Link to="/" className="admin-back-btn">
            ← Back to Store
          </Link>
        </div>
      </nav>

      {/* ── HERO BANNER ──────────────────────────────────── */}
      <div className="admin-hero">
        <div className="admin-hero-inner">
          <div>
            <h1>Welcome back, <span>{adminName}</span> 👋</h1>
            <p>Manage your Chromo store — products, orders, and more.</p>
          </div>

          <div className="admin-stats">
            <div className="admin-stat-card">
              <span className="admin-stat-icon">📦</span>
              <div>
                <div className="admin-stat-value">{productsCount}</div>
                <div className="admin-stat-label">Products</div>
              </div>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-icon">🧾</span>
              <div>
                <div className="admin-stat-value">{ordersCount}</div>
                <div className="admin-stat-label">Orders</div>
              </div>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-icon">🛡️</span>
              <div>
                <div className="admin-stat-value">Admin</div>
                <div className="admin-stat-label">Role</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────── */}
      <div className="admin-main">

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            📦 Manage Products
          </button>
          <button
            className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            🧾 Manage Orders
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'products' && (
          <div className="tab-content">
            <AdminProducts userToken={currentUser?.uid} />
          </div>
        )}
        {activeTab === 'orders' && (
          <div className="tab-content">
            <AdminOrders userToken={currentUser?.uid} />
          </div>
        )}
      </div>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="admin-footer">
        <span>Chromo</span> Admin Panel · Logged in as {currentUser?.email} · {new Date().getFullYear()}
      </footer>

    </div>
  );
}

export default AdminDashboard;
