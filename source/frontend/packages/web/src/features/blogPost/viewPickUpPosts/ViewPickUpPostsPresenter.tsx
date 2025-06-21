import Link from 'next/link';
import type { components } from 'shared-lib/src/generated/api-types';
import Thumbnail from 'shared-ui/src/blogPost/components/Thumbnail';
import styles from './viewPickUpPostsPresenter.module.scss';

type BlogPost = components['schemas']['BlogPost'];

type ViewPickUpPostsPresenterProps = {
  blogPosts: BlogPost[];
};

function ViewPickUpPostsPresenter({
  blogPosts,
}: ViewPickUpPostsPresenterProps) {
  return (
    <div className={styles.flexContainer}>
      <div className={styles.flexItem}>
        <span className={styles.sectionCatchPhrases}>PICK UP!!</span>
        <h2 className={styles.sectionTitle}>注目記事</h2>
        <div className={styles.sectionDescription}>
          <p>幅広い人におすすめの記事です。</p>
          <p>このブログの雰囲気を掴んでいただけると思います。</p>
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

export default ViewPickUpPostsPresenter;
