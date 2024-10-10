import { fetchBlogPost } from '@/components/controllers/blogPost/services/fetchBlogPost';
import { useState } from 'react';

export const useViewBlogPostController = () => {
  const [title, setTitle] = useState('');
  const execFetch = async () => {
    const blogPost = await fetchBlogPost(1);
    setTitle(blogPost.title);
  };
  execFetch();
  return { title };
};
