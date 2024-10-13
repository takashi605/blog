import type { ContentElementProps } from '@/components/models/blogPost/view/ui/contents/Content';
import styles from './h2.module.scss';

export function H2({ children }: ContentElementProps) {
  return <h2 className={styles.h2}>{children}</h2>;
}

export default H2;
