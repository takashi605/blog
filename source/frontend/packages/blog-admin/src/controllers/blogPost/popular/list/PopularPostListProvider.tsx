'use client';
import { createContext, useCallback, useContext, useState } from 'react';
import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';

type PopularPostListState = {
  getAllPopularPosts: () => BlogPostDTO[];
  updatePopularPosts: (PopularPosts: BlogPostDTO[]) => void;
};

const PopularPostListContext = createContext<PopularPostListState | null>(null);

export default function PopularPostListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [popularPostList, setPopularPostList] = useState<BlogPostDTO[]>([]);
  const getAllPopularPosts = useCallback(() => {
    return popularPostList;
  }, [popularPostList]);
  const updatePopularPosts = useCallback((PopularPosts: BlogPostDTO[]) => {
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
