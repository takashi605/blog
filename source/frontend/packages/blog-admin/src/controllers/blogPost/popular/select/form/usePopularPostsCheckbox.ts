import { useCallback } from 'react';
import { useBlogPostList } from '../../../list/useBlogPostList';

export function usePopularPostsCheckbox() {
  const { getAllBlogPosts } = useBlogPostList();

  // 選択した記事 ID を元に、記事データをフィルタリング
  const selectedBlogPosts = useCallback(
    (selectedIds: string[]) =>
      getAllBlogPosts().filter((blogPost) => selectedIds.includes(blogPost.id)),
    [getAllBlogPosts],
  );

  return { selectedBlogPosts };
}
