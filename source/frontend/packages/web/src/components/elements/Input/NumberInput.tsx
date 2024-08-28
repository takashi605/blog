import { memo } from 'react';
import type { InputProps } from './types';

function NumberInput({ value, onChange, name }: InputProps) {
  return (
    <input
      name={name}
      type="number"
      value={value}
      onChange={onChange}
      aria-label={name}
    />
  );
}

export default memo(NumberInput);
