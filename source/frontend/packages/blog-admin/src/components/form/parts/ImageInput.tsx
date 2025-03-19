import React, { forwardRef } from 'react';

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
    return (
      <div>
        <label htmlFor={id}>{label}</label>
        <input ref={ref} id={id} type="file" {...commonProps} />
      </div>
    );
  },
);

export default ImageInput;
