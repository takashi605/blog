import { memo } from 'react';
import styles from './blogPostDate.module.scss';

type BlogPostDateProps = {
  label: string;
  date: string;
};

function BlogPostDate({ label, date }: BlogPostDateProps) {
  // YYYY-MM-DD 形式を YYYY/M/D 形式に変換
  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    return `${year}/${parseInt(month, 10)}/${parseInt(day, 10)}`;
  };

  const displayDate = formatDate(date);

  return (
    <span className={styles.date}>
      {label}:<time dateTime={date}>{displayDate}</time>
    </span>
  );
}

export default memo(BlogPostDate);
