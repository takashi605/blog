import { server } from '@/apiMock/server';
import { fetchBlogPost } from '@/components/controllers/blogPost/services/fetchBlogPost';
import { mapResponseContentToBlogPost } from '@/components/controllers/blogPost/services/response';
import { createViewBlogPostInput } from '@/usecases/view/input/input';
import { viewBlogPost } from '@/usecases/view/viewBlogPost';

beforeAll(() => {
  server.listen();
});
afterEach(async () => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

describe('投稿記事を取得する', () => {
  it('レスポンスからid, 記事タイトル,コンテンツが取得できる', async () => {
    const blogPostResponse = await fetchBlogPost(1);

    expect(blogPostResponse).toHaveProperty('id');
    expect(blogPostResponse).toHaveProperty('title');
    expect(blogPostResponse).toHaveProperty('contents');
  });

  it('レスポンスをブログ記事の構造に変換できる', async () => {
    const BlogPostResponse = await fetchBlogPost(1);

    const viewBlogPostInput = createViewBlogPostInput().setPostTitle(
      BlogPostResponse.title,
    );

    mapResponseContentToBlogPost(BlogPostResponse, viewBlogPostInput);

    const blogPost = viewBlogPost(viewBlogPostInput);

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
