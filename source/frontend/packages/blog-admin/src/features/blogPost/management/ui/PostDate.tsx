import styles from './PostDate.module.scss';

interface PostDateProps {
  dateString: string;
  testId?: string;
}

export default function PostDate({
  dateString,
  testId = 'post-date',
}: PostDateProps) {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}/${month}/${day}`;
  };

  return (
    <span data-testid={testId} className={styles.postDate}>
      {formatDate(dateString)}
    </span>
  );
}
