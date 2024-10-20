import { mockApiForServer } from '@/apiMock/serverForNode';
import { fetchBlogPost } from '@/components/models/blogPost/services/fetchBlogPost';
import { HttpError } from '@/components/models/error/httpError';

beforeAll(() => {
  mockApiForServer.listen();
});
afterEach(async () => {
  mockApiForServer.resetHandlers();
});
afterAll(() => {
  mockApiForServer.close();
});

describe('投稿記事を取得する', () => {
  it('ブログ記事構造に変換したデータから投稿日,最終更新日,記事タイトル,コンテンツが取得できる', async () => {
    const blogPostResponse = await fetchBlogPost(1);

    await expect(blogPostResponse.postDate).toMatch(/\d{4}\/\d{1,2}\/\d{1,2}/);
    await expect(blogPostResponse.lastUpdateDate).toMatch(
      /\d{4}\/\d{1,2}\/\d{1,2}/,
    );

    await expect(blogPostResponse.title).not.toBe('');
    await expect(blogPostResponse.contents.length).toBeGreaterThan(0);
  });

  it('404 エラーが返ってきた場合、エラーが throw される', async () => {
    try {
      await fetchBlogPost(1000);
    } catch (error) {
      expect(error instanceof HttpError).toBeTruthy();
      const httpError = error as HttpError;
      expect(httpError.message).toBe('記事データが存在しませんでした');
    }
  });
});
