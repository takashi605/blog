import type { BlogPost } from 'entities/src/blogPost';
import { ImageContent } from 'entities/src/blogPost/postContents/image';
import type { BlogPostRepository } from 'service/src/blogPostRepository';
import type { BlogPostDTO } from 'service/src/blogPostRepository/repositoryOutput/blogPostDTO';
import { z } from 'zod';

export const blogPostResponseSchema: z.ZodType<BlogPostDTO> = z.object({
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

export class ApiBlogPostRepository implements BlogPostRepository {
  async save(blogPost: BlogPost): Promise<BlogPostDTO> {
    const body = this.blogPostToJson(blogPost);
    const response = await this.post(body);

    if (!response.ok) {
      throw new Error('ブログ記事の保存に失敗しました');
    }

    const validatedResponse = blogPostResponseSchema.parse(
      await response.json(),
    );

    return validatedResponse;
  }

  private async post(blogPostJson: string): Promise<Response> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: blogPostJson,
    });
    return response;
  }

  private blogPostToJson(blogPost: BlogPost): string {
    return JSON.stringify({
      title: blogPost.getTitleText(),
      postDate: blogPost.getPostDate().toISOString().split('T')[0],
      lastUpdateDate: blogPost.getLastUpdateDate().toISOString().split('T')[0],
      contents: blogPost.getContents().map((content) => {
        // TODO: ここで instanceof を使っているのは役割が集中して良くないので、
        // ストラテジークラスなどを使って責務を分離する
        if (content instanceof ImageContent) {
          return {
            type: 'image',
            text: content.getPath(),
          };
        }
        return {
          type: content.getType(),
          text: content.getValue(),
        };
      }),
    });
  }
}
