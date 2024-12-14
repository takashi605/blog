import type { BlogPost } from 'entities/src/blogPost';
import { mockBlogPostDTO } from '../../mockData/mockBlogPostDTO';
import { mockBlogPostRepository } from '../../testUtils/blogPostRepositoryMock';
import { createUUIDv4 } from '../../utils/uuid';
import type { BlogPostDTO } from '../dto/blogPostDTO';
import type { BlogPostRepository } from '../repository/blogPostRepository';
import { PopularPostSelector } from './popularPostSelector';

describe('popularPostSelector', () => {
  it('人気記事に設定されている記事のエンティティデータを取得できる', async () => {
    const expectedPopularPost: BlogPostDTO[] = buildPopularPostDTO();
    const fetchPopularPosts = jest.fn().mockReturnValue(expectedPopularPost);
    const mockRepository: BlogPostRepository = {
      ...mockBlogPostRepository,
      fetchPopularPosts,
    };

    const popularPostSelector = new PopularPostSelector(mockRepository);
    const popularPosts: BlogPost[] =
      await popularPostSelector.getPopularPosts(3);

    expect(fetchPopularPosts).toHaveBeenCalled();
    expect(popularPosts).toHaveLength(3);

    popularPosts.forEach((popularPost) => {
      expect(popularPost.getId()).toBeDefined();
      expect(popularPost.getTitleText()).toBeDefined();
      expect(popularPost.getPostDate()).toBeDefined();
      expect(popularPost.getLastUpdateDate()).toBeDefined();
      expect(popularPost.getThumbnail()).toBeDefined();
      expect(popularPost.getContents()).toBeDefined();
    });
  });
});

function buildPopularPostDTO(): BlogPostDTO[] {
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
