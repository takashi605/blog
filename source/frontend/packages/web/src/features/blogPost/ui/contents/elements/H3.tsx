import { memo } from 'react';
import type { ContentElementProps } from './type';

export function H3({ children }: ContentElementProps) {
  return <h3>{children}</h3>;
}

export default memo(H3);
