import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import { useExcerpted } from '../hooks/useExcerpted';
import BlogPostTitle from '../ui/BlogPostTitle';
import { Paragraph } from '../ui/contents/elements/Paragraph';
import Thumbnail from '../ui/Thumbnail';
import styles from './viewTopTechPick.module.scss';

type ViewTopTechPickPresenterProps = {
  blogPostDTO: BlogPostDTO;
};

function ViewTopTechPickPresenter({
  blogPostDTO,
}: ViewTopTechPickPresenterProps) {
  // TODO Presenter にロジックが混入しているため、フロントエンドの構造を変更する
  const excerpted = useExcerpted(blogPostDTO.contents);

  return (
    <div>
      <div className={styles.titleWrapper}>
        <span className={styles.sectionTitle}>TOP TECH PICK!</span>
        <BlogPostTitle size="large">{blogPostDTO.title}</BlogPostTitle>
      </div>
      <div className={styles.contentSummary}>
        <div className={styles.thumbnail}>
          <Thumbnail thumbnail={blogPostDTO.thumbnail} />
        </div>
        <div className={styles.contentSummaryTexts}>
          <Paragraph richText={excerpted} />
          <time className={styles.postDate}>{blogPostDTO.postDate}</time>
        </div>
      </div>
    </div>
  );
}

export default ViewTopTechPickPresenter;
