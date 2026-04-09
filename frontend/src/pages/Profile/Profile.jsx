import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, MapPin, Mail, Loader2, AlertCircle, Edit2, Check, Plus, Trash2, Phone, Heart } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import styles from './Profile.module.css';
import Navbar from '../../components/common/Navbar/Navbar';
import Footer from '../../components/common/Footer/Footer';
import API_URL from '../../config';

const Profile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Editing State
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [tempPhone, setTempPhone] = useState('');
  const [isEditingAltPhone, setIsEditingAltPhone] = useState(false);
  const [tempAltPhone, setTempAltPhone] = useState('');
  
  // Address Creation State
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddressTag, setNewAddressTag] = useState('Home');
  const [newAddressText, setNewAddressText] = useState('');

  const fetchUserData = async () => {
    if (!currentUser) return;
    try {
      const response = await fetch(`${API_URL}/api/users/${currentUser.uid}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setTempName(data.name);
        setTempPhone(data.phone || '');
        setTempAltPhone(data.altPhone || '');
      } else if (response.status === 404) {
        // Fallback: If Firebase user exists but hasn't been synced to MongoDB yet, sync them now
        const syncRes = await fetch(`${API_URL}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            firebaseUid: currentUser.uid, 
            name: currentUser.displayName || 'Chromo User', 
            email: currentUser.email,
            address: '' 
          })
        });
        if (syncRes.ok) {
          const syncedData = await syncRes.json();
          setUserData(syncedData);
          setTempName(syncedData.name);
          setTempPhone(syncedData.phone || '');
          setTempAltPhone(syncedData.altPhone || '');
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser) navigate('/login');
    else fetchUserData();
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      navigate('/');
      await signOut(auth);
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const handleSaveName = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/${currentUser.uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: tempName })
      });
      if (res.ok) {
        const updated = await res.json();
        setUserData(updated);
        setIsEditingName(false);
      }
    } catch (err) {
      setError("Failed to update name");
    }
  };

  const handleSavePhone = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/${currentUser.uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: tempPhone })
      });
      if (res.ok) {
        setUserData(await res.json());
        setIsEditingPhone(false);
      }
    } catch (err) { setError("Failed to update primary phone"); }
  };

  const handleSaveAltPhone = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/${currentUser.uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ altPhone: tempAltPhone })
      });
      if (res.ok) {
        setUserData(await res.json());
        setIsEditingAltPhone(false);
      }
    } catch (err) { setError("Failed to update alternative phone"); }
  };

  const handleAddAddress = async () => {
    if (!newAddressText.trim()) return;
    try {
      const updatedAddresses = [...(userData.addresses || []), { tag: newAddressTag, text: newAddressText, isDefault: userData.addresses?.length === 0 }];
      const res = await fetch(`${API_URL}/api/users/${currentUser.uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses: updatedAddresses })
      });
      if (res.ok) {
        const updated = await res.json();
        setUserData(updated);
        setIsAddingAddress(false);
        setNewAddressText('');
        setNewAddressTag('Home');
      }
    } catch (err) {
      setError("Failed to add address");
    }
  };

  const handleDeleteAddress = async (indexToDelete) => {
    try {
      const updatedAddresses = userData.addresses.filter((_, i) => i !== indexToDelete);
      const res = await fetch(`${API_URL}/api/users/${currentUser.uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses: updatedAddresses })
      });
      if (res.ok) {
        const updated = await res.json();
        setUserData(updated);
      }
    } catch (err) {
      setError("Failed to delete address");
    }
  };

  const handleUnlike = async (productId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${currentUser.uid}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      if (res.ok) {
        // Remove locally from state
        setUserData(prev => ({
          ...prev,
          likedPaints: prev.likedPaints.filter(p => (p._id || p) !== productId)
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className={styles.loadingContainer}><Loader2 className={styles.spinner} size={40} /><p>Loading profile...</p></div>;

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.profileWrapper}>
        <div className={styles.glowTop}></div>
        
        <div className={styles.profileCard}>
          <div className={styles.header}>
            <div className={styles.avatarCircle}>
              <User size={40} className={styles.avatarIcon} />
            </div>
            <h1>My Profile Settings</h1>
            <p>{userData?.email}</p>
          </div>

          {error && (
            <div className={styles.errorAlert}>
              <AlertCircle size={18} /><span>{error}</span>
            </div>
          )}

          <div className={styles.cardBody}>
            {/* Core Details */}
            <h2 className={styles.sectionHeading}>Personal Details</h2>
            <div className={styles.infoGroup}>
              <div className={styles.iconWrapper}><User size={20} /></div>
              <div className={styles.infoText}>
                <span className={styles.label}>Full Name</span>
                {isEditingName ? (
                  <div className={styles.editRow}>
                    <input type="text" value={tempName} onChange={e => setTempName(e.target.value)} className={styles.editInput} />
                    <button onClick={handleSaveName} className={styles.saveBtn}><Check size={16}/></button>
                  </div>
                ) : (
                  <div className={styles.editRow}>
                    <span className={styles.value}>{userData?.name}</span>
                    <button onClick={() => setIsEditingName(true)} className={styles.editBtn}><Edit2 size={16}/></button>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.infoGroup}>
              <div className={styles.iconWrapper}><Phone size={20} /></div>
              <div className={styles.infoText}>
                <span className={styles.label}>Primary Mobile</span>
                {isEditingPhone ? (
                  <div className={styles.editRow}>
                    <input type="tel" value={tempPhone} onChange={e => setTempPhone(e.target.value)} className={styles.editInput} />
                    <button onClick={handleSavePhone} className={styles.saveBtn}><Check size={16}/></button>
                  </div>
                ) : (
                  <div className={styles.editRow}>
                    <span className={styles.value}>{userData?.phone || 'Not provided'}</span>
                    <button onClick={() => setIsEditingPhone(true)} className={styles.editBtn}><Edit2 size={16}/></button>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.infoGroup}>
              <div className={styles.iconWrapper}><Phone size={20} /></div>
              <div className={styles.infoText}>
                <span className={styles.label}>Alternative Mobile</span>
                {isEditingAltPhone ? (
                  <div className={styles.editRow}>
                    <input type="tel" value={tempAltPhone} onChange={e => setTempAltPhone(e.target.value)} className={styles.editInput} />
                    <button onClick={handleSaveAltPhone} className={styles.saveBtn}><Check size={16}/></button>
                  </div>
                ) : (
                  <div className={styles.editRow}>
                    <span className={styles.value}>{userData?.altPhone || 'None'}</span>
                    <button onClick={() => setIsEditingAltPhone(true)} className={styles.editBtn}><Edit2 size={16}/></button>
                  </div>
                )}
              </div>
            </div>

            {/* Address Book */}
            <div className={styles.addressSectionHeader}>
              <h2 className={styles.sectionHeading}>Address Book</h2>
              <button 
                className={styles.addAddressBtn} 
                onClick={() => setIsAddingAddress(!isAddingAddress)}
              >
                <Plus size={16} /> Add New
              </button>
            </div>

            {isAddingAddress && (
              <div className={styles.addAddressForm}>
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
                  className={styles.addressTextarea}
                  placeholder="Enter complete shipping address..."
                  value={newAddressText}
                  onChange={e => setNewAddressText(e.target.value)}
                />
                <div className={styles.formActions}>
                  <button onClick={() => setIsAddingAddress(false)} className={styles.cancelBtn}>Cancel</button>
                  <button onClick={handleAddAddress} className={styles.saveAddressBtn}>Save Address</button>
                </div>
              </div>
            )}

            <div className={styles.addressGrid}>
              {userData?.addresses && userData.addresses.length > 0 ? (
                userData.addresses.map((addr, index) => (
                  <div key={index} className={styles.addressCard}>
                    <div className={styles.addressCardHeader}>
                      <span className={styles.addressTag}>{addr.tag}</span>
                      <button onClick={() => handleDeleteAddress(index)} className={styles.deleteAddressBtn}>
                         <Trash2 size={16} />
                      </button>
                    </div>
                    <p className={styles.addressText}>{addr.text}</p>
                  </div>
                ))
              ) : (
                <p className={styles.noAddresses}>No addresses saved yet.</p>
              )}
            </div>

            {/* Liked Paints Section */}
            <div className={styles.sectionHeaderSpacing}>
              <h2 className={styles.sectionHeading} style={{marginTop: '3rem'}}>My Liked Paints <Heart size={20} color="#FF4757" fill="#FF4757" style={{marginLeft: '8px', display:'inline'}}/></h2>
            </div>
            <div className={styles.likedGrid}>
              {userData?.likedPaints && userData.likedPaints.length > 0 ? (
                userData.likedPaints.map((paint) => (
                  <div key={paint._id} className={styles.likedCard} onClick={() => navigate(`/product/${paint._id}`)}>
                    <div className={styles.likedColorDisplay} style={{ backgroundColor: paint.colorHex || '#FFD700' }}>
                      <button 
                        className={styles.unlikeBtn} 
                        onClick={(e) => { e.stopPropagation(); handleUnlike(paint._id); }}
                      >
                        <Heart size={18} fill="#FF4757" color="#FF4757" />
                      </button>
                    </div>
                    <div className={styles.likedInfo}>
                      <h4 className={styles.likedName}>{paint.name}</h4>
                      <span className={styles.likedCompany}>{paint.company}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.noAddresses}>You haven't liked any paints yet. Explore the shop!</p>
              )}
            </div>

          </div>

          <div className={styles.footer}>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              <LogOut size={20} />
              Log Out
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
