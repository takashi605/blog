import type { BlogPostDateProps } from '@/components/models/blogPost/view/controllers/types';
import { memo } from 'react';
import styles from './blogPostDate.module.scss';

function BlogPostDate({ label, date }: BlogPostDateProps) {
  return (
    <p className={styles.date}>
      {label}:<time dateTime={date}>{date}</time>
    </p>
  );
}

export default memo(BlogPostDate);
