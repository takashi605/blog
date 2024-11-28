import { ContentType } from 'entities/src/blogPost/postContents/content';
import type { BlogPostRepository } from 'service/src/blogPostService/blogPostRepository';
import type { BlogPostDTO } from 'service/src/blogPostService/blogPostRepository/repositoryOutput/blogPostDTO';
import { createUUIDv4 } from 'service/src/utils/uuid';
import { ViewLatestBlogPostsUseCase } from './viewLatestBlogPosts';

describe('viewLatestBlogPosts', () => {
  it('DTO 形式のブログ記事構造を複数件返す', async () => {
    const fetchLatestsMock = jest.fn().mockReturnValue(createFetchedDTOMock());
    const mockRepository: BlogPostRepository = {
      save: jest.fn(),
      fetch: jest.fn(),
      fetchLatests: fetchLatestsMock,
    };

    const viewLatestsUseCase = new ViewLatestBlogPostsUseCase(mockRepository);
    const blogPosts = await viewLatestsUseCase.execute();
    expect(fetchLatestsMock).toHaveBeenCalled();

    expect(blogPosts[0].id).toBeDefined();
    expect(blogPosts[0].title).toBe('dto1記事タイトル');
    expect(blogPosts[0].postDate).toBe('2021/01/01');
    expect(blogPosts[0].lastUpdateDate).toBe('2021/01/02');
    expect(blogPosts[0].thumbnail.path).toBe('path/to/thumbnail1');

    if (blogPosts[0].contents[0].type !== ContentType.H2) {
      throw new Error('ContentType が H2 ではありません');
    }
    expect(blogPosts[0].contents[0].id).toBeDefined();
    expect(blogPosts[0].contents[0].type).toBe('h2');
    expect(blogPosts[0].contents[0].text).toBe('h2見出し1');

    if (blogPosts[0].contents[1].type !== ContentType.H3) {
      throw new Error('ContentType が H3 ではありません');
    }
    expect(blogPosts[0].contents[1].id).toBeDefined();
    expect(blogPosts[0].contents[1].type).toBe('h3');
    expect(blogPosts[0].contents[1].text).toBe('h3見出し1');

    expect(blogPosts[1].id).toBeDefined();
    expect(blogPosts[1].title).toBe('dto2記事タイトル');
    expect(blogPosts[1].postDate).toBe('2021/02/01');
    expect(blogPosts[1].lastUpdateDate).toBe('2021/02/02');
    expect(blogPosts[1].thumbnail.path).toBe('path/to/thumbnail2');

    if (blogPosts[1].contents[0].type !== ContentType.H2) {
      throw new Error('ContentType が H2 ではありません');
    }
    expect(blogPosts[1].contents[0].id).toBeDefined();
    expect(blogPosts[1].contents[0].type).toBe('h2');
    expect(blogPosts[1].contents[0].text).toBe('h2見出し2');

    if (blogPosts[1].contents[1].type !== ContentType.H3) {
      throw new Error('ContentType が H3 ではありません');
    }
    expect(blogPosts[1].contents[1].id).toBeDefined();
    expect(blogPosts[1].contents[1].type).toBe('h3');
    expect(blogPosts[1].contents[1].text).toBe('h3見出し2');
  });
});

function createFetchedDTOMock(): BlogPostDTO[] {
  const dto1: BlogPostDTO = {
    id: createUUIDv4(),
    title: 'dto1記事タイトル',
    postDate: '2021-01-01',
    lastUpdateDate: '2021-01-02',
    thumbnail: { path: 'path/to/thumbnail1' },
    contents: [
      { id: createUUIDv4(), type: ContentType.H2, text: 'h2見出し1' },
      { id: createUUIDv4(), type: ContentType.H3, text: 'h3見出し1' },
    ],
  };

  const dto2: BlogPostDTO = {
    id: createUUIDv4(),
    title: 'dto2記事タイトル',
    postDate: '2021-02-01',
    lastUpdateDate: '2021-02-02',
    thumbnail: { path: 'path/to/thumbnail2' },
    contents: [
      { id: createUUIDv4(), type: ContentType.H2, text: 'h2見出し2' },
      { id: createUUIDv4(), type: ContentType.H3, text: 'h3見出し2' },
    ],
  };

  return [dto1, dto2];
}
