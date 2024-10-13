import type { ContentElementProps } from '@/components/models/blogPost/view/ui/contents/Content';
import Image from 'next/image';
import styles from './h3.module.scss';

export function H3({ children }: ContentElementProps) {
  return (
    <h3 className={styles.h3}>
      <Image className={styles.h3Icon} src="/h3icon.svg" width={20} height={20} alt="猫は最高に可愛い" />
      <span className={styles.h3Text}>
        {children}
      </span>
    </h3>
  );
}

export default H3;
