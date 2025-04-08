import React from 'react';
import styles from './button.module.scss';

type ButtonPropsType = {
  onClick: () => void;
  checked?: boolean;
  children: React.ReactNode;
  ariaLabel: string;
};

export function ToolBarButton({
  onClick,
  checked: disabled,
  children,
  ariaLabel
}: ButtonPropsType) {
  return (
    <button
      className={styles.button}
      onClick={onClick}
      // disabled={disabled}
      type="button"
      role="checkbox"
      aria-checked={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
