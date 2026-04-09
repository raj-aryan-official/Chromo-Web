import React, { useState } from 'react';
import Navbar from '../../components/common/Navbar/Navbar';
import Footer from '../../components/common/Footer/Footer';
import { Calendar, MessageSquare, Video, Star } from 'lucide-react';
import styles from './ExpertConnect.module.css';

const ExpertConnect = () => {
  const experts = [
    { id: 1, name: "Sarah Jenkins", role: "Color Psychologist", rating: 4.9, img: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "Marcus Rossi", role: "Interior Designer", rating: 4.8, img: "https://i.pravatar.cc/150?img=11" },
    { id: 3, name: "Elena Cruz", role: "Coating Specialist", rating: 5.0, img: "https://i.pravatar.cc/150?img=5" },
  ];

  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      
      <main className={styles.mainContainer}>
        <div className={styles.heroSection}>
          <div className={styles.heroText}>
            <h1><span role="img" aria-label="expert">👨‍🔧</span> Connect to an Expert</h1>
            <p>Get professional advice for your painting projects. Chat, call, or video conference with our trusted professionals today.</p>
            <div className={styles.heroActions}>
              <button className={styles.primaryBtn}><Calendar size={18}/> Book a Consultation</button>
              <button className={styles.secondaryBtn}><MessageSquare size={18}/> Start Live Chat</button>
            </div>
          </div>
          <div className={styles.heroImages}>
            <div className={styles.glassCard}>
              <Video size={48} color="#00C9FF" />
              <h3>Virtual Consultations Available</h3>
              <p>Show us your space via video call.</p>
            </div>
          </div>
        </div>

        <div className={styles.expertsSection}>
          <h2>Meet Our Top Experts</h2>
          <div className={styles.expertGrid}>
            {experts.map(expert => (
              <div key={expert.id} className={styles.expertCard}>
                <img src={expert.img} alt={expert.name} className={styles.expertImg} />
                <h3>{expert.name}</h3>
                <p className={styles.expertRole}>{expert.role}</p>
                <div className={styles.rating}>
                  <Star size={16} color="#FFD700" fill="#FFD700" />
                  <span>{expert.rating} / 5.0</span>
                </div>
                <button className={styles.connectBtn}>Connect</button>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default ExpertConnect;
