import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/common/Header/Header';
import Footer from '../../components/common/Footer/Footer';
import { useCart } from '../../context/CartContext';
import styles from './Home.module.css';

const Home = () => {
  const [paintProducts, setPaintProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [addedItemIds, setAddedItemIds] = useState({});
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('q') || '';
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setPaintProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed fetching paints", err);
        setLoading(false);
      });
  }, []);

  const filteredPaints = paintProducts.filter(paint => {
    const matchesSearch = paint.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          paint.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'All' || paint.type.includes(activeTab);
    return matchesSearch && matchesTab;
  });

  const handleQuickView = (e, id) => {
    e.stopPropagation();
    navigate(`/product/${id}`);
  };

  const handleQuickAdd = async (e, paint) => {
    e.stopPropagation();
    if (paint.variants && paint.variants.length > 0) {
      // Adding default default selected variant safely
      const success = await addToCart(paint._id, paint.variants[0], 1);
      
      // Visual feedback
      if (success !== false) {
        setAddedItemIds(prev => ({...prev, [paint._id]: true}));
        setTimeout(() => {
          setAddedItemIds(prev => ({...prev, [paint._id]: false}));
        }, 2000);
      }
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />
      
      <main className={styles.mainContent}>
        <div className={styles.glowBlob1}></div>
        <div className={styles.glowBlob2}></div>
        
        {/* Products Grid Section */}
        <section className={styles.productsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured Colors</h2>
            
            <div className={styles.filterTabs}>
              <button 
                className={`${styles.filterTab} ${activeTab === 'All' ? styles.active : ''}`}
                onClick={() => setActiveTab('All')}
              >All</button>
              <button 
                className={`${styles.filterTab} ${activeTab === 'Enamel' ? styles.active : ''}`}
                onClick={() => setActiveTab('Enamel')}
              >Enamel</button>
              <button 
                className={`${styles.filterTab} ${activeTab === 'Matte' ? styles.active : ''}`}
                onClick={() => setActiveTab('Matte')}
              >Matte</button>
            </div>
          </div>
          
          {loading ? (
             <div className={styles.loadingContainer}>Loading fresh paints from DB...</div>
          ) : filteredPaints.length > 0 ? (
            <div className={styles.productGrid}>
              {filteredPaints.map((paint) => (
                <div 
                  key={paint._id} 
                  className={styles.productCard} 
                  onClick={(e) => handleQuickView(e, paint._id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.colorDisplay} style={{ backgroundColor: paint.colorHex || '#FFD700' }}>
                    <div className={styles.overlay}>
                      <button 
                        className={styles.quickViewBtn} 
                        onClick={(e) => handleQuickView(e, paint._id)}
                      >
                        Quick View
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
                        transition: 'all 0.3s ease'
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

export default Home;
