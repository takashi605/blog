import React from 'react';
import styles from './CommonModalSubmitButton.module.scss';

type CommonModalSubmitButtonProps = {
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<'button'>;

function CommonModalSubmitButton({
  loading = false,
  disabled = false,
  children,
  className,
  ...props
}: CommonModalSubmitButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <div className={styles.container}>
      <button
        type="submit"
        disabled={isDisabled}
        className={`${styles.button} ${loading ? styles.loading : ''} ${className || ''}`}
        {...props}
      >
        {children}
      </button>
    </div>
  );
}

export default CommonModalSubmitButton;
