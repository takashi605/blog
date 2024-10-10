import type { BlogPostResponse } from '@/components/controllers/blogPost/services/response';

export const fetchBlogPost = async (id: number): Promise<BlogPostResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/blog/post/${id}`,
  );
  return response.json();
};
