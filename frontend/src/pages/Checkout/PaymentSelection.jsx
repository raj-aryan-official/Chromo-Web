import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/common/Header/Header';
import Footer from '../../components/common/Footer/Footer';
import styles from './PaymentSelection.module.css';

const PaymentSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedAddress = location.state?.selectedAddress;

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  // Prevent direct URL access without an address
  if (!selectedAddress) {
    navigate('/cart');
    return null;
  }

  const handleUsePayment = () => {
    navigate('/checkout/review', { state: { selectedAddress, paymentMethod } });
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <main className={styles.container}>
        <div className={styles.checkoutCard}>
          <h1>Select a payment method</h1>
          
          <div className={styles.accordionGroup}>
            {/* Credit & Debit Cards (Disabled) */}
            <div className={`${styles.paymentRow} ${styles.disabledRow}`}>
              <div className={styles.radioControl}>
                <input type="radio" disabled name="payment" />
              </div>
              <div className={styles.paymentInfo}>
                <span className={styles.paymentTitle}>CREDIT & DEBIT CARDS</span>
                <span className={styles.paymentSub}>Credit or debit card (Unavailable)</span>
              </div>
            </div>

            {/* Net Banking (Disabled) */}
            <div className={`${styles.paymentRow} ${styles.disabledRow}`}>
              <div className={styles.radioControl}>
                <input type="radio" disabled name="payment" />
              </div>
              <div className={styles.paymentInfo}>
                <span className={styles.paymentTitle}>Net Banking</span>
                <select disabled className={styles.fakeSelect}>
                   <option>Choose an Option</option>
                </select>
              </div>
            </div>

            {/* Other UPI Apps (Disabled) */}
            <div className={`${styles.paymentRow} ${styles.disabledRow}`}>
              <div className={styles.radioControl}>
                <input type="radio" disabled name="payment" />
              </div>
              <div className={styles.paymentInfo}>
                <span className={styles.paymentTitle}>Other UPI Apps</span>
                <span className={styles.paymentSub}>Scan and Pay with any UPI app. You will need to Scan the QR code on the payment page.</span>
              </div>
            </div>

            {/* EMI (Disabled) */}
            <div className={`${styles.paymentRow} ${styles.disabledRow}`}>
              <div className={styles.radioControl}>
                <input type="radio" disabled name="payment" />
              </div>
              <div className={styles.paymentInfo}>
                <span className={styles.paymentTitle}>EMI</span>
              </div>
            </div>

            {/* Cash on Delivery (Active) */}
            <div className={`${styles.paymentRow} ${styles.activeRow}`}>
              <div className={styles.radioControl}>
                <input 
                  type="radio" 
                  name="payment" 
                  checked={paymentMethod === 'Cash on Delivery'} 
                  onChange={() => setPaymentMethod('Cash on Delivery')}
                />
              </div>
              <div className={styles.paymentInfo}>
                <span className={styles.paymentTitle}>Cash on Delivery/Pay on Delivery</span>
                <span className={styles.paymentSub}>Scan & Pay using Amazon Pay UPI, Amazon Pay balance Checkout or cash.</span>
              </div>
            </div>

          </div>

          <div className={styles.actionFooter}>
            <button className={styles.usePaymentBtn} onClick={handleUsePayment}>
               Use this payment method
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSelection;
