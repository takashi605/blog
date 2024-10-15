import { mockApiForServer } from '@/apiMock/serverForNode';
import {
  fetchBlogPost,
  fetchRawBlogPost,
} from '@/components/models/blogPost/services/fetchBlogPost';
import { responseToViewBlogPost } from '@/components/models/blogPost/services/response';

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

  // 以下は詳細な変換処理のテストであり、取得処理の振る舞いの理解としては上記のテストで十分
  it('レスポンスをブログ記事の構造に変換できる', async () => {
    const BlogPostResponse = await fetchRawBlogPost(1);

    const blogPost = responseToViewBlogPost(BlogPostResponse);

    expect(blogPost.title).toBe(BlogPostResponse.title);

    if (
      blogPost.contents.length === 0 ||
      BlogPostResponse.contents.length === 0
    ) {
      throw new Error(
        '投稿記事のテストデータにコンテンツが存在内ため正しくテストできません',
      );
    }

    expect(blogPost.contents.length).toBe(BlogPostResponse.contents.length);

    blogPost.contents.forEach((content, index) => {
      expect(content.id).toBe(index + 1);
      expect(content.value).toBe(BlogPostResponse.contents[index].value);
      expect(content.type).toBe(BlogPostResponse.contents[index].type);
    });
  });
});
