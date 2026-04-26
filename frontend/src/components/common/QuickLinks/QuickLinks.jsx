import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, Paintbrush, Package, Droplet } from 'lucide-react';
import styles from './QuickLinks.module.css';

const QuickLinks = () => {
  return (
    <div className={styles.bottomSection}>
      <div className={styles.quickLinks}>
        <Link to="/shop" className={styles.quickLink}>
          <Package size={16} /> All Products
        </Link>
        <Link to="/paints?category=new" className={styles.quickLink}>
          <Tag size={16} /> New Colors
        </Link>
        <Link to="/paints" className={styles.quickLink}>
          <Droplet size={16} color="#00C9FF" /> All Paints
        </Link>
        <Link to="/palette-studio" className={styles.quickLink}>
          <Paintbrush size={16} /> Palette Studio
        </Link>
        <Link to="/calculator" className={styles.quickLink}>
          <span style={{ fontSize: '1.1rem', marginRight: '4px' }}>🧮</span> Paint Calculator
        </Link>
        <Link to="/expert" className={styles.quickLink}>
          <span style={{ fontSize: '1.1rem', marginRight: '4px' }}>👨‍🔧</span> Connect to Expert
        </Link>
        <Link to="/guide" className={styles.quickLink}>
          <span style={{ fontSize: '1.1rem', marginRight: '4px' }}>📚</span> Paint Guide
        </Link>
      </div>
    </div>
  );
};

export default QuickLinks;
