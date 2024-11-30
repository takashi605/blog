import React, { memo } from 'react';
import styles from './blogPostTitle.module.scss';

type BlogPostTitleProps = {
  children: React.ReactNode;
  size?: 'large' | 'semiLarge';
};

function BlogPostTitle({ children,size='semiLarge' }: BlogPostTitleProps) {
  return <h1 className={`${styles.title} ${styles[size]}`}>{children}</h1>;
}

export default memo(BlogPostTitle);
