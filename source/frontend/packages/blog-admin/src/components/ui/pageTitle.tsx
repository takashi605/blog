import styles from './pageTitle.module.scss';

interface PageTitleProps {
  children: React.ReactNode;
}

export default function PageTitle({ children }: PageTitleProps) {
  return <h1 className={styles.pageTitle}>{children}</h1>;
}
