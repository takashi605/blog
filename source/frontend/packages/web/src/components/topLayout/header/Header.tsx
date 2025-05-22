'use client';
import Link from 'next/link';
import { memo } from 'react';
import styles from './header.module.scss';
import SpNav from './SpNav';

function Header() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.blogTitle}>
          <Link href="/" className={`${styles.link} ${styles.blogTitle}`}>
            鉄火ブログ
          </Link>
        </div>
        <nav className={styles.nav}>
          <ul>
            <li>
              <Link href="/posts/latest" className={styles.link}>
                新着記事
              </Link>
            </li>
          </ul>
        </nav>

        <SpNav />
      </header>
    </>
  );
}

export default memo(Header);
