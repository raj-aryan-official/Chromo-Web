import React, { useState } from 'react';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import styles from './Login.module.css';

const Login = () => {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(location.state?.message || '');
  const [loading, setLoading] = useState(false);
  
  // Use try/catch since react-router-dom might not be deeply integrated yet in the app
  let navigate;
  try {
    navigate = useNavigate();
  } catch (e) {
    navigate = (path) => { window.location.href = path };
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      return setError('Please enter both email and password.');
    }
    
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Change path depending on app logic
      navigate('/');
    } catch (err) {
      console.error(err);
      switch(err.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Invalid email or password.');
          break;
        case 'auth/too-many-requests':
          setError('Too many attempts. Please try again later.');
          break;
        default:
          setError('Failed to login. Please try again.');
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

      <div className={styles.formCard}>
        <div className={styles.header}>
          <h1>Welcome Back</h1>
          <p>Login to your Chromo account</p>
        </div>

        {error && (
          <div className={styles.error}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
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
              type="password" 
              placeholder="Password" 
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Lock className={styles.inputIcon} />
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Authenticating...' : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <LogIn size={20} /> Login
              </span>
            )}
          </button>
        </form>

        <div className={styles.footer}>
          Don't have an account?{' '}
          {/* Fallback to normal anchor if Link fails without router context */}
          <Link to="/register" className={styles.link}>Create one now</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
