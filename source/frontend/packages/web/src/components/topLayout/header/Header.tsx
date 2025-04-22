import Link from 'next/link';
import { memo } from 'react';
import styles from './header.module.scss';

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

        <input type="checkbox" className={styles.menuButton} id="menuButton" />
        <label htmlFor="menuButton" className={styles.menuIcon}>
          <span className={styles.menuIconParts} />
        </label>

        <nav className={styles.spNav}>
          <ul>
            <li className={styles.top}>
              <Link href="/posts/latest" className={styles.link}>
                新着記事
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <div className={styles.spHeaderSpacer} />
    </>
  );
}

export default memo(Header);
