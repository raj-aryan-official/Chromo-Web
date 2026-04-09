import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar/Navbar';
import Footer from '../../components/common/Footer/Footer';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Heart, Eye, ArrowRight, Tag } from 'lucide-react';
import styles from './Home.module.css';

const Home = () => {
  const [featuredPaints, setFeaturedPaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedMap, setLikedMap] = useState({});
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { currentUser } = useAuth();

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setFeaturedPaints(data.slice(0, 4));
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

  const companies = [
    { name: "Asian Paints", img: "https://images.unsplash.com/photo-1563906267088-b029e7101114?w=300" },
    { name: "Berger Paints", img: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300" },
    { name: "Nerolac", img: "https://images.unsplash.com/photo-1572295727871-7638149ea3d7?w=300" },
    { name: "Dulux", img: "https://images.unsplash.com/photo-1581850518616-bcb8077a2336?w=300" },
  ];

  const types = [
    { name: "Premium Matte", color: "#6C5CE7" },
    { name: "High Gloss Enamel", color: "#FF7675" },
    { name: "Satin Finish", color: "#00B894" },
    { name: "Weatherproof Exterior", color: "#FDCB6E" },
  ];

  const handleQuickAdd = async (e, paint) => {
    e.stopPropagation();
    if (paint.variants && paint.variants.length > 0) {
      await addToCart(paint._id, paint.variants[0], 1);
      alert("Added to cart!");
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      
      <main className={styles.mainContent}>
        
        {/* HERO BANNER - OFFERS */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <span className={styles.dealBadge}>🔥 Biggest Sale of the Year</span>
            <h1>Transform Your Space.<br/>Save up to 40% on Premium Paints.</h1>
            <p>Get the best deals on top brands, DIY kits, and wall coverings.</p>
            <button className={styles.shopNowBtn} onClick={() => navigate('/paints')}>
              Shop All Paints <ArrowRight size={18} />
            </button>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.floatingPaintCan}>🎨</div>
          </div>
        </section>

        {/* SHOP BY COMPANY */}
        <section className={styles.categorySection}>
          <div className={styles.sectionHeader}>
            <h2>Shop by Brand</h2>
            <button onClick={() => navigate('/paints')} className={styles.viewAll}>View All Brands</button>
          </div>
          <div className={styles.companyGrid}>
            {companies.map((company, idx) => (
              <div key={idx} className={styles.companyCard} onClick={() => navigate('/paints')}>
                <img src={company.img} alt={company.name} />
                <h3>{company.name}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* SHOP BY TYPE */}
        <section className={styles.categorySection}>
          <div className={styles.sectionHeader}>
            <h2>Shop by Finish</h2>
          </div>
          <div className={styles.typeGrid}>
            {types.map((type, idx) => (
              <div key={idx} className={styles.typeCard} style={{ '--hover-color': type.color }} onClick={() => navigate('/paints')}>
                <div className={styles.typeColorBlob} style={{ background: type.color }}></div>
                <h3>{type.name}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* RECENTLY VIEWED & LIKED (FEATURED FROM DB) */}
        <section className={styles.categorySection}>
          <div className={styles.sectionHeader}>
            <h2>Recently Viewed & Loved <Heart size={24} color="#FF4757" fill="#FF4757" style={{marginLeft:'10px'}}/></h2>
          </div>
          
          {loading ? (
             <div className={styles.loadingContainer}>Loading fresh paints from DB...</div>
          ) : (
            <div className={styles.productGrid}>
              {featuredPaints.map((paint) => (
                <div key={paint._id} className={styles.productCard} onClick={() => navigate(`/product/${paint._id}`)}>
                  <div className={styles.colorDisplay} style={{ backgroundColor: paint.colorHex || '#FFD700' }}>
                    <div className={styles.iconsOverlay}>
                      <button className={styles.iconBtn} onClick={(e) => handleLikeToggle(e, paint._id)}>
                        <Heart size={18} fill={likedMap[paint._id] ? "#FF4757" : "transparent"} color={likedMap[paint._id] ? "#FF4757" : "#fff"} />
                      </button>
                      <button className={styles.iconBtn}><Eye size={18} /></button>
                    </div>
                  </div>
                  <div className={styles.productInfo}>
                    <div className={styles.productHeader}>
                      <h3 className={styles.productName}>{paint.name}</h3>
                      <span className={styles.productPrice}>₹{paint.variants[0]?.price.toLocaleString('en-IN') || 0}</span>
                    </div>
                    <span className={styles.productType}>{paint.company} - {paint.type}</span>
                    <button className={styles.addToCartBtn} onClick={(e) => handleQuickAdd(e, paint)}>
                      Quick Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* OTHER PRODUCTS BANNER */}
        <section className={styles.otherProductsSection}>
          <div className={styles.otherContent}>
            <h2>Looking for tools or decor?</h2>
            <p>Brushes, wallpapers, lamps, and DIY kits—everything you need for a complete room makeover.</p>
            <button className={styles.outlineBtn} onClick={() => navigate('/shop')}>
               Explore Other Products <ArrowRight size={18} />
            </button>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default Home;
