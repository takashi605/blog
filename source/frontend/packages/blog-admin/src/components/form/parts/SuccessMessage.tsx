import React, { useEffect } from 'react';
import styles from './SuccessMessage.module.scss';

type SuccessMessageProps = {
  message: string;
  isVisible: boolean;
  onHide: () => void;
  autoHideDuration?: number;
};

function SuccessMessage({
  message,
  isVisible,
  onHide,
  autoHideDuration = 2000,
}: SuccessMessageProps) {
  const [isFadingOut, setIsFadingOut] = React.useState(false);

  // 成功メッセージを指定時間後にフェードアウトアニメーションで非表示にする
  useEffect(() => {
    if (isVisible) {
      const fadeOutTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, autoHideDuration);

      return () => clearTimeout(fadeOutTimer);
    } else {
      setIsFadingOut(false);
    }
  }, [isVisible, autoHideDuration]);

  // フェードアウトアニメーション完了後にステートをリセット
  useEffect(() => {
    if (isFadingOut) {
      const hideTimer = setTimeout(() => {
        onHide();
        setIsFadingOut(false);
      }, 500); // アニメーション時間と同じ

      return () => clearTimeout(hideTimer);
    }
  }, [isFadingOut, onHide]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`${styles.successMessage} ${isFadingOut ? styles.fadeOut : ''}`}
    >
      {message}
    </div>
  );
}

export default SuccessMessage;
