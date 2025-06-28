'use client';
import { useBlogPostList } from '../list/useBlogPostList';
import styles from './PostsManagement.module.scss';
import NavigationLinkButton from './ui/NavigationLinkButton';
import PostDate from './ui/PostDate';
import PostEditLinkButton from './ui/PostEditLinkButton';
import PostThumbnail from './ui/PostThumbnail';

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
              <PostDate dateString={post.postDate} />
              <h3>{post.title}</h3>

              <PostEditLinkButton postId={post.id}>編集</PostEditLinkButton>
            </div>
            {post.thumbnail && (
              <PostThumbnail imagePath={post.thumbnail.path} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
