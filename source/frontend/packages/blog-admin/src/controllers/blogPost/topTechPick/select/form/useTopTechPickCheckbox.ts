import { useCallback } from 'react';
import { useBlogPostList } from '../../../list/useBlogPostList';

export function useTopTechPickPostsCheckbox() {
  const { getAllBlogPosts } = useBlogPostList();

  // 選択した記事 ID を元に、記事データをフィルタリング
  const findSelectedBlogPosts = useCallback(
    (selectedIds: string[]) =>
      getAllBlogPosts().filter((blogPost) => selectedIds.includes(blogPost.id)),
    [getAllBlogPosts],
  );

  return { findSelectedBlogPosts };
}
