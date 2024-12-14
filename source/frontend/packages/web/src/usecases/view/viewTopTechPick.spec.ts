import { ContentType } from 'entities/src/blogPost/postContents/content';
import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import type { BlogPostRepository } from 'service/src/blogPostService/repository/blogPostRepository';
import { mockRichTextForDTO } from 'service/src/mockData/mockBlogPostDTO';
import { mockBlogPostRepository } from 'service/src/testUtils/blogPostRepositoryMock';
import { createUUIDv4 } from 'service/src/utils/uuid';
import { ViewTopTechPickUseCase } from './viewTopTechPick';

describe('viewTopTechPick', () => {
  it('トップテックピック記事のエンティティデータを受け取れる', async () => {
    const fetchedDTOMock: BlogPostDTO = {
      id: createUUIDv4(),
      title: '記事タイトル',
      postDate: '2021-01-01',
      lastUpdateDate: '2021-01-02',
      thumbnail: { path: 'path/to/thumbnail' },
      contents: [
        { id: createUUIDv4(), type: ContentType.H2, text: 'h2見出し1' },
        { id: createUUIDv4(), type: ContentType.H3, text: 'h3見出し1' },
        {
          id: createUUIDv4(),
          type: ContentType.Paragraph,
          text: mockRichTextForDTO(),
        },
      ],
    };
    const mockRepository: BlogPostRepository = {
      ...mockBlogPostRepository,
      save: jest.fn(),
      fetch: jest.fn(),
      fetchLatests: jest.fn(),
      fetchTopTechPick: jest.fn().mockReturnValue(fetchedDTOMock),
    };
    const usecase = new ViewTopTechPickUseCase(mockRepository);
    const dto: BlogPostDTO = await usecase.execute();
    expect(dto.id).toBeDefined();
    expect(dto.title).toBe('記事タイトル');
    expect(dto.postDate).toStrictEqual('2021/01/01');
    expect(dto.lastUpdateDate).toStrictEqual('2021/01/02');
    expect(dto.thumbnail).toBeDefined();
    expect(dto.contents).toHaveLength(3);
  });
});
