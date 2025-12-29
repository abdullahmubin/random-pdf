/**
 * Header Component with navigation and user menu
 */
'use client';

import { useAuth } from '@/lib/AuthContext';
import styles from './Header.module.css';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>💬</span>
          <span className={styles.logoText}>WhatsApp to PDF</span>
        </div>

        <nav className={styles.nav}>
          {user ? (
            <div className={styles.userMenu}>
              <span className={styles.userEmail}>{user.email}</span>
              {user.subscription === 'premium' && (
                <span className={styles.badge}>Premium</span>
              )}
              <button onClick={logout} className={styles.logoutButton}>
                Logout
              </button>
            </div>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
