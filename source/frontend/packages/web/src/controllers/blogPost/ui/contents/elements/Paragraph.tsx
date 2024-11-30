import { memo } from 'react';
import styles from './paragraph.module.scss';
import type { ContentElementProps } from './type';

export function Paragraph({ children }: ContentElementProps) {
  return <p className={styles.paragraph}>{children}</p>;
}

export default memo(Paragraph);
