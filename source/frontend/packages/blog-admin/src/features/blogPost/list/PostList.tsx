import styles from './postList.module.scss';

type PostListProps = {
  title: string;
  posts: Array<{ id: string; title: string }>;
  emptyMessage: string;
};

function PostList({ title, posts, emptyMessage }: PostListProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>

      {posts.length > 0 ? (
        <ul className={styles.postList}>
          {posts.map((post) => (
            <li key={post.id} className={styles.postItem}>
              <h3 className={styles.postTitle}>{post.title}</h3>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.emptyState}>{emptyMessage}</div>
      )}
    </div>
  );
}

export default PostList;
