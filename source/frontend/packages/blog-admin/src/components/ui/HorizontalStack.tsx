import type { ReactNode } from 'react';
import styles from './horizontalStack.module.scss';

interface HorizontalStackProps {
  children: ReactNode;
}

export default function HorizontalStack({ children }: HorizontalStackProps) {
  return <div className={styles.container}>{children}</div>;
}
