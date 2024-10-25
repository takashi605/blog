import { mockApiForServer } from '@/apiMocks/serverForNode';
import { ApiBlogPostRepository } from '@/apiServices/blogPost/apiBlogPostRepository';
import { createBlogPostBuilder } from 'entities/src/blogPost/blogPostBuilder';

beforeAll(() => {
  mockApiForServer.listen();
});
afterEach(async () => {
  mockApiForServer.resetHandlers();
});
afterAll(() => {
  mockApiForServer.close();
});

describe('apiBlogPostRepository', () => {
  it('api を通じて JSON 形式の記録データが保存できる', async () => {
    const apiRepository = new ApiBlogPostRepository();
    const blogPostBuilder = createBlogPostBuilder()
      .setPostTitle('記事タイトル')
      .setPostDate('1999-01-01')
      .setLastUpdateDate('1999-01-02')
      .addH2('h2見出し1')
      .addH3('h3見出し1')
      .addParagraph('段落1');
    const blogPost = blogPostBuilder.build();
    const resp = await apiRepository.save(blogPost);
    expect(resp).toEqual({
      title: '記事タイトル',
      postDate: '1999-01-01',
      lastUpdateDate: '1999-01-02',
      contents: [
        { type: 'h2', text: 'h2見出し1' },
        { type: 'h3', text: 'h3見出し1' },
        { type: 'paragraph', text: '段落1' },
      ],
    });
  });
});
