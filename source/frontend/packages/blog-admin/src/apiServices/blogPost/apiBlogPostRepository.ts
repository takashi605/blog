import type { BlogPostRepository } from '@/usecases/create/createBlogPost';
import type { BlogPost } from 'entities/src/blogPost';
import { z } from 'zod';

const blogPostResponseSchema = z.object({
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

type BlogPostResponse = z.infer<typeof blogPostResponseSchema>;

export class ApiBlogPostRepository implements BlogPostRepository {
  async save(blogPost: BlogPost): Promise<BlogPostResponse> {
    const response = await post(blogPostToJson(blogPost));

    if (!response.ok) {
      throw new Error('ブログ記事の保存に失敗しました');
    }

    const validatedResponse = blogPostResponseSchema.parse(await response.json());

    return validatedResponse;
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

function blogPostToJson(blogPost: BlogPost): string {
  return JSON.stringify({
    title: blogPost.getTitleText(),
    postDate: blogPost.getPostDate().toISOString().split('T')[0],
    lastUpdateDate: blogPost.getLastUpdateDate().toISOString().split('T')[0],
    contents: blogPost.getContents().map((content) => {
      return {
        type: content.getType(),
        text: content.getValue(),
      };
    }),
  });
}
