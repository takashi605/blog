import { useState } from 'react';
import { useCommonModalContext } from './CommonModalProvider';
import styles from './commonModalOpenButton.module.scss';

type CommonModalOpenButtonProps = {
  children: React.ReactNode;
  isModalOpenable?: boolean;
  // モーダルを開けなかった時のメッセージ
  openFailMessage?: string;
};

function CommonModalOpenButton({
  isModalOpenable = true,
  openFailMessage = 'モーダルを開けませんでした',
  children,
}: CommonModalOpenButtonProps) {
  const [failOpen, setFailOpen] = useState(false);
  const { openModal } = useCommonModalContext();
  const openModalHandler = () => {
    if (isModalOpenable) {
      openModal();
    } else {
      setFailOpen(true);
      setTimeout(() => {
        setFailOpen(false);
      }, 2000);
    }
  };

  return (
    <>
      <button className={styles.button} type="button" onClick={openModalHandler}>
        {children}
      </button>
      {failOpen && <p>{openFailMessage}</p>}
    </>
  );
}

export default CommonModalOpenButton;
