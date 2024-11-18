import { ViewBlogPostUseCase } from '@/usecases/view/viewBlogPost';
import type { BlogPostRepository } from 'service/src/blogPostRepository';
import { createUUIDv4 } from 'service/src/utils/uuid';

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
        { id: 1, type: 'h2', text: 'h2見出し1' },
        { id: 2, type: 'h3', text: 'h3見出し1' },
        { id: 3, type: 'paragraph', text: '段落1' },
        { id: 4, type: 'h3', text: 'h3見出し2' },
        { id: 5, type: 'paragraph', text: '段落2' },
      ],
    };
    const mockRepository: BlogPostRepository = {
      save: jest.fn(),
      fetch: jest.fn().mockReturnValue(fetchedDTOMock),
    };

    const viewBlogPostUsecase = new ViewBlogPostUseCase(mockRepository);

    // TODO UUID で取得するように変更
    const blogPostDTO = await viewBlogPostUsecase.execute('1');
    expect(blogPostDTO).toEqual({
      ...fetchedDTOMock,
      postDate: '2021/01/01',
      lastUpdateDate: '2021/01/02',
    });
  });
});
