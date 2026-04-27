import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar/Navbar';
import Footer from '../../components/common/Footer/Footer';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import API_URL from '../../config';
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
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        setFeaturedPaints(data.slice(0, 4));
        setLoading(false);
      });

    if (currentUser) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/${currentUser.uid}`)
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

    setLikedMap(prev => ({ ...prev, [productId]: !prev[productId] }));
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/${currentUser.uid}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
    } catch (err) {
      setLikedMap(prev => ({ ...prev, [productId]: !prev[productId] }));
    }
  };

  const companies = [
    { name: "Asian Paints", img: "https://images.unsplash.com/photo-1562259942-ed8de1d52044?w=400", bg: "#ffffff" },
    { name: "Berger Paints", img: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400", bg: "#ffffff" },
    { name: "Nerolac", img: "https://images.unsplash.com/photo-1574342416972-e10398f6d8fb?w=400", bg: "#ffffff" },
    { name: "Dulux", img: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=400", bg: "#ffffff" },
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
            <h1>Transform Your Space.<br />Save up to 40% on Premium Paints.</h1>
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
              <div key={idx} className={styles.companyCard} onClick={() => navigate('/paints')} style={{ background: company.bg || 'rgba(255,255,255,0.05)' }}>
                <div className={styles.logoWrapper}>
                  <img src={company.img} alt={company.name} className={styles.actualLogo} />
                </div>
                <h3 className={styles.companyNameText}>{company.name}</h3>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h2>Recently Viewed & Loved <Heart size={24} color="#FF4757" fill="#FF4757" style={{ marginLeft: '10px' }} /></h2>
            </div>
            <button onClick={() => navigate('/shop')} className={styles.viewAll}>View All Products</button>
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

        {/* WHY CHOOSE US SECTION */}
        <section className={styles.featuresSection}>
          <div className={styles.sectionHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', width: '100%' }}>
              <h2 style={{ textAlign: 'center', width: '100%' }}>Why Choose Chromo? 🌟</h2>
            </div>
            <p style={{ textAlign: 'center', color: '#9ca3af', maxWidth: '600px', margin: '0.5rem auto 2rem' }}>Experience the revolutionary way to discover, preview, and purchase the perfect paint and tools for your ultimate home makeover.</p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💧</div>
              <h3>Spill-Proof Packaging</h3>
              <p>All our paints are delivered with military-grade sealed lids ensuring zero leakage during transit.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎯</div>
              <h3>Color Match Guarantee</h3>
              <p>What you see on your screen is 99.9% accurate to what you'll see on your walls.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⏱️</div>
              <h3>Same Day Dispatch</h3>
              <p>Order before 4 PM and we will freshly mix and dispatch your customized colors immediately.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>👨‍🔧</div>
              <h3>Live Expert Support</h3>
              <p>Stuck on an edge? Our experts are available 24/7 to guide your painting process live via video.</p>
            </div>
          </div>
        </section>

        {/* MEGA BRAND DEALS SECTION */}
        <section className={styles.categorySection} style={{ marginTop: '6rem' }}>
          <div className={styles.sectionHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h2>🔥 Exclusive Brand Deals</h2>
            </div>
            <button className={styles.viewAll} onClick={() => navigate('/shop')}>Browse All Sales→</button>
          </div>

          <div className={styles.dealsGrid}>
            {/* Deal 1 */}
            <div className={styles.dealsCard} style={{ background: 'linear-gradient(to right, #1a2a6c, #b21f1f, #fdbb2d)' }} onClick={() => navigate('/shop')}>
              <div className={styles.dealContent}>
                <h3>Asian Paints Mega Bundle</h3>
                <p>Flat 50% Off on Interior Emulsions & Accompanying Tools</p>
                <div className={styles.dealPrice}>From ₹1,499</div>
              </div>
            </div>

            {/* Deal 2 */}
            <div className={styles.dealsCard} style={{ background: 'linear-gradient(to right, #00467F, #A5CC82)' }} onClick={() => navigate('/shop')}>
              <div className={styles.dealContent}>
                <h3>Berger WeatherCoat Fest</h3>
                <p>Exterior Protections + Waterproofing Sealants up to 30% Off</p>
                <div className={styles.dealPrice}>From ₹899</div>
              </div>
            </div>

            {/* Deal 3 */}
            <div className={styles.dealsCard} style={{ background: 'linear-gradient(to right, #ff4e50, #f9d423)' }} onClick={() => navigate('/shop')}>
              <div className={styles.dealContent}>
                <h3>Nerolac Decorative Clearance</h3>
                <p>Buy 2 Wallpapers, Get 1 DIY Makeover ToolKit Free!</p>
                <div className={styles.dealPrice}>Starting ₹499</div>
              </div>
            </div>

            {/* Deal 4 */}
            <div className={styles.dealsCard} style={{ background: 'linear-gradient(to right, #141e30, #243b55)' }} onClick={() => navigate('/shop')}>
              <div className={styles.dealContent}>
                <h3>Dulux Premium Finishes</h3>
                <p>Specialty Velvet Touch Paints + Free Color Consultation App</p>
                <div className={styles.dealPrice}>Flat 20% Off</div>
              </div>
            </div>
          </div>
        </section>

        {/* PROMO BANNER */}
        <section className={styles.promoBanner}>
          <div className={styles.promoContent}>
            <h2>Revamp Your Entire Home <br /> This Festive Season! 🎉</h2>
            <p>Get up to 40% OFF on all DIY Room Makeover Kits and bundled accessories.</p>
            <button className={styles.promoBtn} onClick={() => navigate('/shop')}>Claim Discount</button>
          </div>
          <div className={styles.promoImage}>
            <img src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600" alt="Festive Sale" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
