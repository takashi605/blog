import styles from './submitButton.module.scss';

function SubmitButton() {
  return (
    <button className={styles.submitButton} type="submit">
      投稿
    </button>
  );
}

export default SubmitButton;