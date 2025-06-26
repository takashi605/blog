'use client';
import { useRouter } from 'next/navigation';
import styles from './backButton.module.scss';

interface BackButtonProps {
  to: string;
  children: React.ReactNode;
}

export default function BackButton({ to, children }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(to)}
      className={styles.backButton}
    >
      {children}
    </button>
  );
}
