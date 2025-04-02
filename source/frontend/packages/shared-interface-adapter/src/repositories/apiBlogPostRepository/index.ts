import type { BlogPost } from 'entities/src/blogPost';
import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import type { BlogPostRepository } from 'service/src/blogPostService/repository/blogPostRepository';
import { z } from 'zod';
import { HttpError } from '../../error/httpError';
import { blogPostResponseSchema } from './jsonMapper/blogPostSchema';
import { blogPostsToJson, blogPostToJson } from './jsonMapper/blogPostToJson';

export class ApiBlogPostRepository implements BlogPostRepository {
  private baseUrl: string;
  private baseFetchOptions = {
    mode: 'cors' as const,
    headers: {
      Authorization: `${process.env.NEXT_PUBLIC_BASIC_AUTHENTICATION}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 },
    cache: 'no-store',
  };

  constructor(url: string) {
    this.baseUrl = url;
  }

  async save(blogPost: BlogPost): Promise<BlogPostDTO> {
    const body = blogPostToJson(blogPost);
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
    const response = await fetch(
      `${this.baseUrl}/blog/posts/${id}`,
      this.baseFetchOptions,
    );
    if (response.status === 404) {
      throw new HttpError('記事データが存在しませんでした', response.status);
    }

    const validatedResponse = blogPostResponseSchema.parse(
      await response.json(),
    );

    return validatedResponse;
  }

  async fetchLatests(quantity?: number | undefined): Promise<BlogPostDTO[]> {
    const queryParam = quantity ? `?quantity=${quantity}` : '';
    const response = await fetch(
      `${this.baseUrl}/blog/posts/latest${queryParam}`,
      this.baseFetchOptions,
    );
    const validatedResponse = z
      .array(blogPostResponseSchema)
      .parse(await response.json());

    const sortedResponse = validatedResponse.sort((a, b) => {
      return new Date(a.postDate).getTime() - new Date(b.postDate).getTime();
    });

    return sortedResponse;
  }

  async fetchTopTechPick(): Promise<BlogPostDTO> {
    const response = await fetch(
      `${this.baseUrl}/blog/posts/top-tech-pick`,
      this.baseFetchOptions,
    );
    const validatedResponse = blogPostResponseSchema.parse(
      await response.json(),
    );

    return validatedResponse;
  }

  async fetchPickUpPosts(quantity: number): Promise<BlogPostDTO[]> {
    const response = await fetch(
      `${this.baseUrl}/blog/posts/pickup?quantity=${quantity}`,
      this.baseFetchOptions,
    );
    const validatedResponse = z
      .array(blogPostResponseSchema)
      .parse(await response.json());

    return validatedResponse;
  }

  async updatePickUpPosts(pickupPosts: BlogPost[]): Promise<BlogPostDTO[]> {
    if (pickupPosts.length !== 3) {
      throw new Error('ピックアップ記事は3件指定してください');
    }
    const body = blogPostsToJson(pickupPosts);
    const response = await fetch(`${this.baseUrl}/blog/posts/pickup`, {
      method: 'PUT',
      body,
      ...this.baseFetchOptions,
    });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(
        `ピックアップ記事の更新に失敗しました:\n${message.replace(/\\n/g, '\n').replace(/\\"/g, '"')}`,
      );
    }
    const validatedResponse = z
      .array(blogPostResponseSchema)
      .parse(await response.json());
    return validatedResponse;
  }

  async fetchPopularPosts(
    quantity?: number | undefined,
  ): Promise<BlogPostDTO[]> {
    const queryParam = quantity ? `?quantity=${quantity}` : '';
    const response = await fetch(
      `${this.baseUrl}/blog/posts/popular${queryParam}`,
      this.baseFetchOptions,
    );
    const validatedResponse = z
      .array(blogPostResponseSchema)
      .parse(await response.json());

    return validatedResponse;
  }

  async updatePopularPosts(popularPosts: BlogPost[]): Promise<BlogPostDTO[]> {
    if (popularPosts.length !== 3) {
      throw new Error('人気記事は3件指定してください');
    }
    const body = blogPostsToJson(popularPosts);
    const response = await fetch(`${this.baseUrl}/blog/posts/popular`, {
      method: 'PUT',
      body,
      ...this.baseFetchOptions,
    });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(
        `人気記事の更新に失敗しました:\n${message.replace(/\\n/g, '\n').replace(/\\"/g, '"')}`,
      );
    }
    const validatedResponse = z
      .array(blogPostResponseSchema)
      .parse(await response.json());
    return validatedResponse;
  }

  // TODO 引数で url を受け取れるようにする
  private async post(blogPostJson: string): Promise<Response> {
    const response = await fetch(`${this.baseUrl}/blog/posts`, {
      method: 'POST',
      body: blogPostJson,
      ...this.baseFetchOptions,
    });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(
        `ブログ記事の保存に失敗しました:\n${message.replace(/\\n/g, '\n').replace(/\\"/g, '"')}`,
      );
    }
    return response;
  }
}
