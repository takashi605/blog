import type {
  BlogPostContentProps,
  BlogPostDateProps,
  BlogPostTitleProps,
} from '@/components/models/blogPost/view/controllers/types';
import type { ViewBlogPost } from '@/usecases/view/output';
import { memo } from 'react';
import styles from './viewBlogPostController.module.scss';

type ViewBlogPostControllerProps = {
  blogPost: ViewBlogPost | null;
  Title: Title;
  Date: Date;
  Content: Content;
};

// render props するコンポーネントのインターフェースを定義
type Content = React.ComponentType<BlogPostContentProps>;
type Title = React.ComponentType<BlogPostTitleProps>;
type Date = React.ComponentType<BlogPostDateProps>;

function ViewBlogPostController({
  blogPost,
  Title,
  Date,
  Content,
}: ViewBlogPostControllerProps) {
  return (
    <article className={styles.article}>
      <div className={styles.datesWrapper}>
        <Date label="投稿日" date={blogPost?.postDate || ''} />
        <Date label="更新日" date={blogPost?.lastUpdateDate || ''} />
      </div>
      <div className={styles.blogTitle}>
        <Title>{blogPost?.title}</Title>
      </div>
      {blogPost?.contents.map((content) => (
        <div key={content.id} className={generateContentClass(content.type)}>
          <Content type={content.type} value={content.value} />
        </div>
      ))}
    </article>
  );
}

export default memo(ViewBlogPostController);

function generateContentClass(type: string): string | undefined {
  switch (type) {
    case 'paragraph':
      return styles.paragraph;
    case 'h2':
      return styles.h2;
    case 'h3':
      return styles.h3;
    default:
      return undefined;
  }
}
