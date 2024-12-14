import type { BlogPost } from 'entities/src/blogPost';
import { mockBlogPostDTO } from '../../mockData/mockBlogPostDTO';
import { mockBlogPostRepository } from '../../testUtils/blogPostRepositoryMock';
import { createUUIDv4 } from '../../utils/uuid';
import type { BlogPostDTO } from '../dto/blogPostDTO';
import type { BlogPostRepository } from '../repository/blogPostRepository';
import { PickUpPostSelector } from './pickUpPostSelector';

describe('pickUpPostSelector', () => {
  it('ピックアップ記事に設定されている記事のエンティティデータを取得できる', async () => {
    const expectedPickUpPost: BlogPostDTO[] = buildPickUpPostDTO();
    const fetchPickUpPosts = jest.fn().mockReturnValue(expectedPickUpPost);
    const mockRepository: BlogPostRepository = {
      ...mockBlogPostRepository,
      fetchPickUpPosts,
    };

    const pickUpPostSelector = new PickUpPostSelector(mockRepository);
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
  const baseMockData: BlogPostDTO = mockBlogPostDTO;
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
