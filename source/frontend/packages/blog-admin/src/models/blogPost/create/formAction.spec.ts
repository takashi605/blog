import { createdBlogPosts } from '@/apiMocks/handlers/blogPostHandlers';
import { mockApiForServer } from '@/apiMocks/serverForNode';
import { createBlogPostAction } from '@/models/blogPost/create/formAction';

beforeAll(() => {
  mockApiForServer.listen();
});
afterEach(async () => {
  mockApiForServer.resetHandlers();
});
afterAll(() => {
  mockApiForServer.close();
});

describe('記事投稿フォームの formAction', () => {
  it('api 通信を通じて記事を投稿ができる', async () => {
    await createBlogPostAction();

    const today = new Date().toISOString().split('T')[0];
    expect(createdBlogPosts[0]).toEqual({
      title: '記事タイトル',
      postDate: today,
      lastUpdateDate: today,
      contents: [
        { type: 'h2', text: 'h2見出し1' },
        { type: 'h3', text: 'h3見出し1' },
        { type: 'paragraph', text: '段落1' },
      ],
    });
  });
});
