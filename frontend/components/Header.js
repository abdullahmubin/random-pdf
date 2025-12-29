/**
 * Header Component with navigation and user menu
 */
'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import styles from './Header.module.css';
import Icon from './Icon';
import Logo from './Logo';
import { useState, useRef, useEffect } from 'react';

export default function Header() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (open && menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [open])

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

          <button className={styles.hamburger} aria-label="Toggle menu" onClick={() => setOpen(v => !v)}>
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </button>
        </nav>

        {/* Mobile menu */}
        <div ref={menuRef} className={`${styles.mobileMenu} ${open ? styles.open : ''}`}>
          <Link href="/whatsapp" onClick={() => setOpen(false)}>WhatsApp → PDF</Link>
          <Link href="/images" onClick={() => setOpen(false)}>Images → PDF</Link>
          <Link href="/merge" onClick={() => setOpen(false)}>Merge PDFs</Link>
          {user ? (
            <div className={styles.mobileUser}>
              <div>
                <div className={styles.userEmail}>{user.email}</div>
                {user.subscription === 'premium' && <div className={styles.badge}>Premium</div>}
              </div>
              <button onClick={() => { logout(); setOpen(false) }} className={styles.logoutButton}>Logout</button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
