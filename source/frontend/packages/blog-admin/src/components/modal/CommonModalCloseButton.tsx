import styles from './CommonModalCloseButton.module.scss';
import { useCommonModalContext } from './CommonModalProvider';

type CommonModalCloseButtonProps = {
  children: React.ReactNode;
  buttonClassName?: string;
};

function CommonModalCloseButton({
  children,
  buttonClassName,
}: CommonModalCloseButtonProps) {
  const { closeModal } = useCommonModalContext();

  return (
    <button
      onClick={closeModal}
      className={`${styles.button}${buttonClassName ? ` ${buttonClassName}` : ''}`}
      type="button"
    >
      {children}
    </button>
  );
}

export default CommonModalCloseButton;
