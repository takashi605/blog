import type { BlogPost } from 'entities/src/blogPost';
import { ContentType } from 'entities/src/blogPost/postContents/content';
import { createUUIDv4 } from '../../utils/uuid';
import type { BlogPostDTO } from '../dto/blogPostDTO';
import type { BlogPostRepository } from '../repository/blogPostRepository';
import { TopTechPickSelector } from './topTechPickSelector';

describe('topTechPickSelector', () => {
  it('看板記事のエンティティデータを受け取れる', async () => {
    const expectedFetchTopTechPick = buildTopTechPickDTO();
    const fetchTopTechPick = jest
      .fn()
      .mockReturnValue(expectedFetchTopTechPick);
    const mockBlogPostRepository: BlogPostRepository = {
      save: jest.fn(),
      fetch: jest.fn(),
      fetchLatests: jest.fn(),
      fetchTopTechPick,
    };
    const topTechPickSelector = new TopTechPickSelector(mockBlogPostRepository);
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
    expect(topTechPickBlogPost.getContents()).toHaveLength(3);
  });
});

function buildTopTechPickDTO(): BlogPostDTO {
  return {
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
}
