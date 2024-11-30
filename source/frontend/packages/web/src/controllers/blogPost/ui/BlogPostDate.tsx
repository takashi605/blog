import { memo } from 'react';
import styles from './blogPostDate.module.scss';

type BlogPostDateProps = {
  label: string;
  date: string;
};

function BlogPostDate({ label, date }: BlogPostDateProps) {
  return (
    <span className={styles.date}>
      {label}:<time dateTime={date}>{date}</time>
    </span>
  );
}

export default memo(BlogPostDate);
