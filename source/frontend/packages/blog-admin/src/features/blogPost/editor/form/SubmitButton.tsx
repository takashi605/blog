import styles from './submitButton.module.scss';

interface SubmitButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
}

function SubmitButton({ children, isLoading = false, loadingText = '投稿中...' }: SubmitButtonProps) {
  return (
    <button 
      className={styles.submitButton} 
      type="submit"
      disabled={isLoading}
    >
      {isLoading ? loadingText : children}
    </button>
  );
}

export default SubmitButton;
