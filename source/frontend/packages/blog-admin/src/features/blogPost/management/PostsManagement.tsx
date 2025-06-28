'use client';
import { CldImage } from 'next-cloudinary';
import Link from 'next/link';
import { useBlogPostList } from '../list/useBlogPostList';
import styles from './PostsManagement.module.scss';
import NavigationLinkButton from './ui/NavigationLinkButton';

export default function PostsManagement() {
  const { getAllBlogPosts } = useBlogPostList({ includeUnpublished: true });
  const posts = getAllBlogPosts();

  return (
    <section data-testid="posts-manage-section">
      <div className={styles.navigationButtons}>
        <NavigationLinkButton href="/posts/create">
          記事を投稿
        </NavigationLinkButton>
        <NavigationLinkButton href="/posts/pickup">
          ピックアップ記事を選択
        </NavigationLinkButton>
        <NavigationLinkButton href="/posts/popular">
          人気記事を選択
        </NavigationLinkButton>
        <NavigationLinkButton href="/posts/top-tech-pick">
          トップテック記事を選択
        </NavigationLinkButton>
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
              <Link href={`/posts/${post.id}/edit`}>
                <button type="button">編集</button>
              </Link>
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
