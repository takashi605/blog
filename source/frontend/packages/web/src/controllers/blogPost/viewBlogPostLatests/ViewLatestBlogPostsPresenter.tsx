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
      <h2 className={styles.pageTitle}>新着記事</h2>
      <ul className={styles.blogPostList}>
        {blogPosts.map((blogPost) => (
          <li className={styles.blogPostItem} key={blogPost.id}>
            <div className={styles.thumbnail}>
              <Thumbnail path={blogPost.thumbnail.path} />
              <p className={styles.postDate}>投稿日:{blogPost.postDate}</p>
            </div>
            <h3 className={styles.blogPostTitle}>{blogPost.title}</h3>
          </li>
        ))}
      </ul>
    </>
  );
}
export default ViewLatestBlogPostsPresenter;
