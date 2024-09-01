import { memo } from 'react';
import type { ButtonProps } from './types';

function Button({ children, onClick: handleClick }: ButtonProps) {
  return (
    <button id="add" onClick={handleClick}>
      {children}
    </button>
  );
}

export default memo(Button);
