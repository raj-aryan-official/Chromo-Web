import React from 'react';
import Navbar from '../../components/common/Navbar/Navbar';
import Footer from '../../components/common/Footer/Footer';
import { BookOpen, Brush, PaintRoller, Map } from 'lucide-react';
import styles from './PaintGuide.module.css';

const PaintGuide = () => {
  const guides = [
    {
      title: "How to prep your walls",
      desc: "The secret to a perfect finish is what happens before you open the can.",
      icon: <Brush size={24} color="#00C9FF" />
    },
    {
      title: "Choosing the right finish",
      desc: "Matte, Eggshell, Semi-Gloss? Learn which finish suits your room.",
      icon: <BookOpen size={24} color="#92FE9D" />
    },
    {
      title: "Mastering the roller",
      desc: "Techniques for smooth, streak-free walls like a pro.",
      icon: <PaintRoller size={24} color="#FF4757" />
    },
    {
      title: "Color mapping your home",
      desc: "How to transition colors seamlessly from room to room.",
      icon: <Map size={24} color="#FFD700" />
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
            <div key={idx} className={styles.card}>
              <div className={styles.iconWrapper}>{guide.icon}</div>
              <h3>{guide.title}</h3>
              <p>{guide.desc}</p>
              <button className={styles.readMore}>Read Guide &rarr;</button>
            </div>
          ))}
        </div>

        <div className={styles.videoSection}>
          <div className={styles.videoInfo}>
            <h2>Featured Video: The 1-Weekend Makeover</h2>
            <p>Watch our master painter transform a dull bedroom into a vibrant oasis in just 48 hours using Chromo Premium Enamel.</p>
            <button className={styles.playBtn}>Watch Now</button>
          </div>
          <div className={styles.videoPlaceholder}>
            <div className={styles.playCircle}>
              <div className={styles.triangle}></div>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default PaintGuide;
