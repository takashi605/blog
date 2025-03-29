import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import Thumbnail from '../ui/Thumbnail';
import styles from './viewPickUpPostsPresenter.module.scss';

type ViewPickUpPostsPresenterProps = {
  blogPostsDTO: BlogPostDTO[];
};

function ViewPickUpPostsPresenter({
  blogPostsDTO,
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
      {blogPostsDTO.map((blogPostDTO) => (
        <div className={styles.flexItem} key={blogPostDTO.id}>
          <div className={styles.thumbnail}>
            <Thumbnail path={blogPostDTO.thumbnail.path} />
          </div>
          <h3 className={styles.postTitle}>{blogPostDTO.title}</h3>
        </div>
      ))}
    </div>
  );
}

export default ViewPickUpPostsPresenter;
