import styles from './submitButton.module.scss';

interface SubmitButtonProps {
  children: React.ReactNode;
}

function SubmitButton({ children }: SubmitButtonProps) {
  return (
    <button className={styles.submitButton} type="submit">
      {children}
    </button>
  );
}

export default SubmitButton;
