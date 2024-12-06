import type { DefaultBodyType, HttpHandler } from 'msw';
import { http, HttpResponse } from 'msw';
import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import { UUIDList } from 'shared-test-data';
import { blogPostResponseSchema } from '../../repositories/apiBlogPostRepository';
import {
  blogPostResponses,
  pickupBlogPostResponses,
} from './blogPostHandlerResponse';

export const createdBlogPosts: BlogPostDTO[] = [];
export const clearCreatedBlogPosts = () => {
  createdBlogPosts.splice(0, createdBlogPosts.length);
};

export const createBlogPostHandlers = (baseUrl: string): HttpHandler[] => {
  const blogPostHandlers = [
    // 以下 post メソッドのモック
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

    http.get(`${baseUrl}/blog/posts/top-tech-pick`, () => {
      return HttpResponse.json(
        blogPostResponses.find((post) => post.id === UUIDList.UUID1),
      );
    }),
    // クエリパラメータの扱い方の参考：https://kentech.blog/blogs/rwxmz-1pd#h68697b834e
    http.get(`${baseUrl}/blog/posts/pickup?quantity=3`, ({ request }) => {
      const url = new URL(request.url);
      const quantity = url.searchParams.get('quantity');
      if (!quantity) {
        return HttpResponse.json(pickupBlogPostResponses);
      }
      const blogPosts = pickupBlogPostResponses.slice(0, Number(quantity));
      return HttpResponse.json(blogPosts);
    }),
    http.get(`${baseUrl}/blog/posts/latests`, () => {
      const sortedBlogPosts = blogPostResponses.sort((a, b) => {
        return new Date(b.postDate).getTime() - new Date(a.postDate).getTime();
      });
      const filteredBlogPosts = sortedBlogPosts.filter((blogPost) => {
        return blogPost.postDate !== '' && blogPost.lastUpdateDate != '';
      });
      return HttpResponse.json(filteredBlogPosts);
    }),
    http.get(`${baseUrl}/blog/posts/:userId`, ({ params }) => {
      const userId = params.userId?.toString();
      const blogPost = blogPostResponses.find((post) => post.id === userId);
      if (blogPost === undefined) {
        return new HttpResponse('Not found', {
          status: 404,
        });
      }
      return HttpResponse.json(blogPost);
    }),
  ];
  return blogPostHandlers;
};
