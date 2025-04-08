import React from 'react'
import styles from './button.module.scss'

type ButtonPropsType = {
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}

export function ToolBarButton({
  onClick,
  disabled,
  children,
}: ButtonPropsType) {
  return (
    <button
      className={styles.button}
      role="button"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
