import { mockApiForServer } from '@/apiMocks/serverForNode';
import { createBlogPostBuilder } from 'entities/src/blogPost/blogPostBuilder';
import { ApiBlogPostRepository } from '.';

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
      .setThumbnail('path/to/thumbnail')
      .setPostTitle('記事タイトル')
      .setPostDate('1999-01-01')
      .setLastUpdateDate('1999-01-02')
      .addH2(1, 'h2見出し1')
      .addH3(2, 'h3見出し1')
      .addParagraph(3, '段落1');
    const blogPost = blogPostBuilder.build();

    const resp = await apiRepository.save(blogPost);
    expect(resp).toEqual({
      title: '記事タイトル',
      thumbnail: { path: 'path/to/thumbnail' },
      postDate: '1999-01-01',
      lastUpdateDate: '1999-01-02',
      contents: [
        { id: 1, type: 'h2', text: 'h2見出し1' },
        { id: 2, type: 'h3', text: 'h3見出し1' },
        { id: 3, type: 'paragraph', text: '段落1' },
      ],
    });
  });
});
