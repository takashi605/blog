import type { ContentElementProps } from '@/controllers/blogPost/view/ui/contents/elements/type';
import { memo } from 'react';
import styles from './h2.module.scss';

export function H2({ children }: ContentElementProps) {
  return <h2 className={styles.h2}>{children}</h2>;
}

export default memo(H2);
