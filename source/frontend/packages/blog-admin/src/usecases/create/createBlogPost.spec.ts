import { createBlogPostBuilder } from 'service/src/blogPostService/entityBuilder/blogPostBuilder';
import type { BlogPostRepository } from 'service/src/blogPostService/repository/blogPostRepository';
import {
  mockBlogPostDTO,
  mockRichTextForDTO,
} from 'service/src/mockData/mockBlogPostDTO';
import { mockBlogPostRepository } from 'service/src/testUtils/blogPostRepositoryMock';
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
  const mockRepository: BlogPostRepository = mockBlogPostRepository;

  it('ユースケースを実行すると記事データを生成してデータリポジトリへ保存する', async () => {
    const mockSave = jest.fn().mockReturnValue(mockBlogPostDTO);
    const mockRepository: BlogPostRepository = {
      ...mockBlogPostRepository,
      save: mockSave,
    };

    const builder = createBlogPostBuilder()
      .setId(createUUIDv4())
      .setPostTitle('記事タイトル')
      .addH2(createUUIDv4(), 'h2見出し1')
      .addH3(createUUIDv4(), 'h3見出し1')
      .addParagraph(createUUIDv4(), mockRichTextForDTO());
    const blogPostCreator = new CreateBlogPostUseCase(builder, mockRepository);

    const createdBlogPost = await blogPostCreator.execute();

    expect(mockRepository.save).toHaveBeenCalledTimes(1);

    expect(createdBlogPost.title).toBeDefined();
    expect(createdBlogPost.postDate).toBeDefined();
    expect(createdBlogPost.lastUpdateDate).toBeDefined();

    const h2Content = createdBlogPost.contents.find(
      (content) => content.type === 'h2',
    )!;
    expect(h2Content.type).toBe('h2');
    expect(h2Content.text).toBeDefined();

    const h3Content = createdBlogPost.contents.find(
      (content) => content.type === 'h3',
    )!;
    expect(h3Content.type).toBe('h3');
    expect(h3Content.text).toBeDefined();

    const paragraphContent = createdBlogPost.contents.find(
      (content) => content.type === 'paragraph',
    )!;
    expect(paragraphContent.type).toBe('paragraph');
    expect(paragraphContent.text).toBeDefined();
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

    const blogPostBuilder = createBlogPostBuilder()
      .setId(createUUIDv4())
      .setThumbnail('path/to/thumbnail')
      .setPostTitle('記事タイトル')
      .setPostDate('1999-01-01')
      .setLastUpdateDate('1999-01-02')
      .addH2(createUUIDv4(), 'h2見出し1')
      .addH3(createUUIDv4(), 'h3見出し1')
      .addParagraph(createUUIDv4(), mockRichTextForDTO());
    const blogPostCreator = new CreateBlogPostUseCase(
      blogPostBuilder,
      apiRepository,
    );
    const createdBlogPost = await blogPostCreator.execute();

    const today = onlyYMD(new Date());
    expect(createdBlogPost.id).toBeDefined();
    expect(createdBlogPost.title).toBe('記事タイトル');
    expect(createdBlogPost.thumbnail.path).toBe('path/to/thumbnail');
    expect(createdBlogPost.postDate).toBe(today);
    expect(createdBlogPost.lastUpdateDate).toBe(today);
    expect(createdBlogPost.contents).toHaveLength(3);

    const h2Content = createdBlogPost.contents.find(
      (content) => content.type === 'h2',
    )!;
    expect(h2Content.type).toBe('h2');
    expect(h2Content.text).toBeDefined();

    const h3Content = createdBlogPost.contents.find(
      (content) => content.type === 'h3',
    )!;
    expect(h3Content.type).toBe('h3');
    expect(h3Content.text).toBeDefined();

    const paragraphContent = createdBlogPost.contents.find(
      (content) => content.type === 'paragraph',
    )!;
    expect(paragraphContent.type).toBe('paragraph');
    expect(paragraphContent.text).toBeDefined();
  });
});

// 年月日のみを取得する
function onlyYMD(date: Date) {
  return date.toISOString().split('T')[0];
}
