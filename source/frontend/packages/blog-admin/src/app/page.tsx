import Link from 'next/link';
import PageTitle from '../components/ui/pageTitle';
import styles from './page.module.scss';

export default function Dashboard() {
  return (
    <div>
      <PageTitle>管理者ダッシュボード</PageTitle>
      <div className={styles.container}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>コンテンツ管理</h2>
          <div className={styles.linkContainer}>
            <Link
              href="/posts"
              className={`${styles.link} ${styles.postsLink}`}
            >
              記事管理
            </Link>
            <Link
              href="/images"
              className={`${styles.link} ${styles.imagesLink}`}
            >
              画像管理
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
