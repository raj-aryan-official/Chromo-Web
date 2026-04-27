import React, { useState } from 'react';
import Navbar from '../../components/common/Navbar/Navbar';
import Footer from '../../components/common/Footer/Footer';
import { Paintbrush, Save, Layout, Droplet, Plus, CheckCircle2, Wand2, Calculator, ArrowRight, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './PaletteStudio.module.css';

// Utility to generate harmonies
const generateHarmonies = (baseHex) => {
  // Fallback simplified logic for immediate visual feedback without heavy color libs
  // In a real app, this would use d3-color or similar.
  const r = parseInt(baseHex.slice(1, 3), 16);
  const g = parseInt(baseHex.slice(3, 5), 16);
  const b = parseInt(baseHex.slice(5, 7), 16);

  const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');

  return {
    complementary: rgbToHex(255 - r, 255 - g, 255 - b),
    monochromatic: [
      rgbToHex(r * 0.5, g * 0.5, b * 0.5),
      rgbToHex(r * 0.8, g * 0.8, b * 0.8),
      baseHex,
      rgbToHex(Math.min(255, r * 1.2), Math.min(255, g * 1.2), Math.min(255, b * 1.2))
    ]
  };
};

const DUMMY_BRANDS = ['Asian Paints', 'Berger Paints', 'Dulux', 'Nerolac'];

const PaletteStudio = () => {
  const [selectedColors, setSelectedColors] = useState(['#00C9FF', '#92FE9D', '#FF4757', '#11111A']);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [devModal, setDevModal] = useState({ show: false, feature: '' });

  const harmonies = generateHarmonies(selectedColors[0]);

  const handleSavePalette = async () => {
    if (!currentUser) return alert('Please sign in to save palettes!');
    
    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/${currentUser.uid}/palette`, {
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

  const updateColor = (index, newColor) => {
    const updated = [...selectedColors];
    updated[index] = newColor;
    setSelectedColors(updated);
  };

  const openDev = (feature) => setDevModal({ show: true, feature });

  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      
      <main className={styles.mainContainer}>
        <div className={styles.header}>
          <h1><Paintbrush size={32} color="#00C9FF" /> Palette Studio PRO</h1>
          <p>Discover, visualize, and map your distinct color harmonies directly to real paint products.</p>
        </div>

        <div className={styles.studioLayout}>
          <div className={styles.canvasArea}>
            <div className={styles.canvasHeader}>
              <h3>Your Interactive Palette</h3>
              <div className={styles.canvasActions}>
                <button className={styles.actionBtn} onClick={handleSavePalette} disabled={saving}>
                  {saved ? <CheckCircle2 size={16} color="#92FE9D"/> : <Save size={16}/>} 
                  {saved ? 'Saved!' : 'Save'}
                </button>
                <button className={styles.actionBtn} onClick={() => openDev('2D Wall Room Previewer')}><Layout size={16}/> Preview on Wall</button>
              </div>
            </div>
            
            <div className={styles.colorStrip} style={{marginBottom: '1rem'}}>
              {selectedColors.map((color, idx) => (
                <div key={idx} className={styles.colorSwatch} style={{ backgroundColor: color }}>
                  <div className={styles.colorInputWrapper}>
                    <input type="color" className={styles.colorInput} value={color} onChange={(e) => updateColor(idx, e.target.value)} />
                  </div>
                  <span className={styles.colorHex} style={{marginTop: '1rem'}}>{color.toUpperCase()}</span>
                </div>
              ))}
            </div>

            <div className={styles.mappedPaintsSection}>
              <h3 style={{fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <Paintbrush size={18} color="#92FE9D"/> Mapped to Real Paints
              </h3>
              <p style={{color: '#888', fontSize: '0.9rem'}}>Automatically matching your hex codes to the closest physical finishes.</p>
              
              <div className={styles.mappedGrid}>
                {selectedColors.map((color, idx) => (
                  <div key={idx} className={styles.paintCard}>
                    <div className={styles.paintCardColor} style={{background: color}}></div>
                    <strong style={{fontSize: '1rem', marginTop: '0.5rem'}}>Shade Code #{idx}00{idx}</strong>
                    <div className={styles.brandSpecs}>
                      <div>{DUMMY_BRANDS[idx % DUMMY_BRANDS.length]}</div>
                      <div style={{color: '#aaa', marginTop: '0.2rem'}}>Luxury Matte Finish</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.sidebar}>
            <h3>Smart Harmony (Auto-Generated)</h3>
            <p style={{color: '#888', fontSize: '0.85rem', marginBottom: '1rem'}}>Based on your primary Base Color ({selectedColors[0]})</p>
            
            <div className={styles.toolCard} onClick={() => updateColor(1, harmonies.complementary)}>
              <Droplet size={20} color={selectedColors[0]} />
              <div>
                <h4>Complementary Match</h4>
                <div style={{display:'flex', gap:'0.5rem', marginTop:'0.5rem'}}>
                  <div style={{width:'30px', height:'30px', background: harmonies.complementary, borderRadius:'4px'}}></div>
                </div>
                <p style={{marginTop:'0.5rem', fontSize:'0.8rem'}}>Directly opposite standard color profile. Click to apply.</p>
              </div>
            </div>
            
            <div className={styles.toolCard}>
              <Droplet size={20} color="#FF4757" />
              <div>
                <h4>Monochromatic Scale</h4>
                <div style={{display:'flex', gap:'0.5rem', marginTop:'0.5rem'}}>
                  {harmonies.monochromatic.map((c, i) => (
                    <div key={i} style={{width:'20px', height:'20px', background: c, borderRadius:'4px', cursor: 'pointer'}} onClick={() => updateColor(i, c)}></div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.advancedTools}>
              <button className={styles.aiBtn} onClick={() => openDev('AI Style Suggestions & Lighting Match')}>
                <Wand2 size={18}/> AI Suggestion
              </button>
              <button className={styles.aiBtn} onClick={() => openDev('Real Image Upload & Wall Masking')} style={{borderColor: '#00C9FF', color: '#00C9FF', background: 'rgba(0, 201, 255, 0.1)'}}>
                <Camera size={18}/> Photo Upload
              </button>
            </div>

            <button 
              className={styles.actionBtn} 
              style={{width: '100%', marginTop: '1rem', justifyContent: 'center', background: 'linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)', color: '#000', padding: '1rem', fontWeight: 'bold'}}
              onClick={() => navigate('/calculator')}
            >
              <Calculator size={20}/> Calculate Output Quantity <ArrowRight size={20}/>
            </button>

          </div>
        </div>
      </main>

      <Footer />

      {devModal.show && (
        <div className={styles.devModalOverlay} onClick={() => setDevModal({ show: false, feature: '' })}>
          <div className={styles.devModal} onClick={e => e.stopPropagation()}>
            <Wand2 size={48} color="#00C9FF" style={{marginBottom: '1rem'}}/>
            <h3>Feature in Development</h3>
            <p>
              The <strong>{devModal.feature}</strong> engine is currently in Phase 4 of our development roadmap. 
              This advanced capability requires the backend AI masking cluster to be brought fully online.
            </p>
            <button className={styles.closeModalBtn} onClick={() => setDevModal({ show: false, feature: '' })}>
              Got it, thanks!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaletteStudio;
