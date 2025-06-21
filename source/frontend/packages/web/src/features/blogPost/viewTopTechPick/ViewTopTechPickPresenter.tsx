import Link from 'next/link';
import type { components } from 'shared-lib/src/generated/api-types';
import Thumbnail from 'shared-ui/src/blogPost/components/Thumbnail';
import BlogPostTitle from '../ui/BlogPostTitle';
import { Paragraph } from '../ui/contents/elements/Paragraph';
import styles from './viewTopTechPick.module.scss';

type BlogPost = components['schemas']['BlogPost'];

type ViewTopTechPickPresenterProps = {
  blogPost: BlogPost;
};

function ViewTopTechPickPresenter({ blogPost }: ViewTopTechPickPresenterProps) {
  // コンテンツの最初の段落を抽出
  const firstParagraphContent = blogPost.contents.find(
    (content) => content.type === 'paragraph',
  );

  // YYYY-MM-DD 形式を YYYY/M/D 形式に変換
  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    return `${year}/${parseInt(month, 10)}/${parseInt(day, 10)}`;
  };

  return (
    <div>
      <div className={styles.titleWrapper}>
        <span className={styles.sectionTitle}>TOP TECH PICK!</span>
        <BlogPostTitle size="large">{blogPost.title}</BlogPostTitle>
      </div>
      <div className={styles.contentSummary}>
        <div className={styles.thumbnail}>
          <Thumbnail path={blogPost.thumbnail.path} />
        </div>
        <div className={styles.contentSummaryTexts}>
          {firstParagraphContent && (
            <Paragraph richText={firstParagraphContent.text} />
          )}
          <div className={styles.contentSummaryMeta}>
            <time className={styles.postDate}>
              {formatDate(blogPost.postDate)}
            </time>
            <Link className={styles.linkToPost} href={`/posts/${blogPost.id}`}>
              <span className={styles.linkText}>記事を見る</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewTopTechPickPresenter;
