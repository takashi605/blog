import Link from 'next/link';
import styles from './PostEditLinkButton.module.scss';

interface PostEditLinkButtonProps {
  postId: string;
  children: React.ReactNode;
}

export default function PostEditLinkButton({
  postId,
  children,
}: PostEditLinkButtonProps) {
  return (
    <Link href={`/posts/${postId}/edit`} className={styles.button}>
      {children}
    </Link>
  );
}
