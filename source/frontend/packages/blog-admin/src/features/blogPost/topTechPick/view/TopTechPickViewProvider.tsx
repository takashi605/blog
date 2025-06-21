'use client';
import { createContext, useCallback, useContext, useState } from 'react';
import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';

type TopTechPickPostViewState = {
  getTopTechPickPost: () => BlogPostDTO | undefined;
  updateTopTechPickPost: (topTechPickPost: BlogPostDTO) => void;
};

const TopTechPickPostViewContext =
  createContext<TopTechPickPostViewState | null>(null);

export default function TopTechPickPostViewProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [topTechPickPostView, setTopTechPickPostView] = useState<BlogPostDTO>();
  const getTopTechPickPost = useCallback(() => {
    return topTechPickPostView;
  }, [topTechPickPostView]);
  const updateTopTechPickPost = useCallback((topTechPickPost: BlogPostDTO) => {
    setTopTechPickPostView(topTechPickPost);
  }, []);

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
