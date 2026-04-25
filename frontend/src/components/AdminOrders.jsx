import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus, getOrderStats } from '../services/adminService';
import './AdminOrders.css';

/**
 * Admin Orders Component
 * View and manage all customer orders
 */
function AdminOrders({ userToken }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  const orderStatuses = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

  // Fetch orders and stats on mount
  useEffect(() => {
    fetchOrdersAndStats();
  }, []);

  const fetchOrdersAndStats = async () => {
    try {
      setLoading(true);
      const [ordersData, statsData] = await Promise.all([
        getAllOrders(userToken),
        getOrderStats(userToken)
      ]);
      setOrders(ordersData.orders || []);
      setStats(statsData.stats || null);
      setError('');
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setError('');
      await updateOrderStatus(userToken, orderId, newStatus);
      setSuccess('Order status updated successfully!');
      
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, status: newStatus }
          : order
      ));

      // Refresh stats
      const statsData = await getOrderStats(userToken);
      setStats(statsData.stats);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update order status');
    }
  };

  const getFilteredOrders = () => {
    if (filterStatus === 'All') return orders;
    return orders.filter(order => order.status === filterStatus);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = getFilteredOrders();

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="admin-orders">
      <div className="orders-header">
        <h2>Order Management</h2>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Statistics Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.totalOrders}</div>
            <div className="stat-label">Total Orders</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">₹{stats.totalRevenue.toLocaleString()}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
          {stats.ordersByStatus && stats.ordersByStatus.map(item => (
            <div key={item._id} className="stat-card">
              <div className="stat-value">{item.count}</div>
              <div className="stat-label">{item._id}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filter Buttons */}
      <div className="filter-section">
        <h3>Filter by Status</h3>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterStatus === 'All' ? 'active' : ''}`}
            onClick={() => setFilterStatus('All')}
          >
            All ({orders.length})
          </button>
          {orderStatuses.map(status => {
            const count = orders.filter(o => o.status === status).length;
            return (
              <button
                key={status}
                className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
                onClick={() => setFilterStatus(status)}
              >
                {status} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="orders-section">
        <h3>Orders ({filteredOrders.length})</h3>
        {filteredOrders.length === 0 ? (
          <p className="no-orders">No orders found.</p>
        ) : (
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Current Status</th>
                  <th>Update Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order._id} className="order-row">
                    <td className="order-id">{order._id.slice(-6).toUpperCase()}</td>
                    <td>
                      <div className="customer-info">
                        <div className="customer-name">{order.customerName}</div>
                        <div className="customer-email">{order.customerEmail}</div>
                        <div className="customer-phone">{order.customerPhone}</div>
                      </div>
                    </td>
                    <td>
                      <div className="items-list">
                        {order.items.map((item, i) => (
                          <div key={i} className="item">
                            <strong>{item.name}</strong>
                            <br />
                            <small>
                              {item.variant?.weight} x {item.quantity}
                            </small>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="amount">₹{order.totalAmount.toLocaleString()}</td>
                    <td>
                      <span className={`status-badge status-${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <select
                        className="status-select"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      >
                        {orderStatuses.map(status => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="date">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;
