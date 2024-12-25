import React from 'react';
import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import styles from 'shared-styles/src/blogPostViewer.module.scss';
import BlogPostDate from '../ui/BlogPostDate';
import BlogPostTitle from '../ui/BlogPostTitle';
import Thumbnail from '../ui/Thumbnail';
import ContentRenderer from '../ui/contents/Content';

type ViewBlogPostPresenterProps = {
  blogPost: BlogPostDTO;
};

export function ViewBlogPostPresenter({
  blogPost,
}: ViewBlogPostPresenterProps) {
  return (
    <article className={styles.article}>
      <div className={styles.datesWrapper}>
        <BlogPostDate label="投稿日" date={blogPost.postDate} />
        <BlogPostDate label="更新日" date={blogPost.lastUpdateDate} />
      </div>
      <div className={styles.blogTitle}>
        <BlogPostTitle>{blogPost?.title}</BlogPostTitle>
      </div>
      <div className={styles.thumbnail}>
        <Thumbnail thumbnail={blogPost.thumbnail} />
      </div>
      {blogPost?.contents.map((content) => (
        <div key={content.id} className={generateContentClass(content.type)}>
          <ContentRenderer content={content} />
        </div>
      ))}
    </article>
  );
}

export default React.memo(ViewBlogPostPresenter);

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
