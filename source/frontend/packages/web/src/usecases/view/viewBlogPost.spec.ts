import { ViewBlogPostUseCase } from '@/usecases/view/viewBlogPost';
import type { BlogPostRepository } from 'service/src/blogPostService/repository/blogPostRepository';
import { createUUIDv4 } from 'service/src/utils/uuid';
import { UUIDList } from 'shared-test-data';

describe('ユースケース: 投稿記事の閲覧', () => {
  it('データリポジトリからデータを取得し、ブログ記事の構造として返却する', async () => {
    const id = createUUIDv4();
    const fetchedDTOMock = {
      id,
      title: '記事タイトル',
      postDate: '2021-01-01',
      lastUpdateDate: '2021-01-02',
      thumbnail: { path: 'path/to/thumbnail' },
      contents: [
        { id: createUUIDv4(), type: 'h2', text: 'h2見出し1' },
        { id: createUUIDv4(), type: 'h3', text: 'h3見出し1' },
        { id: createUUIDv4(), type: 'paragraph', text: '段落1' },
        { id: createUUIDv4(), type: 'h3', text: 'h3見出し2' },
        { id: createUUIDv4(), type: 'paragraph', text: '段落2' },
      ],
    };
    const mockRepository: BlogPostRepository = {
      save: jest.fn(),
      fetch: jest.fn().mockReturnValue(fetchedDTOMock),
      fetchLatests: jest.fn(),
      fetchTopTechPick: jest.fn(),
    };

    const viewBlogPostUsecase = new ViewBlogPostUseCase(mockRepository);

    const blogPostDTO = await viewBlogPostUsecase.execute(UUIDList.UUID1);
    expect(blogPostDTO).toEqual({
      ...fetchedDTOMock,
      postDate: '2021/01/01',
      lastUpdateDate: '2021/01/02',
    });
  });
});
