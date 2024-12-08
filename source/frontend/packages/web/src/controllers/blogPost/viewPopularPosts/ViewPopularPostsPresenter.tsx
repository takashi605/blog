import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import Thumbnail from '../ui/Thumbnail';
import styles from './viewPopularPostsPresenter.module.scss';

type ViewPopularPostsPresenterProps = {
  blogPostsDTO: BlogPostDTO[];
};

function ViewPopularPostsPresenter({
  blogPostsDTO,
}: ViewPopularPostsPresenterProps) {
  return (
    <div className={styles.flexContainer}>
      <div className={styles.flexItem}>
        <span className={styles.sectionCatchPhrases}>Popular!!</span>
        <h2 className={styles.sectionTitle}>人気記事</h2>
        <div className={styles.sectionDescription}>
          <p>ここ最近で人気の記事です。</p>
          <p>大体3ヶ月に1回くらい更新します。</p>
        </div>
      </div>
      {blogPostsDTO.map((blogPostDTO) => (
        <div className={styles.flexItem} key={blogPostDTO.id}>
          <div className={styles.thumbnail}>
            <Thumbnail thumbnail={blogPostDTO.thumbnail} />
          </div>
          <h3 className={styles.postTitle}>{blogPostDTO.title}</h3>
        </div>
      ))}
    </div>
  );
}

export default ViewPopularPostsPresenter;
