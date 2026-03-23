import React, { useState } from 'react';
import { Mail, Lock, User, UserPlus, AlertCircle, Paintbrush } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase';
import styles from './Register.module.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Use try/catch since react-router-dom might not be deeply integrated yet in the app
  let navigate;
  try {
    navigate = useNavigate();
  } catch (e) {
    navigate = (path) => { window.location.href = path };
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !address || !password || !confirmPassword || !phone) {
      return setError('Please fill in all mandatory fields including Mobile Number.');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    if (password.length < 6) {
      return setError('Password should be at least 6 characters.');
    }
    
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's profile with their display name
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: name
        });
        
        // Save extra user details to MongoDB Backend
        try {
          const res = await fetch('http://localhost:5000/api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              firebaseUid: auth.currentUser.uid,
              name,
              email,
              phone,
              altPhone,
              address
            })
          });
          
          if (!res.ok) {
            console.error("Failed to save user to backend DB");
          }
        } catch (dbError) {
          console.error("MongoDB API error:", dbError);
        }
      }
      
      // Change path depending on app logic
      navigate('/');
    } catch (err) {
      console.error(err);
      switch(err.code) {
        case 'auth/email-already-in-use':
          setError('An account with this email already exists.');
          break;
        case 'auth/invalid-email':
          setError('Please provide a valid email address.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Please use a stronger password.');
          break;
        default:
          setError('Failed to create an account. Please try again.');
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Background ambient blobs */}
      <div className={styles.blob1}></div>
      <div className={styles.blob2}></div>

      {/* App Logo and Brand - Amazon style */}
      <Link to="/" className={styles.logoOuter}>
        <div className={styles.logoIconLarge}>
          <Paintbrush size={32} color="#00C9FF" />
        </div>
        <span className={styles.logoTextLarge}>Chromo<span className={styles.logoSuffix}>.in</span></span>
      </Link>

      <div className={styles.formCard}>
        <div className={styles.header}>
          <h1>Join Chromo</h1>
          <p>Create an account to start creating</p>
        </div>

        {error && (
          <div className={styles.error}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className={styles.inputGroup}>
            <input 
              type="text" 
              placeholder="Full Name" 
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <User className={styles.inputIcon} />
          </div>

          <div className={styles.inputGroup}>
            <input 
              type="email" 
              placeholder="Email address" 
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Mail className={styles.inputIcon} />
          </div>

          <div className={styles.inputGroup}>
            <input 
              type="text" 
              placeholder="Full Address" 
              className={styles.input}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <input 
                type="tel" 
                placeholder="Mobile Number" 
                className={styles.input}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <input 
                type="tel" 
                placeholder="Alternative Mobile (Optional)" 
                className={styles.input}
                value={altPhone}
                onChange={(e) => setAltPhone(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <input 
                type="password" 
                placeholder="Password" 
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock className={styles.inputIcon} />
            </div>

            <div className={styles.inputGroup}>
              <input 
                type="password" 
                placeholder="Confirm" 
                className={styles.input}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Lock className={styles.inputIcon} />
            </div>
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Creating Account...' : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <UserPlus size={20} /> Create Account
              </span>
            )}
          </button>
        </form>

        <div className={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" className={styles.link}>Sign in now</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
