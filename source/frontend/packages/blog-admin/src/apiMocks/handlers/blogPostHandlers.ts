import { blogPostResponseSchema } from '@/apiServices/blogPost/apiBlogPostRepository';
import { http, HttpResponse } from 'msw';
import type { BlogPostDTO } from 'service/src/blogPostRepository';

export const createdBlogPosts: BlogPostDTO[] = [];
export const clearCreatedBlogPosts = () => {
  createdBlogPosts.splice(0, createdBlogPosts.length);
};

export const blogPostHandlers = [
  http.post(`${process.env.NEXT_PUBLIC_API_URL}/posts`, async ({ request }) => {
    const newPost = await request.json();
    createdBlogPosts.push(blogPostResponseSchema.parse(newPost));

    return HttpResponse.json(newPost, { status: 200 });
  }),
];
