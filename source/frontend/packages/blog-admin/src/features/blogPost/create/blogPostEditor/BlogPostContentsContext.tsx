import type { Dispatch, SetStateAction } from 'react';
import { createContext } from 'react';
import type { BlogPostContent } from 'shared-lib/src/api';

export const BlogPostContentsSetterContext = createContext<
  Dispatch<SetStateAction<BlogPostContent[]>>
>(() => {
  throw new Error('BlogPostContentsSetterContext の設定が完了していません');
});
