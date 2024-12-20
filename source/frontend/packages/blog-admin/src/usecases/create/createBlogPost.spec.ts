import type { BlogPostRepository } from 'service/src/blogPostService/repository/blogPostRepository';
import { mockBlogPostDTO } from 'service/src/mockData/mockBlogPostDTO';
import { mockBlogPostRepository } from 'service/src/testUtils/blogPostRepositoryMock';
import { formatDate2DigitString } from 'service/src/utils/date';
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

    const blogPostCreator = new CreateBlogPostUseCase(
      mockBlogPostDTO,
      mockRepository,
    );

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
    const blogPostCreator = new CreateBlogPostUseCase(
      mockBlogPostDTO,
      mockRepository,
    );
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
    const blogPostCreator = new CreateBlogPostUseCase(
      mockBlogPostDTO,
      apiRepository,
    );
    const createdBlogPost = await blogPostCreator.execute();

    const today = formatDate2DigitString(new Date());
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
