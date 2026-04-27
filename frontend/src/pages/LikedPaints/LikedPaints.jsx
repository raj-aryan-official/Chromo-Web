import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar/Navbar';
import Footer from '../../components/common/Footer/Footer';
import { Heart, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './LikedPaints.module.css';

const LikedPaints = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [likedPaints, setLikedPaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/${currentUser.uid}`)
      .then(res => res.json())
      .then(data => {
        setLikedPaints(data.likedPaints || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentUser, navigate]);

  const handleUnlike = async (productId) => {
    if(!currentUser) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/${currentUser.uid}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      setLikedPaints(prev => prev.filter(p => (p._id || p) !== productId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <main className={styles.mainContainer}>
        <div className={styles.header}>
          <h1><Heart size={32} color="#FF4757" fill="#FF4757" /> Liked Paints</h1>
          <p>Your curated collection of favorite colors and products.</p>
        </div>
        
        {loading ? (
          <div style={{textAlign:'center', marginTop:'4rem'}}><Loader2 className={styles.spinner} size={40}/></div>
        ) : (
          <div className={styles.grid}>
            {likedPaints.length > 0 ? (
              likedPaints.map((paint) => (
                <div key={paint._id} className={styles.card} onClick={() => navigate(`/product/${paint._id}`)}>
                  <div className={styles.colorDisplay} style={{ backgroundColor: paint.colorHex || '#FFD700' }}>
                    <button 
                      className={styles.unlikeBtn} 
                      onClick={(e) => { e.stopPropagation(); handleUnlike(paint._id); }}
                    >
                      <Heart size={20} fill="#FF4757" color="#FF4757" />
                    </button>
                  </div>
                  <div className={styles.info}>
                    <h3 className={styles.name}>{paint.name}</h3>
                    <span className={styles.company}>{paint.company}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.empty}>You haven't liked any paints yet.</div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default LikedPaints;
