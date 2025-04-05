import type { BlogPost } from 'entities/src/blogPost';
import { mockBlogPostDTO } from '../../mockData/mockBlogPostDTO';
import { mockBlogPostRepository } from '../../testUtils/blogPostRepositoryMock';
import type { BlogPostRepository } from '../repository/blogPostRepository';
import { TopTechPickSelector } from './topTechPickSelector';

describe('topTechPickSelector', () => {
  it('看板記事のエンティティデータを受け取れる', async () => {
    const expectedFetchTopTechPick = mockBlogPostDTO;
    const fetchTopTechPick = jest
      .fn()
      .mockReturnValue(expectedFetchTopTechPick);
    const mockRepository: BlogPostRepository = {
      ...mockBlogPostRepository,
      fetchTopTechPick,
    };
    const topTechPickSelector = new TopTechPickSelector(mockRepository);
    const topTechPickBlogPost: BlogPost = await topTechPickSelector.execute();
    expect(fetchTopTechPick).toHaveBeenCalled();
    expect(topTechPickBlogPost.getId()).toBeDefined();
    expect(topTechPickBlogPost.getTitleText()).toBe('記事タイトル');
    expect(topTechPickBlogPost.getPostDate()).toStrictEqual(
      new Date('2021-01-01'),
    );
    expect(topTechPickBlogPost.getLastUpdateDate()).toStrictEqual(
      new Date('2021-01-02'),
    );
    expect(topTechPickBlogPost.getThumbnail()).toBeDefined();
    expect(topTechPickBlogPost.getContents().length).toBeGreaterThan(0);
  });
});
