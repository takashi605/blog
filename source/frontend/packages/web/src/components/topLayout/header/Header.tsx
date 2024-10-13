import styles from './header.module.scss';

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.blogTitle}>鉄火ブログ</div>
    </header>
  );
}

export default Header;
