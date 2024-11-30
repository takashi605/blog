import { memo } from 'react';
import styles from './h2.module.scss';
import type { ContentElementProps } from './type';

export function H2({ children }: ContentElementProps) {
  return <h2 className={styles.h2}>{children}</h2>;
}

export default memo(H2);
