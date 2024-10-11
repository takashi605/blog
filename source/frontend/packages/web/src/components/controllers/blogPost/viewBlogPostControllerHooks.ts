import { fetchBlogPost } from '@/components/controllers/blogPost/services/fetchBlogPost';
import type { ViewBlogPost } from '@/usecases/view/output';
import { useCallback, useEffect, useState } from 'react';

export const useViewBlogPostController = (blogPostId: number) => {
  const [blogPost, setBlogPost] = useState<ViewBlogPost | null>(null);
  const execFetch = useCallback(async () => {
    const blogPost = await fetchBlogPost(blogPostId);
    setBlogPost(blogPost);
  }, [blogPostId]);

  useEffect(() => {
    execFetch();
  }, [execFetch]);
  return {
    title: blogPost?.title ?? '',
    contents: blogPost?.contents ?? [],
  };
};
