'use client';
import styles from './pickUpPostList.module.scss';
import { usePickUpPostList } from './usePickUpPostList';

function PickUpPostList() {
  const { getAllPickUpPosts } = usePickUpPostList();
  const posts = getAllPickUpPosts();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>現在のピックアップ記事</h2>

      {posts.length > 0 ? (
        <ul className={styles.postList}>
          {posts.map((post) => (
            <li key={post.id} className={styles.postItem}>
              <h3 className={styles.postTitle}>{post.title}</h3>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.emptyState}>
          ピックアップ記事が設定されていません
        </div>
      )}
    </div>
  );
}

export default PickUpPostList;
