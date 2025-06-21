import Link from 'next/link';
import type { components } from 'shared-lib/src/generated/api-types';
import Thumbnail from 'shared-ui/src/blogPost/components/Thumbnail';
import styles from './viewPopularPostsPresenter.module.scss';

type BlogPost = components['schemas']['BlogPost'];

type ViewPopularPostsPresenterProps = {
  blogPosts: BlogPost[];
};

function ViewPopularPostsPresenter({
  blogPosts,
}: ViewPopularPostsPresenterProps) {
  return (
    <div className={styles.flexContainer}>
      <div className={styles.flexItem}>
        <span className={styles.sectionCatchPhrases}>Popular!!</span>
        <h2 className={styles.sectionTitle}>人気記事</h2>
        <div className={styles.sectionDescription}>
          <p>ここ最近で人気の記事です。</p>
          <p>大体3ヶ月に1回くらい更新されます。</p>
        </div>
      </div>
      {blogPosts.map((blogPost) => (
        <Link
          href={`/posts/${blogPost.id}`}
          className={`${styles.linkToPost} ${styles.flexItem}`}
          key={blogPost.id}
        >
          <div className={styles.thumbnail}>
            <Thumbnail path={blogPost.thumbnail.path} />
          </div>
          <h3 className={styles.postTitle}>{blogPost.title}</h3>
        </Link>
      ))}
    </div>
  );
}

export default ViewPopularPostsPresenter;
