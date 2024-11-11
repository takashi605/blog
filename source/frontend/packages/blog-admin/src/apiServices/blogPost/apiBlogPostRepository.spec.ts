import { mockApiForServer } from '@/apiMocks/serverForNode';
import { ApiBlogPostRepository } from '@/apiServices/blogPost/apiBlogPostRepository';
import { BlogPostCreator } from '@/usecases/create/createBlogPost';
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
      .addH2(1, 'h2見出し1')
      .addH3(2, 'h3見出し1')
      .addParagraph(3, '段落1');
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

describe('ApiBlogPostRepository と BlogPostCreator の結合テスト', () => {
  it('api を通じて JSON 形式の記録データが保存できる', async () => {
    const apiRepository = new ApiBlogPostRepository();

    const blogPostBuilder = createBlogPostBuilder()
      .setPostTitle('記事タイトル')
      .setPostDate('1999-01-01')
      .setLastUpdateDate('1999-01-02')
      .addH2(1, 'h2見出し1')
      .addH3(2, 'h3見出し1')
      .addParagraph(3, '段落1');
    const blogPostCreator = new BlogPostCreator(blogPostBuilder, apiRepository);
    const createdBlogPost = await blogPostCreator.execute();

    const today = onlyYMD(new Date());
    expect(createdBlogPost).toEqual({
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

// 年月日のみを取得する
function onlyYMD(date: Date) {
  return date.toISOString().split('T')[0];
}
