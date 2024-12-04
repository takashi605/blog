import type { BlogPost } from 'entities/src/blogPost';
import { ContentType } from 'entities/src/blogPost/postContents/content';
import { createUUIDv4 } from '../../utils/uuid';
import type { BlogPostDTO } from '../dto/blogPostDTO';
import type { BlogPostRepository } from '../repository/blogPostRepository';

describe('pickUpPostSelector', () => {
  it('ピックアップ記事に設定されている記事のエンティティデータを取得できる', async () => {
    const expectedPickUpPost: BlogPostDTO[] = buildPickUpPostDTO();
    const fetchPickUpPosts = jest.fn().mockReturnValue(expectedPickUpPost);
    const mockBlogPostRepository: BlogPostRepository = {
      save: jest.fn(),
      fetch: jest.fn(),
      fetchLatests: jest.fn(),
      fetchTopTechPick: jest.fn(),
      fetchPickUpPosts,
    };

    const pickUpPostSelector = new PickUpPostSelector(mockBlogPostRepository);
    const pickUpPosts: BlogPost[] = await pickUpPostSelector.getPickUpPosts(3);

    expect(fetchPickUpPosts).toHaveBeenCalled();
    expect(pickUpPosts).toHaveLength(3);

    pickUpPosts.forEach((pickUpPost) => {
      expect(pickUpPost.getId()).toBeDefined();
      expect(pickUpPost.getTitleText()).toBeDefined();
      expect(pickUpPost.getPostDate()).toBeDefined();
      expect(pickUpPost.getLastUpdateDate()).toBeDefined();
      expect(pickUpPost.getThumbnail()).toBeDefined();
      expect(pickUpPost.getContents()).toBeDefined();
    });
  });
});

function buildPickUpPostDTO(): BlogPostDTO[] {
  const baseMockData: BlogPostDTO = {
    id: createUUIDv4(),
    title: '記事タイトル',
    postDate: '2021-01-01',
    lastUpdateDate: '2021-01-02',
    thumbnail: { path: 'path/to/thumbnail' },
    contents: [
      { id: createUUIDv4(), type: ContentType.H2, text: 'h2見出し1' },
      { id: createUUIDv4(), type: ContentType.H3, text: 'h3見出し1' },
      { id: createUUIDv4(), type: ContentType.Paragraph, text: '段落1' },
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
