import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/common/Navbar/Navbar';
import Footer from '../../components/common/Footer/Footer';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Heart, Eye } from 'lucide-react';
import styles from './Paints.module.css';

const Paints = () => {
  const [paintProducts, setPaintProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [addedItemIds, setAddedItemIds] = useState({});
  const [likedMap, setLikedMap] = useState({});
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category') || '';
  const { addToCart } = useCart();
  const { currentUser } = useAuth();

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setPaintProducts(data);
        setLoading(false);
      });

    if (currentUser) {
      fetch(`http://localhost:5000/api/users/${currentUser.uid}`)
        .then(res => res.json())
        .then(data => {
          if (data.likedPaints) {
            const map = {};
            data.likedPaints.forEach(p => { map[p._id || p] = true });
            setLikedMap(map);
          }
        });
    }
  }, [currentUser]);

  const handleLikeToggle = async (e, productId) => {
    e.stopPropagation();
    if (!currentUser) return alert("Please log in to like paints.");
    
    setLikedMap(prev => ({...prev, [productId]: !prev[productId]}));
    try {
      await fetch(`http://localhost:5000/api/users/${currentUser.uid}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
    } catch(err) {
      setLikedMap(prev => ({...prev, [productId]: !prev[productId]}));
    }
  };

  const filteredPaints = paintProducts.filter(paint => {
    const matchesSearch = paint.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          paint.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'All' || paint.type.includes(activeTab);
    const matchesCategory = categoryFilter === 'new' ? (paint.tags && paint.tags.includes('new')) : true;
    return matchesSearch && matchesTab && matchesCategory;
  });

  const handleQuickView = (e, id) => {
    e.stopPropagation();
    navigate(`/product/${id}`);
  };

  const handleQuickAdd = async (e, paint) => {
    e.stopPropagation();
    if (paint.variants && paint.variants.length > 0) {
      const success = await addToCart(paint._id, paint.variants[0], 1);
      if (success !== false) {
        setAddedItemIds(prev => ({...prev, [paint._id]: true}));
        setTimeout(() => setAddedItemIds(prev => ({...prev, [paint._id]: false})), 2000);
      }
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <main className={styles.mainContent}>
        <div className={styles.glowBlob1}></div>
        <div className={styles.glowBlob2}></div>
        
        <section className={styles.productsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              {categoryFilter === 'new' ? '✨ New Colors' : 'All Paints'}
            </h2>
            <div className={styles.filterTabs}>
              <button className={`${styles.filterTab} ${activeTab === 'All' ? styles.active : ''}`} onClick={() => setActiveTab('All')}>All</button>
              <button className={`${styles.filterTab} ${activeTab === 'Enamel' ? styles.active : ''}`} onClick={() => setActiveTab('Enamel')}>Enamel</button>
              <button className={`${styles.filterTab} ${activeTab === 'Matte' ? styles.active : ''}`} onClick={() => setActiveTab('Matte')}>Matte</button>
            </div>
          </div>
          
          {loading ? (
             <div className={styles.loadingContainer}>Loading fresh paints from DB...</div>
          ) : filteredPaints.length > 0 ? (
            <div className={styles.productGrid}>
              {filteredPaints.map((paint) => (
                <div key={paint._id} className={styles.productCard} onClick={(e) => handleQuickView(e, paint._id)}>
                  <div className={styles.colorDisplay} style={{ backgroundColor: paint.colorHex || '#FFD700' }}>
                    <div className={styles.iconsOverlay}>
                      <button className={styles.iconBtn} onClick={(e) => handleLikeToggle(e, paint._id)}>
                        <Heart size={18} fill={likedMap[paint._id] ? "#FF4757" : "transparent"} color={likedMap[paint._id] ? "#FF4757" : "#fff"} />
                      </button>
                      <button className={styles.iconBtn} onClick={(e) => handleQuickView(e, paint._id)}>
                         <Eye size={18} />
                      </button>
                    </div>
                  </div>
                  <div className={styles.productInfo}>
                    <div className={styles.productHeader}>
                      <h3 className={styles.productName}>{paint.name}</h3>
                      <span className={styles.productPrice}>₹{paint.variants[0]?.price.toLocaleString('en-IN') || 0}</span>
                    </div>
                    <div className={styles.productMeta}>
                      <span className={styles.productType}>{paint.company} - {paint.type}</span>
                      <span className={styles.productRating}>★ {paint.rating}</span>
                    </div>
                    <button 
                      className={styles.addToCartBtn}
                      style={{ 
                        backgroundColor: addedItemIds[paint._id] ? '#92FE9D' : '',
                        color: addedItemIds[paint._id] ? '#05050c' : '',
                      }}
                      onClick={(e) => handleQuickAdd(e, paint)}
                    >
                      {addedItemIds[paint._id] ? '✓ Added!' : 'Quick Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>
              <p>No paints found matching "{searchTerm}"</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};
export default Paints;
