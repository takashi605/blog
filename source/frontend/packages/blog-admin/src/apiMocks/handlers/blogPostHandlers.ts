import { blogPostResponseSchema } from '@/apiServices/blogPost/apiBlogPostRepository';
import type { DefaultBodyType } from 'msw';
import { http, HttpResponse } from 'msw';
import type { BlogPostDTO } from 'service/src/blogPostRepository/repositoryOutput/blogPostDTO';

export const createdBlogPosts: BlogPostDTO[] = [];
export const clearCreatedBlogPosts = () => {
  createdBlogPosts.splice(0, createdBlogPosts.length);
};

export const blogPostHandlers = [
  http.post(`${process.env.NEXT_PUBLIC_API_URL}/posts`, async ({ request }) => {
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
