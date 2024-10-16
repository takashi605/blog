import {
  responseToViewBlogPost,
  type BlogPostResponse,
} from '@/components/models/blogPost/services/response';
import type { ViewBlogPostDTO } from '@/usecases/view/output';

export const fetchBlogPost = async (id: number): Promise<ViewBlogPostDTO> => {
  const response = await fetchRawBlogPost(id);
  return responseToViewBlogPost(response);
};

export const fetchRawBlogPost = async (
  id: number,
): Promise<BlogPostResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/blog/posts/${id}`,
  );
  return response.json();
};
