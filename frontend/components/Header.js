/**
 * Header Component with navigation and user menu
 */
'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import styles from './Header.module.css';
import Icon from './Icon';
import Logo from './Logo';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <Logo small />
        </div>

        <nav className={styles.nav}>
          <Link href="/whatsapp">WhatsApp → PDF</Link>
          <Link href="/images">Images → PDF</Link>
          <Link href="/merge">Merge PDFs</Link>

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
