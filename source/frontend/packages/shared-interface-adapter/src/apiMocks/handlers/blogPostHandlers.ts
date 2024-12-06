import type { DefaultBodyType, HttpHandler } from 'msw';
import { http, HttpResponse } from 'msw';
import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import { UUIDList } from 'shared-test-data';
import { blogPostResponseSchema } from '../../repositories/apiBlogPostRepository';
import { blogPostResponses } from './blogPostHandlerResponse';

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

    // 以下 get メソッドのモック
    http.get(`${baseUrl}/blog/posts/${UUIDList.UUID1}`, () => {
      return HttpResponse.json(
        blogPostResponses.find((post) => post.id === UUIDList.UUID1),
      );
    }),
    http.get(`${baseUrl}/blog/posts/${UUIDList.UUID2}`, () => {
      return HttpResponse.json(
        blogPostResponses.find((post) => post.id === UUIDList.UUID2),
      );
    }),
    http.get(`${baseUrl}/blog/posts/${UUIDList.UUID3}`, () => {
      return HttpResponse.json(
        blogPostResponses.find((post) => post.id === UUIDList.UUID3),
      );
    }),
    http.get(`${baseUrl}/blog/posts/top-tech-pick`, () => {
      return HttpResponse.json(
        blogPostResponses.find((post) => post.id === UUIDList.UUID1),
      );
    }),

    // TODO クエリパラメータの扱い方を適切なものにする
    // 参考：https://kentech.blog/blogs/rwxmz-1pd#h68697b834e
    http.get(`${baseUrl}/blog/posts/pickup?quantity=3`, () => {
      return HttpResponse.json(blogPostResponses);
    }),
    http.get(`${baseUrl}/blog/posts/latests`, () => {
      return HttpResponse.json(blogPostResponses);
    }),
  ];
  return blogPostHandlers;
};
