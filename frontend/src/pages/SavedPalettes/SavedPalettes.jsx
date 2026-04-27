import React, { useEffect, useState } from 'react';
import Navbar from '../../components/common/Navbar/Navbar';
import Footer from '../../components/common/Footer/Footer';
import { Palette, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './SavedPalettes.module.css';

const SavedPalettes = () => {
  const { currentUser } = useAuth();
  const [palettes, setPalettes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/${currentUser.uid}`)
      .then(res => res.json())
      .then(data => {
        setPalettes(data.savedPalettes || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentUser]);

  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <main className={styles.mainContainer}>
        <div className={styles.header}>
          <h1><Palette size={32} color="#92FE9D" /> Saved Palettes</h1>
          <p>Access your previously saved color harmonies and palettes.</p>
        </div>
        
        {loading ? (
          <div style={{textAlign:'center', marginTop:'4rem'}}><Loader2 className={styles.spinner} size={40}/></div>
        ) : (
          <div className={styles.grid}>
            {palettes.length > 0 ? (
              palettes.map((palette, idx) => (
                <div key={idx} className={styles.card}>
                  <div className={styles.name}>{palette.name}</div>
                  <div className={styles.strip}>
                    {palette.colors.map((c, i) => (
                       <div key={i} className={styles.swatch} style={{background: c}} title={c}></div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.empty}>No saved palettes yet. Use the Palette Studio to create some!</div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SavedPalettes;
