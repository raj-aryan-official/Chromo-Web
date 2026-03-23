import React from 'react';
import { Link } from 'react-router-dom';
import { Paintbrush, MessageCircle, Camera, Code, Mail } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.glowEffect}></div>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand Column */}
          <div className={styles.brandCol}>
            <Link to="/" className={styles.logoContainer}>
              <div className={styles.logoIcon}>
                <Paintbrush size={20} color="#fff" />
              </div>
              <span className={styles.logoText}>Chromo</span>
            </Link>
            <p className={styles.description}>
              Transform your living space with our premium selection of dynamic and vibrant paint colors. Experience quality in every drop.
            </p>
            <div className={styles.socials}>
              <a href="#" className={styles.socialIcon}><MessageCircle size={20} /></a>
              <a href="#" className={styles.socialIcon}><Camera size={20} /></a>
              <a href="#" className={styles.socialIcon}><Code size={20} /></a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className={styles.linksCol}>
            <h3 className={styles.colTitle}>Shop</h3>
            <ul className={styles.linkList}>
              <li><Link to="/products/interior">Interior Paints</Link></li>
              <li><Link to="/products/exterior">Exterior Paints</Link></li>
              <li><Link to="/products/primers">Primers</Link></li>
              <li><Link to="/products/accessories">Accessories</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className={styles.linksCol}>
            <h3 className={styles.colTitle}>Support</h3>
            <ul className={styles.linkList}>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/faq">FAQs</Link></li>
              <li><Link to="/shipping">Shipping Info</Link></li>
              <li><Link to="/returns">Returns</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className={styles.newsletterCol}>
            <h3 className={styles.colTitle}>Stay Updated</h3>
            <p className={styles.newsletterDesc}>Subscribe to our newsletter for the latest colors and offers.</p>
            <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
              <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} size={18} />
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className={styles.input}
                  required
                />
              </div>
              <button type="submit" className={styles.submitBtn}>Subscribe</button>
            </form>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p>&copy; {new Date().getFullYear()} Chromo Paints. All rights reserved.</p>
          <div className={styles.legalLinks}>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
