import type { BlogPostRepository } from '@/usecases/create/createBlogPost';

type BlogPostResponse = {
  title: string;
  postDate: string;
  lastUpdateDate: string;
  contents: { type: string; text: string }[];
}

export class ApiBlogPostRepository implements BlogPostRepository {
  async save(blogPost: string): Promise<BlogPostResponse> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: blogPost,
    });

    if (!response.ok) {
      throw new Error('ブログ記事の保存に失敗しました');
    }

    return response.json();
  }
}
