import React from 'react';
import type { BlogPostDTO } from 'service/src/blogPostRepository/repositoryOutput/blogPostDTO';
import Thumbnail from '../controllers/Thumbnail';
import BlogPostDate from './BlogPostDate';
import BlogPostTitle from './BlogPostTitle';
import ContentRenderer from './contents/Content';
import styles from './viewBlogPostPresenter.module.scss';

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
      <Thumbnail thumbnail={blogPost.thumbnail} />
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
