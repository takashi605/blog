import { memo } from 'react';
import styles from './h3.module.scss';
import type { ContentElementProps } from './type';

export function H3({ children }: ContentElementProps) {
  return <h3 className={styles.h3}>{children}</h3>;
}

export default memo(H3);
