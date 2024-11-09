import Thumbnail from '@/components/models/blogPost/view/controllers/Thumbnail';
import BlogPostDate from '@/components/models/blogPost/view/ui/BlogPostDate';
import BlogPostTitle from '@/components/models/blogPost/view/ui/BlogPostTitle';
import ContentRenderer from '@/components/models/blogPost/view/ui/contents/Content';
import type { ViewBlogPostDTO } from '@/usecases/view/output/dto/index';
import { memo } from 'react';
import styles from './viewBlogPostController.module.scss';

type ViewBlogPostControllerProps = {
  blogPost: ViewBlogPostDTO;
};

function ViewBlogPostController({ blogPost }: ViewBlogPostControllerProps) {
  return (
    <article className={styles.article}>
      <div className={styles.datesWrapper}>
        <BlogPostDate label="投稿日" date={blogPost.postDate} />
        <BlogPostDate label="更新日" date={blogPost.lastUpdateDate} />
      </div>
      <div className={styles.blogTitle}>
        <BlogPostTitle>{blogPost?.title}</BlogPostTitle>
      </div>
      <Thumbnail thumbnail={blogPost.thumbnail} />
      {blogPost?.contents.map((content) => (
        <div key={content.id} className={generateContentClass(content.type)}>
          <ContentRenderer content={content} />
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
