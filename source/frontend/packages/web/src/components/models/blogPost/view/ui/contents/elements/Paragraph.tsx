import type { ContentElementProps } from '@/components/models/blogPost/view/ui/contents/Content';
import styles from './paragraph.module.scss';

export function Paragraph({ children }: ContentElementProps) {
  return <p className={styles.paragraph}>{children}</p>;
}

export default Paragraph;
