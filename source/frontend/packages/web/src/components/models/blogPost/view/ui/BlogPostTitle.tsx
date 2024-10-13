import React from 'react';
import styles from './blogPostTitle.module.scss';

type BlogPostTitleProps = {
  children: React.ReactNode;
};

function BlogPostTitle({ children }: BlogPostTitleProps) {
  return <h1 className={styles.title}>{children}</h1>;
}

export default BlogPostTitle;
