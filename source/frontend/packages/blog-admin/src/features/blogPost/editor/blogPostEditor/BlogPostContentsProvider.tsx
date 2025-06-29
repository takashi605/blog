'use client';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useContext, useState } from 'react';
import type { BlogPostContent } from 'shared-lib/src/api';

type BlogPostContentsState = {
  blogPostContents: BlogPostContent[];
  setBlogPostContents: Dispatch<SetStateAction<BlogPostContent[]>>;
};

type BlogPostContentsProviderProps = {
  children: ReactNode;
  initialContents?: BlogPostContent[];
};

const BlogPostContentsContext = createContext<BlogPostContentsState | null>(
  null,
);

export function BlogPostContentsProvider({
  children,
  initialContents = [],
}: BlogPostContentsProviderProps) {
  const [blogPostContents, setBlogPostContents] =
    useState<BlogPostContent[]>(initialContents);

  return (
    <BlogPostContentsContext.Provider
      value={{ blogPostContents, setBlogPostContents }}
    >
      {children}
    </BlogPostContentsContext.Provider>
  );
}

/**
 * BlogPostContentsのコンテキストにアクセスするためのカスタムフック
 * useContextのラッパーとして機能
 */
export const useBlogPostContentsContext = () => {
  const contentsState = useContext(BlogPostContentsContext);
  if (contentsState === null) {
    throw new Error(
      'useBlogPostContentsContext は BlogPostContentsProvider でラップされていなければ利用できません',
    );
  }
  return contentsState;
};
