import { mockApiForServer } from '@/apiMock/serverForNode';
import { fetchBlogPost } from '@/components/models/blogPost/services/fetchBlogPost';

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
});
