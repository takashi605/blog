import { memo } from 'react';
import type { ContentElementProps } from './type';

export function H2({ children }: ContentElementProps) {
  return <h2>{children}</h2>;
}

export default memo(H2);
