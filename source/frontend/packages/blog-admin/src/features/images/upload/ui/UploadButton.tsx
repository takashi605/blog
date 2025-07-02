import React from 'react';
import styles from './UploadButton.module.scss';
import containerStyles from './UploadButtonContainer.module.scss';

type UploadButtonProps = {
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<'button'>;

function UploadButton({
  loading = false,
  disabled = false,
  children,
  className,
  ...props
}: UploadButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <div className={containerStyles.container}>
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

export default UploadButton;
