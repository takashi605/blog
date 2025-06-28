import Link from 'next/link';
import styles from './NavigationLinkButton.module.scss';

interface NavigationLinkButtonProps {
  href: string;
  children: React.ReactNode;
}

export default function NavigationLinkButton({
  href,
  children,
}: NavigationLinkButtonProps) {
  return (
    <Link href={href}>
      <button type="button" className={styles.button}>
        {children}
      </button>
    </Link>
  );
}
