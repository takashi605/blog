import styles from './ErrorMessage.module.scss';

interface ErrorMessageProps {
  children: React.ReactNode;
  absolute?: boolean;
}

function ErrorMessage({ children, absolute = false }: ErrorMessageProps) {
  return (
    <p
      role="alert"
      className={`${styles.error} ${absolute ? styles.absolute : ''}`}
    >
      {children}
    </p>
  );
}

export default ErrorMessage;
