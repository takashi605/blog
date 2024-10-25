import type { BlogPostRepository } from '@/usecases/create/createBlogPost';
import { z } from 'zod';

const BlogPostResponseSchema = z.object({
  title: z.string(),
  postDate: z.string(),
  lastUpdateDate: z.string(),
  contents: z.array(
    z.object({
      type: z.string(),
      text: z.string(),
    }),
  ),
});

type BlogPostResponse = z.infer<typeof BlogPostResponseSchema>;

export class ApiBlogPostRepository implements BlogPostRepository {
  async save(blogPostJson: string): Promise<BlogPostResponse> {
    const response = await post(blogPostJson);

    if (!response.ok) {
      throw new Error('ブログ記事の保存に失敗しました');
    }

    return response.json();
  }
}

async function post(blogPostJson: string): Promise<Response> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: blogPostJson,
  });
  return response;
}
