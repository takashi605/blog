import type { DefaultBodyType, HttpHandler } from 'msw';
import { http, HttpResponse } from 'msw';
import { UUIDList } from 'shared-test-data';
import type { BlogPost } from '../../../api/types';
import {
  blogPostResponses,
  pickupBlogPostResponses,
  popularBlogPostResponses,
} from './blogPostHandlerResponse';

export const createdBlogPosts: BlogPost[] = [];
export const clearCreatedBlogPosts = () => {
  createdBlogPosts.splice(0, createdBlogPosts.length);
};

export const createBlogPostHandlers = (baseUrl: string): HttpHandler[] => {
  const blogPostHandlers = [
    http.get(`${baseUrl}/blog/posts/latest`, ({ request }) => {
      const sortedBlogPosts = blogPostResponses.sort((a, b) => {
        return new Date(b.postDate).getTime() - new Date(a.postDate).getTime();
      });
      const filteredBlogPosts = sortedBlogPosts.filter((blogPost) => {
        return blogPost.postDate !== '' && blogPost.lastUpdateDate != '';
      });

      const url = new URL(request.url);
      const quantity = url.searchParams.get('quantity');
      if (quantity) {
        return HttpResponse.json(filteredBlogPosts.slice(0, Number(quantity)));
      }
      return HttpResponse.json(filteredBlogPosts);
    }),
    http.get(`${baseUrl}/blog/posts/top-tech-pick`, () => {
      return HttpResponse.json(
        blogPostResponses.find((post) => post.id === UUIDList.UUID1),
      );
    }),
    // クエリパラメータの扱い方の参考：https://kentech.blog/blogs/rwxmz-1pd#h68697b834e
    http.get(`${baseUrl}/blog/posts/pickup`, ({ request }) => {
      const url = new URL(request.url);
      const quantity = url.searchParams.get('quantity');
      if (!quantity) {
        return HttpResponse.json(pickupBlogPostResponses);
      }
      const blogPosts = pickupBlogPostResponses.slice(0, Number(quantity));
      return HttpResponse.json(blogPosts);
    }),
    http.get(`${baseUrl}/blog/posts/popular`, ({ request }) => {
      const url = new URL(request.url);
      const quantity = url.searchParams.get('quantity');
      if (!quantity) {
        return HttpResponse.json(popularBlogPostResponses);
      }
      const blogPosts = popularBlogPostResponses.slice(0, Number(quantity));
      return HttpResponse.json(blogPosts);
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
    http.post(`${baseUrl}/admin/blog/posts`, async ({ request }) => {
      let newPost: DefaultBodyType;
      try {
        newPost = await request.json();
      } catch {
        return HttpResponse.json(
          { message: 'リクエストを json に変換できませんでした。' },
          { status: 400 },
        );
      }
      createdBlogPosts.push(newPost as BlogPost);
      return HttpResponse.json(newPost, { status: 200 });
    }),
    http.put(
      `${baseUrl}/admin/blog/posts/top-tech-pick`,
      async ({ request }) => {
        let updatedPost: DefaultBodyType;
        try {
          updatedPost = await request.json();
        } catch {
          return HttpResponse.json(
            { message: 'リクエストを json に変換できませんでした。' },
            { status: 400 },
          );
        }

        return HttpResponse.json(updatedPost, { status: 200 });
      },
    ),
    http.put(`${baseUrl}/admin/blog/posts/pickup`, async ({ request }) => {
      let updatedPosts: DefaultBodyType;
      try {
        updatedPosts = await request.json();
      } catch {
        return HttpResponse.json(
          { message: 'リクエストを json に変換できませんでした。' },
          { status: 400 },
        );
      }

      // pickupBlogPostResponses の内容を更新すべきだが、上手くいかなかったので省略している
      // 基本的には更新後のものを参照することはないので、このままでも問題ないと思われる

      return HttpResponse.json(updatedPosts, { status: 200 });
    }),
    http.put(`${baseUrl}/admin/blog/posts/popular`, async ({ request }) => {
      let updatedPosts: DefaultBodyType;
      try {
        updatedPosts = await request.json();
      } catch {
        return HttpResponse.json(
          { message: 'リクエストを json に変換できませんでした。' },
          { status: 400 },
        );
      }

      // popularBlogPostResponses の内容を更新すべきだが、上手くいかなかったので省略している
      // 基本的には更新後のものを参照することはないので、このままでも問題ないと思われる
      return HttpResponse.json(updatedPosts, { status: 200 });
    }),
  ];
  return blogPostHandlers;
};
