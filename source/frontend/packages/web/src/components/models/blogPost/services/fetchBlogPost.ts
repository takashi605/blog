import {
  responseToViewBlogPost,
  type BlogPostResponse,
} from '@/components/models/blogPost/services/response';
import { HttpError } from '@/components/models/error/httpError';
import type { ViewBlogPostDTO } from '@/usecases/view/output/dto/index';

export const fetchBlogPost = async (id: number): Promise<ViewBlogPostDTO> => {
  const response = await fetchRawBlogPost(id);
  return responseToViewBlogPost(response);
};

const fetchRawBlogPost = async (id: number): Promise<BlogPostResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/blog/posts/${id}`,
  );
  if (response.status === 404) {
    throw new HttpError('記事データが存在しませんでした', response.status);
  }
  return response.json();
};
