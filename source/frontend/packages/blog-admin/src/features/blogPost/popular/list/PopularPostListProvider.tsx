'use client';
import { createContext, useCallback, useContext, useState } from 'react';
import type { BlogPost } from 'shared-lib/src/api';

type PopularPostListState = {
  getAllPopularPosts: () => BlogPost[];
  updatePopularPosts: (PopularPosts: BlogPost[]) => void;
};

const PopularPostListContext = createContext<PopularPostListState | null>(null);

export default function PopularPostListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [popularPostList, setPopularPostList] = useState<BlogPost[]>([]);
  const getAllPopularPosts = useCallback(() => {
    return popularPostList;
  }, [popularPostList]);
  const updatePopularPosts = useCallback((PopularPosts: BlogPost[]) => {
    setPopularPostList(PopularPosts);
  }, []);

  return (
    <PopularPostListContext.Provider
      value={{ getAllPopularPosts, updatePopularPosts }}
    >
      {children}
    </PopularPostListContext.Provider>
  );
}

// コンテキストを利用するためのカスタムフック
export const usePopularPostListContext = () => {
  const popularPostListState = useContext(PopularPostListContext);
  if (popularPostListState === null) {
    throw new Error(
      'usePopularPostListContext は PopularPostListProvider でラップされていなければ利用できません',
    );
  }
  return popularPostListState;
};
