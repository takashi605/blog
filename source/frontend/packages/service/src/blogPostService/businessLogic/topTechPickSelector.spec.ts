import { ContentType } from 'entities/src/blogPost/postContents/content';
import { createUUIDv4 } from '../../utils/uuid';
import type { BlogPostRepository } from '../repository/blogPostRepository';
import type { BlogPostDTO } from '../repository/repositoryOutput/blogPostDTO';
import { TopTechPickSelector } from './topTechPickSelector';

describe('topTechPickSelector', () => {
  it('データリポジトリからデータを受け取れる', async () => {
    const expectedFetchTopTechPick = buildTopTechPickEntity();
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
    const topTechPickBlogPost = await topTechPickSelector.execute();
    expect(fetchTopTechPick).toHaveBeenCalled();
    expect(topTechPickBlogPost.id).toBeDefined();
    expect(topTechPickBlogPost.title).toBe('記事タイトル');
    expect(topTechPickBlogPost.postDate).toBe('2021-01-01');
    expect(topTechPickBlogPost.lastUpdateDate).toBe('2021-01-02');
    expect(topTechPickBlogPost.thumbnail).toBeDefined();
  });
});

function buildTopTechPickEntity(): BlogPostDTO {
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
      { id: createUUIDv4(), type: ContentType.H3, text: 'h3見出し2' },
      { id: createUUIDv4(), type: ContentType.Paragraph, text: '段落2' },
    ],
  };
}
