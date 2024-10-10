import { server } from '@/apiMock/server';
import { fetchBlogPost } from '@/components/controllers/blogPost/services/fetchBlogPost';

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
  it('投稿記事のタイトルが取得できる', async () => {
    const blogPost = await fetchBlogPost(1);

    expect(blogPost).toHaveProperty('title');
  });
});
