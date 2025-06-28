import { useState } from 'react';
import { useCommonModalContext } from './CommonModalProvider';
import styles from './commonModalOpenButton.module.scss';

type RenderButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
};

type CommonModalOpenButtonProps = {
  children?: React.ReactNode;
  isModalOpenable?: boolean;
  // モーダルを開けなかった時のメッセージ
  openFailMessage?: string;
  // render props でボタンをカスタマイズする関数
  renderButton?: (props: RenderButtonProps) => React.ReactNode;
  // ボタンに追加するクラス名
  buttonClassName?: string;
};

function CommonModalOpenButton({
  isModalOpenable = true,
  openFailMessage = 'モーダルを開けませんでした',
  children,
  renderButton,
  buttonClassName,
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
      {renderButton ? (
        renderButton({ onClick: openModalHandler, children })
      ) : (
        <button
          className={`${styles.button}${buttonClassName ? ` ${buttonClassName}` : ''}`}
          type="button"
          onClick={openModalHandler}
        >
          {children}
        </button>
      )}
      {failOpen && <p>{openFailMessage}</p>}
    </>
  );
}

export default CommonModalOpenButton;
