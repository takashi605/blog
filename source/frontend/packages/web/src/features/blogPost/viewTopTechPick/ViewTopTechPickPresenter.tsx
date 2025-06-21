import Link from 'next/link';
import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import { extractFirstParagraph } from 'service/src/blogPostService/dto/blogPostDTOProcessor/excerptedBlogPostDTO';
import Thumbnail from 'shared-ui/src/blogPost/components/Thumbnail';
import BlogPostTitle from '../ui/BlogPostTitle';
import { Paragraph } from '../ui/contents/elements/Paragraph';
import styles from './viewTopTechPick.module.scss';

type ViewTopTechPickPresenterProps = {
  blogPostDTO: BlogPostDTO;
};

function ViewTopTechPickPresenter({
  blogPostDTO,
}: ViewTopTechPickPresenterProps) {
  // TODO Presenter にロジックが混入しているため、フロントエンドの構造を変更する
  const excerpted = extractFirstParagraph(blogPostDTO);
  
  // YYYY-MM-DD 形式を YYYY/M/D 形式に変換
  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    return `${year}/${parseInt(month, 10)}/${parseInt(day, 10)}`;
  };

  return (
    <div>
      <div className={styles.titleWrapper}>
        <span className={styles.sectionTitle}>TOP TECH PICK!</span>
        <BlogPostTitle size="large">{blogPostDTO.title}</BlogPostTitle>
      </div>
      <div className={styles.contentSummary}>
        <div className={styles.thumbnail}>
          <Thumbnail path={blogPostDTO.thumbnail.path} />
        </div>
        <div className={styles.contentSummaryTexts}>
          <Paragraph richText={excerpted} />
          <div className={styles.contentSummaryMeta}>
            <time className={styles.postDate}>{formatDate(blogPostDTO.postDate)}</time>
            <Link
              className={styles.linkToPost}
              href={`/posts/${blogPostDTO.id}`}
            >
              <span className={styles.linkText}>記事を見る</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewTopTechPickPresenter;
