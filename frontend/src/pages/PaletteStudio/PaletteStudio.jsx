import React, { useState } from 'react';
import Navbar from '../../components/common/Navbar/Navbar';
import Footer from '../../components/common/Footer/Footer';
import { Paintbrush, Save, Layout, Droplet, Plus, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './PaletteStudio.module.css';

const PaletteStudio = () => {
  const [selectedColors, setSelectedColors] = useState(['#00C9FF', '#92FE9D', '#FF4757', '#11111A']);
  const { currentUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSavePalette = async () => {
    if (!currentUser) return alert('Please sign in to save palettes!');
    
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/users/${currentUser.uid}/palette`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'My Custom Palette', colors: selectedColors })
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch(err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      
      <main className={styles.mainContainer}>
        <div className={styles.header}>
          <h1><Paintbrush size={32} color="#00C9FF" /> Palette Studio</h1>
          <p>Create, visualize, and save beautiful color harmonies for your space.</p>
        </div>

        <div className={styles.studioLayout}>
          <div className={styles.canvasArea}>
            <div className={styles.canvasHeader}>
              <h3>Current Palette</h3>
              <div className={styles.canvasActions}>
                <button className={styles.actionBtn} onClick={handleSavePalette} disabled={saving}>
                  {saved ? <CheckCircle2 size={16} color="#92FE9D"/> : <Save size={16}/>} 
                  {saved ? 'Saved!' : 'Save'}
                </button>
                <button className={styles.actionBtn}><Layout size={16}/> Preview on Wall</button>
              </div>
            </div>
            
            <div className={styles.colorStrip}>
              {selectedColors.map((color, idx) => (
                <div key={idx} className={styles.colorSwatch} style={{ backgroundColor: color }}>
                  <span className={styles.colorHex}>{color}</span>
                </div>
              ))}
              <div className={styles.addColorSwatch}>
                <Plus size={24} />
                <span>Add Color</span>
              </div>
            </div>
          </div>

          <div className={styles.sidebar}>
            <h3>Color Harmonies</h3>
            <div className={styles.toolCard}>
              <Droplet size={20} color="#00C9FF" />
              <div>
                <h4>Analogous</h4>
                <p>Colors that are next to each other on the color wheel.</p>
              </div>
            </div>
            <div className={styles.toolCard}>
              <Droplet size={20} color="#92FE9D" />
              <div>
                <h4>Complementary</h4>
                <p>Colors that are directly opposite on the color wheel.</p>
              </div>
            </div>
            <div className={styles.toolCard}>
              <Droplet size={20} color="#FF4757" />
              <div>
                <h4>Monochromatic</h4>
                <p>Variations in lightness and saturation of a single color.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaletteStudio;
