import styles from './header.module.scss';

function Header() {
  return (
    <div className={styles.headerWrapper}>
      <header className={styles.header}>
        <div className={styles.blogTitle}>鉄火ブログ</div>
      </header>
    </div>
  );
}

export default Header;
