'use client';
import { createContext, useCallback, useContext, useState } from 'react';
import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';

type PickUpPostListState = {
  getAllPickUpPosts: () => BlogPostDTO[];
  updatePickUpPosts: (PickUpPosts: BlogPostDTO[]) => void;
};

const PickUpPostListContext = createContext<PickUpPostListState | null>(null);

export default function PickUpPostListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pickUpPostList, setPickUpPostList] = useState<BlogPostDTO[]>([]);
  const getAllPickUpPosts = useCallback(() => {
    return pickUpPostList;
  }, [pickUpPostList]);
  const updatePickUpPosts = useCallback((PickUpPosts: BlogPostDTO[]) => {
    setPickUpPostList(PickUpPosts);
  }, []);

  return (
    <PickUpPostListContext.Provider
      value={{ getAllPickUpPosts, updatePickUpPosts }}
    >
      {children}
    </PickUpPostListContext.Provider>
  );
}

// コンテキストを利用するためのカスタムフック
export const usePickUpPostListContext = () => {
  const pickUpPostListState = useContext(PickUpPostListContext);
  if (pickUpPostListState === null) {
    throw new Error(
      'usePickUpPostListContext は PickUpPostListProvider でラップされていなければ利用できません',
    );
  }
  return pickUpPostListState;
};
