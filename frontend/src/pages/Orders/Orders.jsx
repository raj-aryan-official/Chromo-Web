import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Search } from 'lucide-react';
import Navbar from '../../components/common/Navbar/Navbar';
import Footer from '../../components/common/Footer/Footer';
import styles from './Orders.module.css';

const Orders = () => {
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    fetch(`http://localhost:5000/api/orders/${currentUser.uid}`)
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed fetching orders:", err);
        setLoading(false);
      });
  }, [currentUser]);

  // Format Amazon style delivery date (e.g. Delivered 22 December)
  const getDeliveryStatus = (orderDate) => {
    const d = new Date(orderDate);
    d.setDate(d.getDate() + 2); // mockup 2 day delivery
    return `Delivered ${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}`;
  };

  const handleBuyAgain = async (item) => {
    if (item?.productId?._id) {
       await addToCart(item.productId._id, item.variant || { weight: 'Standard', price: item.price }, 1);
       navigate('/cart');
    }
  };

  const handleComingSoon = () => {
     alert("This feature is currently under active development!");
  };

  const handleSearch = () => {
     setAppliedSearch(searchTerm.trim());
  };

  const filteredOrders = orders.filter(order => {
    if (!appliedSearch) return true;
    const searchLower = appliedSearch.toLowerCase();
    
    // Check partial Order ID matches natively
    if (order._id.toLowerCase().includes(searchLower)) return true;
    
    // Check product names, brands, and variations structurally
    return order.items.some(item => 
      item.name?.toLowerCase().includes(searchLower) ||
      item.company?.toLowerCase().includes(searchLower) ||
      item.variant?.weight?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <main className={styles.container}>
        
        {/* Amazon-style Page Header & Top Search */}
        <div className={styles.topSection}>
          <div className={styles.titleRow}>
            <h1 className={styles.pageTitle}>Your Orders</h1>
            <div className={styles.searchBox}>
              <div className={styles.searchInputWrapper}>
                <Search size={18} className={styles.searchIcon} />
                <input 
                  type="text" 
                  placeholder="Search all orders" 
                  className={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button className={styles.searchBtn} onClick={handleSearch}>Search Orders</button>
            </div>
          </div>
          
          <div className={styles.tabsStrip}>
            <button className={`${styles.tabBtn} ${styles.activeTab}`} onClick={handleComingSoon}>Orders</button>
            <button className={styles.tabBtn} onClick={handleComingSoon}>Buy Again</button>
            <button className={styles.tabBtn} onClick={handleComingSoon}>Not Yet Shipped</button>
          </div>
          
          <div className={styles.filterRow}>
            <span className={styles.orderCount}><strong>{orders.length} orders</strong> placed in</span>
            <select className={styles.yearSelect}>
               <option>2026</option>
               <option>2025</option>
               <option>past 3 months</option>
            </select>
          </div>
        </div>

        {loading ? (
           <p className={styles.loadingText}>Fetching order history...</p>
        ) : orders.length === 0 ? (
          <div className={styles.contentBox}>
             <p>Looks like you haven't bought any premium paints yet.</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className={styles.contentBox}>
             <p>No orders matched your search for "{appliedSearch}".</p>
             <button className={styles.clearSearchBtn} onClick={() => { setSearchTerm(''); setAppliedSearch(''); }}>Clear Search</button>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {filteredOrders.map(order => (
               <div key={order._id} className={styles.amazonOrderCard}>
                 
                 {/* Card Header (Grey) */}
                 <div className={styles.cardHeader}>
                   <div className={styles.headerLeftGroup}>
                     <div className={styles.headerBlock}>
                       <span className={styles.headLabel}>ORDER PLACED</span>
                       <span className={styles.headValue}>{new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric'})}</span>
                     </div>
                     <div className={styles.headerBlock}>
                       <span className={styles.headLabel}>TOTAL</span>
                       <span className={styles.headValue}>₹{order.totalAmount?.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                     </div>
                     <div className={styles.headerBlock}>
                       <span className={styles.headLabel}>SHIP TO</span>
                       <div style={{display: 'flex', flexDirection: 'column'}}>
                         <span className={styles.headValueLink} onClick={handleComingSoon}>{order.shippingAddress?.tag || 'Customer'}</span>
                         <span style={{fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.2rem'}}>{order.contactInfo?.phone}</span>
                       </div>
                     </div>
                   </div>
                   
                   <div className={styles.headerRightBlock}>
                     <div className={styles.headLabelRight}>ORDER # {order._id.substring(0, 15).toUpperCase()}</div>
                     <div className={styles.subLinks}>
                       <span className={styles.headValueLink} onClick={handleComingSoon}>View order details</span>
                       <span className={styles.separator}>|</span>
                       <span className={styles.headValueLink} onClick={handleComingSoon}>Invoice</span>
                     </div>
                   </div>
                 </div>
                 
                 {/* Card Body (White) */}
                 <div className={styles.cardBody}>
                   <div className={styles.statusRow}>
                     <div className={styles.statusLeft}>
                       <h2 className={styles.deliveryHeading}>{getDeliveryStatus(order.createdAt)}</h2>
                       <p className={styles.deliverySubtext}>Package was handed to resident</p>
                     </div>
                     <div className={styles.statusRight}>
                       <button className={styles.actionBtnOutlineLong} onClick={() => navigate(`/product/${order.items[0]?.productId?._id || ''}`)}>Write a product review</button>
                     </div>
                   </div>

                   <div className={styles.itemsBlock}>
                      {order.items.map((item, idx) => (
                        <div key={idx} className={styles.itemRow}>
                          <div 
                             className={styles.itemImageWrapper}
                             onClick={() => navigate(`/product/${item?.productId?._id || item.productId}`)}
                             style={{ cursor: 'pointer' }}
                          >
                             {/* Color Thumbnail dynamically loaded from Mongo populate */}
                             <div className={styles.itemColorBox} style={{backgroundColor: item?.productId?.colorHex || '#444'}}></div>
                          </div>
                          <div className={styles.itemContent}>
                             <a href={`/product/${item?.productId?._id || ''}`} className={styles.itemLinkText}>
                               {item.company} | Premium Paint | {item.name} | {item.variant?.weight} | Washable & Durable | Rich Color
                             </a>
                             <p className={styles.returnText}>Return window closed on {new Date(order.createdAt).toLocaleDateString()}</p>
                             
                             <div className={styles.itemActionRow}>
                               <button className={styles.buyAgainPill} onClick={() => handleBuyAgain(item)}>
                                 <svg viewBox="0 0 24 24" className={styles.reloadIcon}><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>
                                 Buy it again
                               </button>
                               <button className={styles.actionBtnOutline} onClick={() => navigate(`/product/${item?.productId?._id || item.productId}`)}>View your item</button>
                             </div>
                          </div>
                        </div>
                      ))}
                   </div>

                 </div>
               </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
