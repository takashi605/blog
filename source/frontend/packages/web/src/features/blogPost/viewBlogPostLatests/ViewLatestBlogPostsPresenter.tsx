import Link from 'next/link';
import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import Thumbnail from 'shared-ui/src/blogPost/components/Thumbnail';
import styles from './viewLatestBlogPostsPresenter.module.scss';

type ViewLatestBlogPostsPresenterProps = {
  blogPosts: BlogPostDTO[];
};

function ViewLatestBlogPostsPresenter({
  blogPosts,
}: ViewLatestBlogPostsPresenterProps) {
  return (
    <>
      <h2 className={styles.sectionTitle}>新着記事</h2>
      <div className={styles.blogPostList}>
        {blogPosts.map((blogPost) => (
          <Link
            href={`/posts/${blogPost.id}`}
            className={`${styles.blogPostItem} ${styles.linkToPost}`}
            key={blogPost.id}
          >
            <div className={styles.thumbnail}>
              <Thumbnail path={blogPost.thumbnail.path} />
              <p className={styles.postDate}>投稿日:{blogPost.postDate}</p>
            </div>
            <h3 className={styles.blogPostTitle}>{blogPost.title}</h3>
          </Link>
        ))}
      </div>
    </>
  );
}
export default ViewLatestBlogPostsPresenter;
