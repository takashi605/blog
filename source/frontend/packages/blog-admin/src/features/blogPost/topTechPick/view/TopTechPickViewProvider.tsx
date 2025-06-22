'use client';
import { createContext, useCallback, useContext, useState } from 'react';
import type { BlogPost } from 'shared-lib/src/api';

type TopTechPickPostViewState = {
  getTopTechPickPost: () => BlogPost | undefined;
  updateTopTechPickPost: (topTechPickPost: BlogPost | undefined) => void;
};

const TopTechPickPostViewContext =
  createContext<TopTechPickPostViewState | null>(null);

export default function TopTechPickPostViewProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [topTechPickPostView, setTopTechPickPostView] = useState<
    BlogPost | undefined
  >();
  const getTopTechPickPost = useCallback(() => {
    return topTechPickPostView;
  }, [topTechPickPostView]);
  const updateTopTechPickPost = useCallback(
    (topTechPickPost: BlogPost | undefined) => {
      setTopTechPickPostView(topTechPickPost);
    },
    [],
  );

  return (
    <TopTechPickPostViewContext.Provider
      value={{ getTopTechPickPost, updateTopTechPickPost }}
    >
      {children}
    </TopTechPickPostViewContext.Provider>
  );
}

// コンテキストを利用するためのカスタムフック
export const useTopTechPickPostViewContext = () => {
  const topTechPickPostViewState = useContext(TopTechPickPostViewContext);
  if (topTechPickPostViewState === null) {
    throw new Error(
      'useTopTechPickPostViewContext は TopTechPickPostViewProvider でラップされていなければ利用できません',
    );
  }
  return topTechPickPostViewState;
};
