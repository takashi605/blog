import { ContentType } from 'entities/src/blogPost/postContents/content';
import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import type { BlogPostRepository } from 'service/src/blogPostService/repository/blogPostRepository';
import { mockRichTextDTO } from 'service/src/mockData/mockBlogPostDTO';
import { mockBlogPostRepository } from 'service/src/testUtils/blogPostRepositoryMock';
import { createUUIDv4 } from 'service/src/utils/uuid';
import { ViewPickUpPostUseCase } from './viewPickUpPost';

describe('viewPickUpPost', () => {
  it('ピックアップ記事のエンティティデータを閲覧できる', async () => {
    const expectedPickUpPost: BlogPostDTO[] = buildPickUpPostDTOMock();
    const fetchPickUpPosts = jest.fn().mockReturnValue(expectedPickUpPost);
    const mockRepository: BlogPostRepository = {
      ...mockBlogPostRepository,
      fetchPickUpPosts,
    };

    const usecase = new ViewPickUpPostUseCase(mockRepository).setQuantity(3);
    const postsDto: BlogPostDTO[] = await usecase.execute();
    expect(fetchPickUpPosts).toHaveBeenCalled();
    expect(postsDto).toHaveLength(3);
    postsDto.forEach((dto) => {
      expect(dto.id).toBeDefined();
      expect(dto.title).toBeDefined();
      expect(dto.postDate).toBeDefined();
      expect(dto.lastUpdateDate).toBeDefined();
      expect(dto.thumbnail).toBeDefined();
      expect(dto.contents).toBeDefined();
    });
  });
});

function buildPickUpPostDTOMock(): BlogPostDTO[] {
  const baseMockData: BlogPostDTO = {
    id: createUUIDv4(),
    title: '記事タイトル',
    postDate: '2021-01-01',
    lastUpdateDate: '2021-01-02',
    thumbnail: {
      id: '535c8105-fd92-47b7-93ce-dc01b379ae66',
      path: 'path/to/thumbnail',
    },
    contents: [
      { id: createUUIDv4(), type: ContentType.H2, text: 'h2見出し1' },
      { id: createUUIDv4(), type: ContentType.H3, text: 'h3見出し1' },
      {
        id: createUUIDv4(),
        type: ContentType.Paragraph,
        text: mockRichTextDTO(),
      },
    ],
  };
  return [
    {
      ...baseMockData,
      id: createUUIDv4(),
      title: '記事タイトル1',
    },
    {
      ...baseMockData,
      id: createUUIDv4(),
      title: '記事タイトル2',
    },
    {
      ...baseMockData,
      id: createUUIDv4(),
      title: '記事タイトル3',
    },
  ];
}
