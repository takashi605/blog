'use client';
import { createContext, useCallback, useContext, useState } from 'react';
import type { BlogPost } from 'shared-lib/src/api';

type PickUpPostListState = {
  getAllPickUpPosts: () => BlogPost[];
  updatePickUpPosts: (PickUpPosts: BlogPost[]) => void;
};

const PickUpPostListContext = createContext<PickUpPostListState | null>(null);

export default function PickUpPostListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pickUpPostList, setPickUpPostList] = useState<BlogPost[]>([]);
  const getAllPickUpPosts = useCallback(() => {
    return pickUpPostList;
  }, [pickUpPostList]);
  const updatePickUpPosts = useCallback((PickUpPosts: BlogPost[]) => {
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
