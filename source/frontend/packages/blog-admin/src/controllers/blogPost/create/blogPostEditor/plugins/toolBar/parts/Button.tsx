import React from 'react';
import styles from './button.module.scss';

type ButtonPropsType = {
  onClick: () => void;
  checked?: boolean;
  children: React.ReactNode;
};

export function ToolBarButton({
  onClick,
  checked: disabled,
  children,
}: ButtonPropsType) {
  return (
    <button
      className={styles.button}
      onClick={onClick}
      // disabled={disabled}
      type="button"
      role="checkbox"
      aria-checked={disabled}
    >
      {children}
    </button>
  );
}
