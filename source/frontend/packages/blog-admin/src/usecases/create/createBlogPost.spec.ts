import { createBlogPostBuilder } from 'service/src/blogPostService/entityBuilder/blogPostBuilder';
import type { BlogPostRepository } from 'service/src/blogPostService/repository/blogPostRepository';
import { createUUIDv4 } from 'service/src/utils/uuid';
import { setupMockApiForServer } from 'shared-interface-adapter/src/apiMocks/serverForNode';
import { ApiBlogPostRepository } from 'shared-interface-adapter/src/repositories/apiBlogPostRepository';
import { CreateBlogPostUseCase } from './createBlogPost';

const mockApiForServer = setupMockApiForServer(
  process.env.NEXT_PUBLIC_API_URL!,
);
beforeAll(() => {
  mockApiForServer.listen();
});
afterEach(async () => {
  mockApiForServer.resetHandlers();
});
afterAll(() => {
  mockApiForServer.close();
});

describe('ユースケース: 記事の投稿', () => {
  const mockRepository: BlogPostRepository = {
    save: jest.fn(),
    fetch: jest.fn(),
    fetchLatests: jest.fn(),
    fetchTopTechPick: jest.fn(),
  };

  it('ユースケースを実行すると記事データを生成してデータリポジトリへ保存する', async () => {
    const mockSave = jest.fn().mockReturnValue({
      title: '記事タイトル',
      postDate: '1999-01-01',
      lastUpdateDate: '1999-01-02',
      contents: [
        { type: 'h2', text: 'h2見出し1' },
        { type: 'h3', text: 'h3見出し1' },
        { type: 'paragraph', text: '段落1' },
      ],
    });
    const mockRepository: BlogPostRepository = {
      save: mockSave,
      fetch: jest.fn(),
      fetchLatests: jest.fn(),
      fetchTopTechPick: jest.fn(),
    };

    const id = createUUIDv4();
    const builder = createBlogPostBuilder()
      .setId(id)
      .setPostTitle('記事タイトル')
      .addH2(createUUIDv4(), 'h2見出し1')
      .addH3(createUUIDv4(), 'h3見出し1')
      .addParagraph(createUUIDv4(), '段落1');
    const blogPostCreator = new CreateBlogPostUseCase(builder, mockRepository);

    const createdBlogPost = await blogPostCreator.execute();

    expect(mockRepository.save).toHaveBeenCalledTimes(1);

    expect(createdBlogPost.title).toBe('記事タイトル');
    expect(createdBlogPost.postDate).toBe('1999-01-01');
    expect(createdBlogPost.lastUpdateDate).toBe('1999-01-02');
    expect(createdBlogPost.contents[0]).toEqual({
      type: 'h2',
      text: 'h2見出し1',
    });
    expect(createdBlogPost.contents[1]).toEqual({
      type: 'h3',
      text: 'h3見出し1',
    });
    expect(createdBlogPost.contents[2]).toEqual({
      type: 'paragraph',
      text: '段落1',
    });
  });

  it('投稿日時と更新日時が今日の日付になる', () => {
    const id = createUUIDv4();
    const builder = createBlogPostBuilder()
      .setId(id)
      .setPostTitle('記事タイトル')
      .setPostDate('1999-01-01')
      .setLastUpdateDate('1999-01-02');
    const blogPostCreator = new CreateBlogPostUseCase(builder, mockRepository);
    const blogPost = blogPostCreator.buildBlogPost();

    const today = onlyYMD(new Date());
    const postDate = onlyYMD(blogPost.getPostDate());
    const lastUpdateDate = onlyYMD(blogPost.getLastUpdateDate());

    expect(postDate).toBe(today);
    expect(lastUpdateDate).toBe(today);
  });
});

describe('ApiBlogPostRepository と BlogPostCreator の結合テスト', () => {
  it('api を通じて JSON 形式の記録データが保存できる', async () => {
    const apiRepository = new ApiBlogPostRepository(
      process.env.NEXT_PUBLIC_API_URL!,
    );

    const id = createUUIDv4();
    const contentIds = [createUUIDv4(), createUUIDv4(), createUUIDv4()];
    const blogPostBuilder = createBlogPostBuilder()
      .setId(id)
      .setThumbnail('path/to/thumbnail')
      .setPostTitle('記事タイトル')
      .setPostDate('1999-01-01')
      .setLastUpdateDate('1999-01-02')
      .addH2(contentIds[0], 'h2見出し1')
      .addH3(contentIds[1], 'h3見出し1')
      .addParagraph(contentIds[2], '段落1');
    const blogPostCreator = new CreateBlogPostUseCase(
      blogPostBuilder,
      apiRepository,
    );
    const createdBlogPost = await blogPostCreator.execute();

    const today = onlyYMD(new Date());
    expect(createdBlogPost).toEqual({
      id,
      title: '記事タイトル',
      thumbnail: { path: 'path/to/thumbnail' },
      postDate: today,
      lastUpdateDate: today,
      contents: [
        { id: contentIds[0], type: 'h2', text: 'h2見出し1' },
        { id: contentIds[1], type: 'h3', text: 'h3見出し1' },
        { id: contentIds[2], type: 'paragraph', text: '段落1' },
      ],
    });
  });
});

// 年月日のみを取得する
function onlyYMD(date: Date) {
  return date.toISOString().split('T')[0];
}
