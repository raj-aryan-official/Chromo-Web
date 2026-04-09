import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, Truck, ShoppingCart, Minus, Plus, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import styles from './ProductPage.module.css';
import Navbar from '../../components/common/Navbar/Navbar';
import Footer from '../../components/common/Footer/Footer';
import API_URL from '../../config';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();

    if (currentUser) {
      fetch(`http://localhost:5000/api/users/${currentUser.uid}`)
        .then(res => res.json())
        .then(data => {
          if (data.likedPaints && data.likedPaints.some(p => (p._id || p) === id)) {
            setIsLiked(true);
          }
        });
    }
  }, [id, currentUser]);

  const handleLikeToggle = async () => {
    if (!currentUser) return alert("Please log in to like paints.");
    
    setIsLiked(!isLiked);
    try {
      await fetch(`http://localhost:5000/api/users/${currentUser.uid}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id })
      });
    } catch(err) {
      setIsLiked(!isLiked);
    }
  };

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) return;
    setAdding(true);
    const success = await addToCart(product._id, selectedVariant, quantity);
    setAdding(false);
    if (success) {
      // Optional: Show a nice toast rather than navigating
      // navigate('/cart');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading perfect colors...</div>;
  }

  if (!product) {
    return <div className={styles.error}>Product not found</div>;
  }

  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <main className={styles.mainContainer}>
        
        {/* Breadcrumb Navigation */}
        <div className={styles.breadcrumb}>
          <span onClick={() => navigate('/')}>Home</span> &gt; 
          <span onClick={() => navigate('/')}>Paints</span> &gt; 
          <span className={styles.currentBreadcrumb}>{product.company}</span>
        </div>

        <div className={styles.productLayout}>
          {/* Left Column: Images / Color Preview */}
          <div className={styles.imageColumn}>
             <div 
               className={styles.mainColorPreview} 
               style={{ backgroundColor: product.colorHex }}
             >
               <div className={styles.colorGlare}></div>
               <span className={styles.colorTag}>{product.colorHex}</span>
             </div>
             <div className={styles.thumbnailGallery}>
                <div className={`${styles.thumbnail} ${styles.active}`} style={{ backgroundColor: product.colorHex }}></div>
                <div className={styles.thumbnail}></div>
                <div className={styles.thumbnail}></div>
             </div>
          </div>

          {/* Middle Column: Details (Amazon Style) */}
          <div className={styles.detailsColumn}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h1 className={styles.productTitle}>{product.name}</h1>
              <button 
                 onClick={handleLikeToggle}
                 style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem', transition: 'transform 0.2s', alignSelf: 'center' }}
                 onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                 onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Heart size={32} fill={isLiked ? "#FF4757" : "transparent"} color={isLiked ? "#FF4757" : "#fff"} />
              </button>
            </div>
            <a href="#" className={styles.companyLink}>Visit the {product.company} Store</a>
            
            <div className={styles.ratingRow}>
              <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map(star => (
                   <Star 
                     key={star} 
                     size={16} 
                     color={star <= Math.floor(product.rating) ? '#FFD700' : '#4b5563'} 
                     fill={star <= Math.floor(product.rating) ? '#FFD700' : 'transparent'} 
                   />
                ))}
              </div>
              <span className={styles.ratingNumber}>{product.rating}</span>
              <span className={styles.reviewLinks}>({product.reviewCount} user ratings)</span>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.priceContainer}>
              <span className={styles.rupeeSymbol}>₹</span>
              <span className={styles.priceAmount}>{selectedVariant ? (selectedVariant.price * quantity).toLocaleString('en-IN') : 0}</span>
              <span className={styles.priceIncludes}>Inclusive of all taxes</span>
            </div>

            <p className={styles.description}>{product.description}</p>

            <div className={styles.specsTable}>
               <div className={styles.specRow}>
                  <span className={styles.specLabel}>Brand</span>
                  <span className={styles.specValue}>{product.company}</span>
               </div>
               <div className={styles.specRow}>
                  <span className={styles.specLabel}>Paint Type</span>
                  <span className={styles.specValue}>{product.type}</span>
               </div>
               <div className={styles.specRow}>
                  <span className={styles.specLabel}>Coverage Area</span>
                  <span className={styles.specValue}>Excellent</span>
               </div>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.variantsSection}>
              <h3>Weight / Size Options: <span className={styles.selectedSizeText}>{selectedVariant?.weight}</span></h3>
              <div className={styles.variantGrid}>
                {product.variants.map((variant, index) => (
                  <div 
                    key={index} 
                    className={`${styles.variantCard} ${selectedVariant?.weight === variant.weight ? styles.activeVariant : ''}`}
                    onClick={() => setSelectedVariant(variant)}
                  >
                    <span className={styles.variantWeight}>{variant.weight}</span>
                    <span className={styles.variantPrice}>₹{variant.price.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Action Card (Amazon Style Buy Box) */}
          <div className={styles.actionColumn}>
            <div className={styles.checkoutCard}>
              <h2 className={styles.checkoutPrice}>₹{selectedVariant ? (selectedVariant.price * quantity).toLocaleString('en-IN') : 0}</h2>
              <p className={styles.deliveryText}>
                <Truck size={16} /> FREE Delivery strictly by Chrono Standard.
              </p>
              
              <h4 className={styles.stockStatus}>In Stock</h4>
              
              <div className={styles.quantitySelector}>
                <span className={styles.qtyLabel}>Quantity:</span>
                <div className={styles.qtyControls}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className={styles.qtyBtn}><Minus size={14}/></button>
                  <span className={styles.qtyNumber}>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className={styles.qtyBtn}><Plus size={14}/></button>
                </div>
              </div>

              <button 
                className={styles.addToCartBtn} 
                onClick={handleAddToCart}
                disabled={adding}
              >
                <ShoppingCart size={18} />
                {adding ? 'Adding...' : 'Add to Cart'}
              </button>
              <button className={styles.buyNowBtn}>Buy Now</button>

              <div className={styles.secureTransaction}>
                <ShieldCheck size={16} color="#9ca3af" /> Secure transaction via ChronoPay
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
