import React, { forwardRef, useState } from 'react';
import styles from './ImageInput.module.scss';

type BaseProps = {
  id: string;
  label: string;
};

type InputProps = Omit<
  React.ComponentPropsWithoutRef<'input'>,
  keyof BaseProps
>;

type ImageInputProps = {
  id: string;
  label: string;
} & InputProps;

const ImageInput = forwardRef<HTMLInputElement, ImageInputProps>(
  function ImageInputBase({ id, label, ...commonProps }, ref) {
    const [fileName, setFileName] = useState<string>('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      setFileName(file ? file.name : '');
      
      // 親コンポーネントのonChangeも呼び出す
      if (commonProps.onChange) {
        commonProps.onChange(event);
      }
    };

    const hasFile = fileName !== '';

    return (
      <div className={styles.container}>
        <div className={styles.inputWrapper}>
          <input
            ref={ref}
            id={id}
            type="file"
            accept="image/*"
            className={styles.input}
            {...commonProps}
            onChange={handleFileChange}
          />
          <label
            htmlFor={id}
            className={`${styles.button} ${hasFile ? styles.hasFile : ''}`}
          >
            <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
            <span className={styles.text}>
              {hasFile ? `${label}を変更` : label}
            </span>
          </label>
        </div>
        {fileName && (
          <div className={styles.fileName}>
            選択されたファイル: {fileName}
          </div>
        )}
      </div>
    );
  },
);

export default ImageInput;
