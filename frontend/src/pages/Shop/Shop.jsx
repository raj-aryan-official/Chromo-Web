import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar/Navbar';
import Footer from '../../components/common/Footer/Footer';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Heart, Eye, Filter, ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './Shop.module.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedItemIds, setAddedItemIds] = useState({});
  const [likedMap, setLikedMap] = useState({});
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const categories = [
    'All',
    'Paint', 
    'Painting Tools & Accessories', 
    'Primers & Wall Putty', 
    'Wall Coverings', 
    'Décor & Lighting', 
    'DIY Kits & Bundles', 
    'Specialty Paints', 
    'Adhesives & Sealants', 
    'Storage & Organization'
  ];

  const brands = [
    'All', 'Asian Paints', 'Nerolac', 'Berger Paints', 'Dulux', 'Sherwin-Williams', 'Chromo Custom', 
    'Behr', 'Jotun', 'Nippon Paint', 'Indigo Paints', 'Shalimar Paints', 'JSW Paints', 'Kamdhenu Paints'
  ];

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.sort(() => Math.random() - 0.5));
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
    if (!currentUser) return alert("Please log in to like products.");
    
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

  const handleQuickAdd = async (e, product) => {
    e.stopPropagation();
    if (product.variants && product.variants.length > 0) {
      const success = await addToCart(product._id, product.variants[0], 1);
      if (success !== false) {
        setAddedItemIds(prev => ({...prev, [product._id]: true}));
        setTimeout(() => setAddedItemIds(prev => ({...prev, [product._id]: false})), 2000);
      }
    }
  };

  const filteredProducts = products.filter(p => {
    const pCat = p.type;
    // Some products from Paints have types like Enamel, Matte, but their tags include 'paint'
    const isPaintCategorySelected = selectedCategory === 'Paint';
    const matchesCategory = selectedCategory === 'All' ? true 
        : isPaintCategorySelected ? p.tags?.includes('paint')
        : pCat === selectedCategory;
        
    const matchesBrand = selectedBrand === 'All' ? true : p.company === selectedBrand;
    return matchesCategory && matchesBrand;
  });

  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      
      <main className={styles.mainContent}>
        <div className={styles.shopLayout}>
          {/* SIDEBAR FILTER */}
          <aside className={styles.sidebar}>
            <div className={styles.filterGroup}>
              <h3><Filter size={16}/> Categories</h3>
              <ul>
                {categories.map(cat => (
                  <li 
                    key={cat} 
                    className={selectedCategory === cat ? styles.activeFilter : ''}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className={styles.filterGroup}>
              <h3>Brands</h3>
              <ul>
                {brands.map(brand => (
                  <li 
                    key={brand} 
                    className={selectedBrand === brand ? styles.activeFilter : ''}
                    onClick={() => setSelectedBrand(brand)}
                  >
                    {brand}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* PRODUCT GRID */}
          <section className={styles.productSection}>
            <div className={styles.resultsHeader}>
              <span>Showing {filteredProducts.length} Results</span>
            </div>
          
            {loading ? (
              <div className={styles.loadingContainer}>Loading massive catalog...</div>
            ) : filteredProducts.length > 0 ? (
              <div className={styles.productGrid}>
                {filteredProducts.map((product) => (
                  <div key={product._id} className={styles.productCard} onClick={() => navigate(`/product/${product._id}`)}>
                    <div className={styles.colorDisplay} style={{ backgroundColor: product.colorHex || '#2a2a35' }}>
                      {product.image && (
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} 
                        />
                      )}
                      {(() => {
                        let displayBadge = null;
                        if (product.tags) {
                          if (product.tags.includes('new')) {
                            displayBadge = '✨ New';
                          } else {
                            const special = product.tags.find(t => t.includes('🌟') || t.includes('❤️') || t.includes('✨') || t.includes('💎') || t.includes('🔥'));
                            if (special) displayBadge = special;
                          }
                        }
                        return displayBadge ? (
                          <span className={`${styles.newBadge} ${displayBadge === '✨ New' ? '' : styles.specialBadge}`}>
                            {displayBadge}
                          </span>
                        ) : null;
                      })()}
                      <div className={styles.iconsOverlay}>
                        <button className={styles.iconBtn} onClick={(e) => handleLikeToggle(e, product._id)}>
                          <Heart size={18} fill={likedMap[product._id] ? "#FF4757" : "transparent"} color={likedMap[product._id] ? "#FF4757" : "#fff"} />
                        </button>
                      </div>
                    </div>
                    <div className={styles.productInfo}>
                      <div className={styles.productHeader}>
                        <h3 className={styles.productName}>{product.name}</h3>
                        <span className={styles.productPrice}>₹{product.variants[0]?.price.toLocaleString('en-IN') || 0}</span>
                      </div>
                      <div className={styles.productMeta}>
                        <span className={styles.productType}>{product.type} • {product.company}</span>
                        <span className={styles.productRating}>★ {product.rating}</span>
                      </div>
                      <button 
                        className={styles.addToCartBtn}
                        style={{ 
                          backgroundColor: addedItemIds[product._id] ? '#92FE9D' : '',
                          color: addedItemIds[product._id] ? '#05050c' : '',
                        }}
                        onClick={(e) => handleQuickAdd(e, product)}
                      >
                        {addedItemIds[product._id] ? '✓ Added!' : 'Quick Add to Cart'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noResults}>
                <p>No products found for this combination of filters.</p>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
