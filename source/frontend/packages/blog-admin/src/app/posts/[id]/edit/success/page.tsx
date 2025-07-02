import Link from 'next/link';
import styles from './page.module.scss';

function EditBlogPostSuccessPage({ params }: { params: { id: string } }) {
  if (!process.env.NEXT_PUBLIC_WEB_URL) {
    throw new Error('WEB_URL が設定されていません');
  }
  const web_url = process.env.NEXT_PUBLIC_WEB_URL;

  const editedPageId = params.id;
  if (!editedPageId) {
    throw new Error('id が設定されていません');
  }

  const editedPageUrl = `${web_url}/posts/${editedPageId}`;

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.iconSection}>
            <div className={styles.iconContainer}>
              <svg
                className={styles.icon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className={styles.title}>記事を更新しました！</h2>
            <p className={styles.description}>記事が正常に更新されました。</p>
          </div>

          <div className={styles.buttonGroup}>
            <Link href={editedPageUrl} className={styles.primaryButton}>
              更新した記事を見る
            </Link>

            <Link href="/posts" className={styles.secondaryButton}>
              記事管理画面に戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditBlogPostSuccessPage;
