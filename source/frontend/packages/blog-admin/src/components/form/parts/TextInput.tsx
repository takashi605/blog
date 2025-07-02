import React, { forwardRef } from 'react';
import styles from './TextInput.module.scss';

type BaseProps = {
  id: string;
  label: string;
};

type InputProps = Omit<
  React.ComponentPropsWithoutRef<'input'>,
  keyof BaseProps
>;

type TextInputProps = {
  id: string;
  label: string;
  error?: string;
} & InputProps;

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInputBase({ id, label, error, ...commonProps }, ref) {
    const hasError = !!error;

    return (
      <div className={styles.container}>
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          type="text"
          className={`${styles.input} ${hasError ? styles.inputError : ''}`}
          {...commonProps}
        />
        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>
    );
  },
);

export default React.memo(TextInput);
