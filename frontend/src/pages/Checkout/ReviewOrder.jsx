import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Header from '../../components/common/Header/Header';
import Footer from '../../components/common/Footer/Footer';
import API_URL from '../../config';
import styles from './ReviewOrder.module.css';

const ReviewOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { cart, cartCount, clearCart } = useCart();

  const selectedAddress = location.state?.selectedAddress;
  const contactInfo = location.state?.contactInfo || { phone: 'Not Provided', altPhone: '' };
  const paymentMethod = location.state?.paymentMethod;

  const [isPlacing, setIsPlacing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Prevent direct URL access without proper cascaded state
  if (!selectedAddress || !paymentMethod) {
    navigate('/cart');
    return null;
  }

  const subtotal = cart?.items?.reduce((acc, item) => acc + ((item?.variant?.price || 0) * (item?.quantity || 1)), 0) || 0;

  const handlePlaceOrder = async () => {
    if (!currentUser || !cart?.items?.length) return;
    setIsPlacing(true);

    try {
      // Flatten and strictly map the nested Cart object to match MongoDB Order constraints perfectly
      const correctlyMappedItems = cart.items.map(item => ({
        productId: item.productId._id || item.productId,
        name: item.productId.name || 'Premium Paint',
        image: item.productId.image || '',
        company: item.productId.company || 'Chromo',
        variant: item.variant,
        quantity: item.quantity
      }));

      const orderPayload = {
        firebaseUid: currentUser.uid,
        items: correctlyMappedItems,
        shippingAddress: selectedAddress,
        contactInfo: contactInfo,
        paymentMethod: paymentMethod,
        totalAmount: subtotal
      };

      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (response.ok) {
        setShowSuccess(true);
        // Amazon-style: Clear local cart context instantly
        await clearCart(true); // Assuming clearCart logic wipes remote seamlessly

        // Redirect after animation
        setTimeout(() => {
          navigate('/orders');
        }, 2500);
      }
    } catch (error) {
      console.error("Order placement failed", error);
      setIsPlacing(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />
      
      {showSuccess && (
        <div className={styles.successOverlay}>
           <div className={styles.successModal}>
             <div className={styles.checkIcon}>✓</div>
             <h2>Order placed successfully!</h2>
             <p>Thank you for shopping with Chromo.</p>
             <p className={styles.redirectText}>Redirecting to your orders...</p>
           </div>
        </div>
      )}

      <main className={styles.container}>
        <h1 className={styles.pageTitle}>Review your order</h1>
        
        <div className={styles.layoutGrid}>
          
          {/* Left Column: Details & Items */}
          <div className={styles.leftColumn}>
            <div className={styles.infoGroupRow}>
              <div className={styles.infoBlock}>
                <h3>Shipping address</h3>
                <p><strong>{selectedAddress.tag}</strong></p>
                <p>{selectedAddress.text}</p>
                <div style={{marginTop: '0.5rem', color: '#ccc', fontSize: '0.85rem'}}>
                  <p style={{margin: '0.2rem 0'}}>Phone: {contactInfo.phone}</p>
                  {contactInfo.altPhone && <p style={{margin: '0.2rem 0'}}>Alt: {contactInfo.altPhone}</p>}
                </div>
              </div>
              <div className={styles.infoBlock}>
                <h3>Payment method</h3>
                <p><strong>{paymentMethod}</strong></p>
                <p>Pay on Delivery</p>
              </div>
            </div>

            <div className={styles.itemsReviewBox}>
              <h3 className={styles.deliveryDateText}>Guaranteed Delivery: Next Week</h3>
              <p className={styles.disclaimerText}>Items shipped from Chromo Depot</p>
              
              <div className={styles.itemsList}>
                {cart?.items?.map((item, idx) => (
                  <div key={idx} className={styles.itemRow}>
                    <div className={styles.itemThumbnail} style={{backgroundColor: item?.productId?.colorHex || '#444'}}></div>
                    <div className={styles.itemDetails}>
                      <h4 className={styles.itemName}>{item?.productId?.name}</h4>
                      <p className={styles.itemBrand}>{item?.productId?.company}</p>
                      <p className={styles.itemPrice}>₹{item?.variant?.price.toLocaleString('en-IN')}</p>
                      <p className={styles.itemQty}>Quantity: {item?.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Floating Box */}
          <div className={styles.rightColumn}>
             <div className={styles.summaryBox}>
                <button 
                  className={styles.placeOrderBtn} 
                  onClick={handlePlaceOrder}
                  disabled={isPlacing || !cart?.items?.length}
                >
                  {isPlacing ? 'Processing...' : 'Place your order'}
                </button>
                <p className={styles.termsText}>
                  By placing your order, you agree to Chromo's privacy notice and conditions of use.
                </p>
                
                <h3 className={styles.summaryTitle}>Order Summary</h3>
                <div className={styles.summaryRow}>
                  <span>Items:</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Delivery:</span>
                  <span>₹0.00</span>
                </div>
                
                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>Order Total:</span>
                  <span className={styles.totalPrice}>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
             </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReviewOrder;
