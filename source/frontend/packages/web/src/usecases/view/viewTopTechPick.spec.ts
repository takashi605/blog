import type { BlogPostRepository } from 'service/src/blogPostService/repository/blogPostRepository';
import { createUUIDv4 } from 'service/src/utils/uuid';
import { ViewTopTechPickUseCase } from './viewTopTechPick';

describe('viewTopTechPick', () => {
  it('トップテックピック記事のエンティティデータを受け取れる', async () => {
    const fetchedDTOMock = {
      id: createUUIDv4(),
      title: '記事タイトル',
      postDate: '2021-01-01',
      lastUpdateDate: '2021-01-02',
      thumbnail: { path: 'path/to/thumbnail' },
      contents: [
        { id: createUUIDv4(), type: 'h2', text: 'h2見出し1' },
        { id: createUUIDv4(), type: 'h3', text: 'h3見出し1' },
        { id: createUUIDv4(), type: 'paragraph', text: '段落1' },
      ],
    };
    const mockRepository: BlogPostRepository = {
      save: jest.fn(),
      fetch: jest.fn(),
      fetchLatests: jest.fn(),
      fetchTopTechPick: jest.fn().mockReturnValue(fetchedDTOMock),
    };
    const usecase = new ViewTopTechPickUseCase(mockRepository);
    const entity = await usecase.execute();
    expect(entity.getId()).toBeDefined();
    expect(entity.getTitleText()).toBe('記事タイトル');
    expect(entity.getPostDate()).toStrictEqual(new Date('2021-01-01'));
    expect(entity.getLastUpdateDate()).toStrictEqual(new Date('2021-01-02'));
    expect(entity.getThumbnail()).toBeDefined();
    expect(entity.getContents()).toHaveLength(3);
  });
});
