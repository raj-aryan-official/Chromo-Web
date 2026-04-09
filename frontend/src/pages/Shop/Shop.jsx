import React from 'react';
import Navbar from '../../components/common/Navbar/Navbar';
import Footer from '../../components/common/Footer/Footer';
import { ChevronRight } from 'lucide-react';
import styles from './Shop.module.css';

const Shop = () => {
  const categories = [
    {
      id: 1,
      name: "Painting Tools & Accessories",
      desc: "Brushes, rollers, sprayers, tapes, trays, drop cloths",
      icon: "🖌️"
    },
    {
      id: 2,
      name: "Primers & Wall Putty",
      desc: "Essential surface prep for a professional finish",
      icon: "🪣"
    },
    {
      id: 3,
      name: "Wall Coverings",
      desc: "Wallpapers, textures, murals and decals",
      icon: "🖼️"
    },
    {
      id: 4,
      name: "Décor & Lighting",
      desc: "Wall art, mirrors, shelves, lamps, fixtures",
      icon: "💡"
    },
    {
      id: 5,
      name: "DIY Kits & Bundles",
      desc: "All-in-one starter kits for your room makeover",
      icon: "🛠️"
    },
    {
      id: 6,
      name: "Specialty Paints",
      desc: "Chalkboard, heat-resistant, textured, and effect finishes",
      icon: "✨"
    },
    {
      id: 7,
      name: "Adhesives & Sealants",
      desc: "Wallpaper glue, silicone sealants, joint compounds",
      icon: "🧲"
    },
    {
      id: 8,
      name: "Storage & Organization",
      desc: "Toolboxes, canisters, and practical storage",
      icon: "📦"
    }
  ];

  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1>Shop Chromo Products</h1>
          <p>Explore our premium expanded catalog. From expert wall paints to high-end decor and painting tools.</p>
        </div>

        <section className={styles.categorySection}>
          <div className={styles.grid}>
            {categories.map((cat) => (
              <div key={cat.id} className={styles.categoryCard}>
                <div className={styles.iconWrapper}>{cat.icon}</div>
                <h2>{cat.name}</h2>
                <p>{cat.desc}</p>
                <button className={styles.exploreBtn}>Explore <ChevronRight size={16} /></button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
