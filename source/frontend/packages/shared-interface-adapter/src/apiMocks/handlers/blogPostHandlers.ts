import type { DefaultBodyType, HttpHandler } from 'msw';
import { http, HttpResponse } from 'msw';
import type { BlogPostDTO } from 'service/src/blogPostRepository/repositoryOutput/blogPostDTO';
import { blogPostResponseSchema } from '../../repositories/apiBlogPostRepository';

export const createdBlogPosts: BlogPostDTO[] = [];
export const clearCreatedBlogPosts = () => {
  createdBlogPosts.splice(0, createdBlogPosts.length);
};

export const createBlogPostHandlers = (baseUrl: string): HttpHandler[] => {
  const blogPostHandlers = [
    http.post(`${baseUrl}/posts`, async ({ request }) => {
      let newPost: DefaultBodyType;
      try {
        newPost = await request.json();
      } catch {
        return HttpResponse.json(
          { message: 'リクエストを json に変換できませんでした。' },
          { status: 400 },
        );
      }
      createdBlogPosts.push(blogPostResponseSchema.parse(newPost));
      return HttpResponse.json(newPost, { status: 200 });
    }),
  ];
  return blogPostHandlers;
};
