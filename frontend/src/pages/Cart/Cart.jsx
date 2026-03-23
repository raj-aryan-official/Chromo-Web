import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, MapPin, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import styles from './Cart.module.css';
import Header from '../../components/common/Header/Header';
import Footer from '../../components/common/Footer/Footer';

const Cart = () => {
  const { cart, cartCount, removeFromCart, clearCart, updateQuantity } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // User Address State
  const [userProfile, setUserProfile] = useState(null);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  
  // Inline Add Address State
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddressTag, setNewAddressTag] = useState('Home');
  const [newAddressText, setNewAddressText] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      if (!currentUser) return;
      try {
        const response = await fetch(`http://localhost:5000/api/users/${currentUser.uid}`);
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
          if (data.addresses?.length > 0) {
            const defaultIdx = data.addresses.findIndex(a => a.isDefault);
            setSelectedAddressIndex(defaultIdx > -1 ? defaultIdx : 0);
          }
        } else if (response.status === 404) {
          // Native fallback sync if User was on Firebase but not in MongoDB
          const syncRes = await fetch(`http://localhost:5000/api/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              firebaseUid: currentUser.uid, 
              name: currentUser.displayName || 'Chromo User', 
              email: currentUser.email,
              address: '' 
            })
          });
          if (syncRes.ok) setUserProfile(await syncRes.json());
        }
      } catch (err) {
        console.error("Error fetching user profile for cart:", err);
      }
    };
    loadProfile();
  }, [currentUser]);

  const handleAddInlineAddress = async () => {
    if (!newAddressText.trim()) return;
    try {
      const updatedAddresses = [...(userProfile.addresses || []), { tag: newAddressTag, text: newAddressText, isDefault: userProfile.addresses?.length === 0 }];
      const res = await fetch(`http://localhost:5000/api/users/${currentUser.uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses: updatedAddresses })
      });
      if (res.ok) {
        const updated = await res.json();
        setUserProfile(updated);
        setIsAddingAddress(false);
        setNewAddressText('');
        // Auto-select the newly added address
        setSelectedAddressIndex(updated.addresses.length - 1);
      }
    } catch (err) {
      console.error("Failed to append address inline", err);
    }
  };

  const subtotal = cart?.items?.reduce((acc, item) => acc + ((item?.variant?.price || 0) * (item?.quantity || 1)), 0) || 0;

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <main className={styles.container}>
        <div className={styles.cartHeaderWrapper}>
          <div className={styles.cartHeader}>
            <h1>Shopping Cart</h1>
            <p>{cartCount} {cartCount === 1 ? 'Item' : 'Items'}</p>
          </div>
          
          {cart?.items && cart.items.length > 0 && (
            <button className={styles.clearCartTopBtn} onClick={clearCart}>
              Empty Cart
            </button>
          )}
        </div>

        {(!cart || !cart.items || cart.items.length === 0) ? (
          <div className={styles.emptyCart}>
            <ShoppingBag size={80} color="#374151" />
            <h2>Your Chromo Cart is empty</h2>
            <p>Looks like you haven't added any premium paints to your bucket yet.</p>
            <button onClick={() => navigate('/')} className={styles.continueBtn}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div className={styles.cartLayout}>
            {/* Left: Cart Items (Scrollable) */}
            <div className={styles.leftColumn}>
              <div className={styles.itemsList}>
                <h2>Review Final Items</h2>
                {cart.items.map((item, index) => (
                  <div key={index} className={styles.cartItemCard}>
                    <div 
                      className={styles.colorThumbnail} 
                      style={{ backgroundColor: item?.productId?.colorHex || '#333', cursor: 'pointer' }}
                      onClick={() => navigate(`/product/${item.productId._id}`)}
                    ></div>
                    
                    <div className={styles.itemDetails}>
                      <h3 
                        className={styles.itemName}
                        style={{ cursor: 'pointer', transition: 'color 0.2s' }}
                        onClick={() => navigate(`/product/${item.productId._id}`)}
                        onMouseOver={(e) => e.target.style.color = '#00C9FF'}
                        onMouseOut={(e) => e.target.style.color = 'inherit'}
                      >
                        {item?.productId?.name || 'Paint Product'}
                      </h3>
                      <p className={styles.itemBrand}>By {item?.productId?.company || 'Chromo'}</p>
                      
                      <div className={styles.itemSpecs}>
                         <span className={styles.specBadge}>{item?.variant?.weight || 'Standard'} variant</span>
                         <span className={styles.stockText}>In Stock</span>
                      </div>

                      <div className={styles.actionsRow}>
                         <div className={styles.qtyControl}>
                           <button 
                             className={styles.qtyBtn} 
                             onClick={() => updateQuantity(item._id, 'decrement')}
                             disabled={item.quantity <= 1}
                           >
                             <Minus size={14} />
                           </button>
                           <span className={styles.qtyTextValue}>{item?.quantity || 1}</span>
                           <button 
                             className={styles.qtyBtn} 
                             onClick={() => updateQuantity(item._id, 'increment')}
                           >
                             <Plus size={14} />
                           </button>
                         </div>
                         <button 
                           className={styles.removeBtn}
                           onClick={() => removeFromCart(item._id)}
                         >
                            <Trash2 size={16} /> Delete
                         </button>
                      </div>
                    </div>

                    <div className={styles.priceBlock}>
                      <p className={styles.itemPrice}>₹{((item?.variant?.price || 0) * (item?.quantity || 1)).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Address & Order Summary (Sticky) */}
            <div className={styles.rightColumnSticky}>
              {/* Shipping Address Manager */}
              <div className={styles.addressManagerSection}>
                
                {/* Contact Information Block exactly above addresses as requested */}
                <div style={{ marginBottom: '1.5rem', padding: '1.2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#fff' }}>Contact Information</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Primary Mobile:</span>
                      <strong style={{ color: '#fff' }}>{userProfile?.phone || 'Not setup'}</strong>
                    </div>
                    {userProfile?.altPhone && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Alternative Mobile:</span>
                        <strong style={{ color: '#fff' }}>{userProfile.altPhone}</strong>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.addressHeaderRow}>
                  <h2><MapPin size={20}/> Shipping Address</h2>
                  {!isAddingAddress && (
                     <button className={styles.addInlineBtn} onClick={() => setIsAddingAddress(true)}>
                       <Plus size={16}/> Add New
                     </button>
                  )}
                </div>

                {isAddingAddress ? (
                  <div className={styles.inlineAddForm}>
                    <div className={styles.tagSelector}>
                      {['Home', 'Office', 'Other'].map(tag => (
                        <button 
                          key={tag}
                          className={`${styles.tagBtn} ${newAddressTag === tag ? styles.activeTag : ''}`}
                          onClick={() => setNewAddressTag(tag)}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    <textarea 
                      className={styles.inlineAddressInput}
                      placeholder="Enter new delivery address..."
                      value={newAddressText}
                      onChange={(e) => setNewAddressText(e.target.value)}
                    />
                    <div className={styles.inlineActions}>
                      <button className={styles.cancelInlineBtn} onClick={() => setIsAddingAddress(false)}>Cancel</button>
                      <button className={styles.saveInlineBtn} onClick={handleAddInlineAddress}>Save & Select</button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.savedAddressesGrid}>
                    {userProfile?.addresses && userProfile.addresses.length > 0 ? (
                      userProfile.addresses.map((addr, idx) => (
                         <div 
                           key={idx} 
                           className={`${styles.selectableAddressCard} ${selectedAddressIndex === idx ? styles.selectedCard : ''}`}
                           onClick={() => setSelectedAddressIndex(idx)}
                         >
                           <div className={styles.radioTop}>
                             <div className={styles.radioControl}>
                               <div className={`${styles.radioDot} ${selectedAddressIndex === idx ? styles.activeDot : ''}`}></div>
                             </div>
                             <span className={styles.addressTag}>{addr.tag}</span>
                           </div>
                           <p className={styles.addressTextPreview}>{addr.text}</p>
                         </div>
                      ))
                    ) : (
                      <div className={styles.noAddressWarn}>
                        <p>No delivery address found. Please add one to checkout.</p>
                        <button className={styles.saveInlineBtn} onClick={() => setIsAddingAddress(true)}>Add Address</button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className={styles.summaryCard}>
                <h2>Order Summary</h2>
                
                <div className={styles.summaryRow}>
                  <span>Items ({cartCount}):</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Delivery:</span>
                  <span className={styles.freeText}>FREE</span>
                </div>

                {userProfile?.addresses && userProfile.addresses.length > 0 && selectedAddressIndex !== null && (
                   <div className={styles.deliveryDestination}>
                     <p className={styles.destSub}>Delivering to:</p>
                     <p className={styles.destTag}><strong>{userProfile.addresses[selectedAddressIndex].tag}</strong> - {userProfile.addresses[selectedAddressIndex].text.substring(0, 30)}...</p>
                   </div>
                )}
                
                <div className={styles.divider}></div>
                
                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                  <span>Order Total:</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                
                <button 
                  className={styles.checkoutBtn}
                  disabled={!userProfile?.addresses || userProfile.addresses.length === 0}
                  onClick={() => navigate('/checkout/payment', { 
                    state: { 
                      selectedAddress: userProfile.addresses[selectedAddressIndex],
                      contactInfo: { phone: userProfile.phone || '', altPhone: userProfile.altPhone || '' }
                    } 
                  })}
                >
                  Proceed to Checkout
                </button>
                
                <div className={styles.guaranteeText}>
                  Safe and secure payments. 100% Authentic products.
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
