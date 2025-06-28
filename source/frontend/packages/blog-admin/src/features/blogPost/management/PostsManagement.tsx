'use client';
import { CldImage } from 'next-cloudinary';
import Link from 'next/link';
import { useBlogPostList } from '../list/useBlogPostList';
import styles from './PostsManagement.module.scss';

export default function PostsManagement() {
  const { getAllBlogPosts } = useBlogPostList({ includeUnpublished: true });
  const posts = getAllBlogPosts();

  return (
    <section data-testid="posts-manage-section">
      <div className={styles.navigationButtons}>
        <Link href="/posts/create">
          <button type="button">記事を投稿</button>
        </Link>
        <Link href="/posts/pickup">
          <button type="button">ピックアップ記事を選択</button>
        </Link>
        <Link href="/posts/popular">
          <button type="button">人気記事を選択</button>
        </Link>
        <Link href="/posts/top-tech-pick">
          <button type="button">トップテック記事を選択</button>
        </Link>
      </div>

      <div className={styles.postsList}>
        {posts.map((post) => (
          <div
            key={post.id}
            data-testid="post-card"
            className={styles.postCard}
          >
            <div className={styles.postContent}>
              <h3>{post.title}</h3>
              <span data-testid="post-date" className={styles.postDate}>
                {formatDate(post.postDate)}
              </span>
            </div>
            {post.thumbnail && (
              <CldImage
                src={post.thumbnail.path}
                width={120}
                height={80}
                alt="サムネイル画像"
                className={styles.thumbnail}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}/${month}/${day}`;
}
