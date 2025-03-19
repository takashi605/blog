import React, { forwardRef } from 'react';

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
} & InputProps;

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInputBase({ id, label, ...commonProps }, ref) {
    return (
      <div>
        <label htmlFor={id}>{label}</label>
        <input ref={ref} id={id} type="text" {...commonProps} />
      </div>
    );
  },
);

export default React.memo(TextInput);
