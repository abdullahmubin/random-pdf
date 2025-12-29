/**
 * Google Sign-In Button Component
 */
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import styles from './GoogleSignIn.module.css';

export default function GoogleSignIn() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('googleSignInButton'),
          {
            theme: 'outline',
            size: 'large',
            width: 300,
            text: 'continue_with',
          }
        );
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCredentialResponse = async (response) => {
    setLoading(true);
    setError('');

    try {
      await login(response.credential);
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {loading && <p>Signing in...</p>}
      {error && <p className={styles.error}>{error}</p>}
      <div id="googleSignInButton"></div>
    </div>
  );
}
