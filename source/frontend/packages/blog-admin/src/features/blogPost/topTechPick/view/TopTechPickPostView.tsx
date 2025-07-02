'use client';
import styles from './topTechPickPostView.module.scss';
import { useTopTechPickPostList } from './useTopTechPickPostView';

function TopTechPickPostList() {
  const { getTopTechPickPost } = useTopTechPickPostList();
  const post = getTopTechPickPost();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>現在のトップテックピック記事</h2>

      {post ? (
        <div className={styles.postContainer}>
          <h3 className={styles.postTitle}>{post.title}</h3>
        </div>
      ) : (
        <div className={styles.emptyState}>
          トップテックピック記事が設定されていません
        </div>
      )}
    </div>
  );
}

export default TopTechPickPostList;
