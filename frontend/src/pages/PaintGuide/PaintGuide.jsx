import React, { useState } from 'react';
import Navbar from '../../components/common/Navbar/Navbar';
import Footer from '../../components/common/Footer/Footer';
import { BookOpen, Brush, PaintRoller, Map } from 'lucide-react';
import styles from './PaintGuide.module.css';

const PaintGuide = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleGuide = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const guides = [
    {
      title: "How to prep your walls",
      desc: "The secret to a perfect finish is what happens before you open the can.",
      icon: <Brush size={24} color="#00C9FF" />,
      content: (
        <div style={{marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)'}}>
          <h4 style={{color: '#00C9FF', marginBottom: '1rem'}}>Phase 1: Clean & Clear</h4>
          <p style={{fontSize: '0.9rem', color: '#ccc', marginBottom: '1rem'}}>
            Remove all hardware like switch plates and outlet covers. Dust the walls thoroughly using a microfiber cloth or a damp sponge with warm water and mild soap. This ensures the paint binds directly to the wall, not the dust layers!
          </p>
          <h4 style={{color: '#00C9FF', marginBottom: '1rem'}}>Phase 2: Repair & Sand</h4>
          <p style={{fontSize: '0.9rem', color: '#ccc', marginBottom: '1.5rem'}}>
            Fill in any nail holes or cracks with spackling compound. Once dry, use a fine-grit sandpaper (120-150 grit) to smooth it flush with the wall. Wipe down the sanding dust before you apply your primer layer.
          </p>
          <div style={{width: '100%', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)'}}>
            <iframe width="100%" height="100%" src="https://www.youtube.com/embed/hysD3gPYWn8" title="Prep Wall Guide" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
        </div>
      )
    },
    {
      title: "Choosing the right finish",
      desc: "Matte, Eggshell, Semi-Gloss? Learn which finish suits your room.",
      icon: <BookOpen size={24} color="#92FE9D" />,
      content: (
        <div style={{marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)'}}>
          <ul style={{fontSize: '0.9rem', color: '#ccc', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem'}}>
            <li><strong style={{color: '#92FE9D'}}>Matte / Flat:</strong> Perfect for ceilings and low-traffic areas like formal dining rooms. Hides imperfections beautifully but is hard to clean.</li>
            <li><strong style={{color: '#92FE9D'}}>Eggshell:</strong> Has a subtle, soft sheen. Highly durable and easier to wipe down. Ideal for living rooms and bedrooms.</li>
            <li><strong style={{color: '#92FE9D'}}>Satin:</strong> A velvety finish. This is the top choice for high-traffic zones like hallways and kids' rooms because it resists mildew and is highly washable.</li>
            <li><strong style={{color: '#92FE9D'}}>Semi-Gloss / Gloss:</strong> Highly reflective. Reserved primarily for doors, trim, baseboards, and heavily moist environments like bathrooms.</li>
          </ul>
          <div style={{width: '100%', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)'}}>
            <iframe width="100%" height="100%" src="https://www.youtube.com/embed/DyKh80Yt9k0" title="Choosing Finish Guide" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
        </div>
      )
    },
    {
      title: "Mastering the roller",
      desc: "Techniques for smooth, streak-free walls like a pro.",
      icon: <PaintRoller size={24} color="#FF4757" />,
      content: (
        <div style={{marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)'}}>
          <h4 style={{color: '#FF4757', marginBottom: '1rem'}}>The "W" Technique</h4>
          <p style={{fontSize: '0.9rem', color: '#ccc', marginBottom: '1rem'}}>
            Load your roller fully but without dripping. Start applying paint to the wall in a large "W" or "V" shape spanning about a 3x3 foot section. Without lifting the roller, immediately fill in the empty spaces.
          </p>
          <h4 style={{color: '#FF4757', marginBottom: '1rem'}}>Keep a Wet Edge</h4>
          <p style={{fontSize: '0.9rem', color: '#ccc', marginBottom: '1.5rem'}}>
            Always overlap your newly painted, wet areas onto the previously painted strokes before they dry. This eliminates track marks and "lap marks". Roll vertically from baseboard to ceiling for the final smoothing stroke!
          </p>
          <div style={{width: '100%', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)'}}>
            <iframe width="100%" height="100%" src="https://www.youtube.com/embed/c_Ne9khYeRo" title="Roller Master Guide" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
        </div>
      )
    },
    {
      title: "Color mapping your home",
      desc: "How to transition colors seamlessly from room to room.",
      icon: <Map size={24} color="#FFD700" />,
      content: (
        <div style={{marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)'}}>
          <p style={{fontSize: '0.9rem', color: '#ccc', marginBottom: '1rem'}}>
            <strong style={{color: '#FFD700'}}>The 60-30-10 Rule:</strong> Limit your home's palette to a dominant color (60%), a secondary tone (30%), and a bold accent (10%). Keep the dominant color consistent in open hallways.
          </p>
          <p style={{fontSize: '0.9rem', color: '#ccc', marginBottom: '1.5rem'}}>
            <strong style={{color: '#FFD700'}}>Sightlines:</strong> Stand in your living room and look around. If you can see the kitchen and the dining room, those three spaces must complement each other. Use transitional shades (like warm greys, taupes, or off-whites) to bridge strongly colored interior rooms!
          </p>
          <div style={{width: '100%', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)'}}>
            <iframe width="100%" height="100%" src="https://www.youtube.com/embed/Y45kWzybhAU" title="Color Mapping Guide" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      
      <main className={styles.mainContainer}>
        <div className={styles.header}>
          <h1><span role="img" aria-label="books">📚</span> The Paint Guide</h1>
          <p>Everything you need to know to transform your space, step by step.</p>
        </div>

        <div className={styles.grid}>
          {guides.map((guide, idx) => (
            <div key={idx} className={styles.card} style={{ height: expandedIndex === idx ? 'max-content' : 'auto' }}>
              <div className={styles.iconWrapper}>{guide.icon}</div>
              <h3>{guide.title}</h3>
              <p>{guide.desc}</p>
              <button 
                className={styles.readMore} 
                onClick={() => toggleGuide(idx)}
              >
                {expandedIndex === idx ? 'Close Guide ↑' : 'Read Guide →'}
              </button>
              
              {expandedIndex === idx && guide.content}
            </div>
          ))}
        </div>

        <div className={styles.videoSection}>
          <div className={styles.videoInfo}>
            <h2>Featured Video: The 1-Weekend Makeover</h2>
            <p>Watch our master painter transform a dull bedroom into a vibrant oasis in just 48 hours using Chromo Premium Enamel.</p>
            {!isPlaying && (
              <button className={styles.playBtn} onClick={() => setIsPlaying(true)}>Watch Now</button>
            )}
          </div>
          {isPlaying ? (
            <div className={styles.videoActiveWrapper} style={{width: '100%', aspectRatio: '16/9', borderRadius: '16px', overflow: 'hidden'}}>
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/bLbUIevOxzY?autoplay=1" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen>
              </iframe>
            </div>
          ) : (
            <div className={styles.videoPlaceholder} onClick={() => setIsPlaying(true)} style={{cursor: 'pointer'}}>
              <div className={styles.playCircle}>
                <div className={styles.triangle}></div>
              </div>
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default PaintGuide;
