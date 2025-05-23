import Link from 'next/link';
import styles from './not-found.module.scss';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.message}>ページが見つかりませんでした</p>
      <p className={styles.description}>
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <Link href="/" className={styles.link}>
        トップページへ戻る
      </Link>
    </div>
  );
}
