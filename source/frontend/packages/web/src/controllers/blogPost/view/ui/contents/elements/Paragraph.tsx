import type { ContentElementProps } from '@/controllers/blogPost/view/ui/contents/elements/type';
import { memo } from 'react';
import styles from './paragraph.module.scss';

export function Paragraph({ children }: ContentElementProps) {
  return <p className={styles.paragraph}>{children}</p>;
}

export default memo(Paragraph);
