import type { BlogPost } from 'entities/src/blogPost';
import { ContentType } from 'entities/src/blogPost/postContents/content';
import { ImageContent } from 'entities/src/blogPost/postContents/image';
import type { BlogPostRepository } from 'service/src/blogPostService/repository/blogPostRepository';
import type { BlogPostDTO } from 'service/src/blogPostService/repository/repositoryOutput/blogPostDTO';
import { z } from 'zod';
import { HttpError } from '../../error/httpError';

const contentSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal(ContentType.H2),
    id: z.string(),
    text: z.string(),
  }),
  z.object({
    type: z.literal(ContentType.H3),
    id: z.string(),
    text: z.string(),
  }),
  z.object({
    type: z.literal(ContentType.Paragraph),
    id: z.string(),
    text: z.string(),
  }),
  z.object({
    type: z.literal(ContentType.Image),
    id: z.string(),
    path: z.string(),
  }),
]);

export const blogPostResponseSchema: z.ZodType<BlogPostDTO> = z.object({
  id: z.string(),
  title: z.string(),
  thumbnail: z.object({
    path: z.string(),
  }),
  postDate: z.string(),
  lastUpdateDate: z.string(),
  contents: z.array(contentSchema),
});

export class ApiBlogPostRepository implements BlogPostRepository {
  private baseUrl: string;

  constructor(url: string) {
    this.baseUrl = url;
  }

  async save(blogPost: BlogPost): Promise<BlogPostDTO> {
    const body = this.blogPostToJson(blogPost);
    const response = await this.post(body);

    if (!response.ok) {
      const message = await response.text();
      throw new Error(
        `ブログ記事の保存に失敗しました:\n${message.replace(/\\n/g, '\n').replace(/\\"/g, '"')}`,
      );
    }

    const validatedResponse = blogPostResponseSchema.parse(
      await response.json(),
    );

    return validatedResponse;
  }

  async fetch(id: string): Promise<BlogPostDTO> {
    const response = await fetch(`${this.baseUrl}/blog/posts/${id}`);
    if (response.status === 404) {
      throw new HttpError('記事データが存在しませんでした', response.status);
    }

    const validatedResponse = blogPostResponseSchema.parse(
      await response.json(),
    );

    return validatedResponse;
  }

  async fetchLatests(): Promise<BlogPostDTO[]> {
    const response = await fetch(`${this.baseUrl}/blog/posts/latests`);
    const validatedResponse = z
      .array(blogPostResponseSchema)
      .parse(await response.json());

    const sortedResponse = validatedResponse.sort((a, b) => {
      return new Date(a.postDate).getTime() - new Date(b.postDate).getTime();
    });

    return sortedResponse;
  }

  private async post(blogPostJson: string): Promise<Response> {
    const response = await fetch(`${this.baseUrl}/posts`, {
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
      id: blogPost.getId(),
      title: blogPost.getTitleText(),
      thumbnail: {
        path: blogPost.getThumbnail().getPath(),
      },
      postDate: blogPost.getPostDate().toISOString().split('T')[0],
      lastUpdateDate: blogPost.getLastUpdateDate().toISOString().split('T')[0],
      contents: blogPost.getContents().map((content) => {
        // TODO: ここで instanceof を使っているのは役割が集中して良くないので、
        // ストラテジークラスなどを使って責務を分離する
        if (content instanceof ImageContent) {
          return {
            id: content.getId(),
            type: 'image',
            text: content.getPath(),
          };
        }
        return {
          id: content.getId(),
          type: content.getType(),
          text: content.getValue(),
        };
      }),
    });
  }
}
