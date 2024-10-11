import { fetchBlogPost } from '@/components/controllers/blogPost/services/fetchBlogPost';
import type { ViewBlogPost } from '@/usecases/view/output';
import { useState } from 'react';

export const useViewBlogPostController = () => {
  const [blogPost, setBlogPost] = useState<ViewBlogPost | null>(null);
  const execFetch = async () => {
    const blogPost = await fetchBlogPost(1);
    setBlogPost(blogPost);
  };
  execFetch();
  return { title: blogPost?.title ?? '' };
};
