import { memo } from 'react';
import type { ButtonProps } from './types';

function Button({ children, onClick: handleClick, name }: ButtonProps) {
  return (
    <button id="add" onClick={handleClick} name={name} aria-label={name}>
      {children}
    </button>
  );
}

export default memo(Button);
