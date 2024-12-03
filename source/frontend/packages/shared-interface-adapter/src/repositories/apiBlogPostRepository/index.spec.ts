import { createBlogPostBuilder } from 'service/src/blogPostService/entityBuilder/blogPostBuilder';
import { createUUIDv4 } from 'service/src/utils/uuid';
import { UUIDList } from 'shared-test-data';
import { ApiBlogPostRepository } from '.';
import { setupMockApiForServer } from '../../apiMocks/serverForNode';
import { HttpError } from '../../error/httpError';

// TODO このパッケージ内で setupMockApiForServer の利用箇所が増えたら共通化する
const mockApiForServer = setupMockApiForServer('http://localhost:8000');
beforeAll(() => {
  mockApiForServer.listen();
});
afterEach(async () => {
  mockApiForServer.resetHandlers();
});
afterAll(() => {
  mockApiForServer.close();
});

describe('apiBlogPostRepository', () => {
  it('api を通じて JSON 形式の記事データが保存できる', async () => {
    const apiRepository = new ApiBlogPostRepository('http://localhost:8000');

    const id = createUUIDv4();
    const contentIds = [createUUIDv4(), createUUIDv4(), createUUIDv4()];
    const blogPostBuilder = createBlogPostBuilder()
      .setId(id)
      .setThumbnail('path/to/thumbnail')
      .setPostTitle('記事タイトル')
      .setPostDate('1999-01-01')
      .setLastUpdateDate('1999-01-02')
      .addH2(contentIds[0], 'h2見出し1')
      .addH3(contentIds[1], 'h3見出し1')
      .addParagraph(contentIds[2], '段落1');
    const blogPost = blogPostBuilder.build();

    const resp = await apiRepository.save(blogPost);
    expect(resp).toEqual({
      id,
      title: '記事タイトル',
      thumbnail: { path: 'path/to/thumbnail' },
      postDate: '1999-01-01',
      lastUpdateDate: '1999-01-02',
      contents: [
        { id: contentIds[0], type: 'h2', text: 'h2見出し1' },
        { id: contentIds[1], type: 'h3', text: 'h3見出し1' },
        { id: contentIds[2], type: 'paragraph', text: '段落1' },
      ],
    });
  });

  it('api から JSON 形式の記事データを取得できる', async () => {
    const apiRepository = new ApiBlogPostRepository('http://localhost:8000');

    const resp = await apiRepository.fetch(UUIDList.UUID1);
    expect(resp.id).toBe(UUIDList.UUID1);
    expect(resp.title).not.toBeUndefined();
    expect(resp.thumbnail).not.toBeUndefined();
    expect(resp.postDate).not.toBeUndefined();
    expect(resp.lastUpdateDate).not.toBeUndefined();
    expect(resp.contents.length).toBeGreaterThan(0);
  });

  it('api から新着記事の一覧を取得できる', async () => {
    const apiRepository = new ApiBlogPostRepository('http://localhost:8000');

    const resp = await apiRepository.fetchLatests();
    expect(resp.length).toBeGreaterThan(0);

    for (let i = 0; i < resp.length - 1; i++) {
      expect(
        new Date(resp[i].postDate) <= new Date(resp[i + 1].postDate),
      ).toBeTruthy();
    }
  });

  it('api からトップテックピック記事を取得できる', async () => {
    const apiRepository = new ApiBlogPostRepository('http://localhost:8000');

    const resp = await apiRepository.fetchTopTechPick();
    expect(resp.id).toBeDefined();
    expect(resp.title).toBeDefined();
    expect(resp.thumbnail).toBeDefined();
    expect(resp.postDate).toBeDefined();
    expect(resp.lastUpdateDate).toBeDefined();
    expect(resp.contents.length).toBeGreaterThan(0);
  });

  it('404 エラーレスポンスが返るとエラーが throw される', async () => {
    const apiRepository = new ApiBlogPostRepository('http://localhost:8000');
    try {
      await apiRepository.fetch(UUIDList.UUID3);
    } catch (error) {
      expect(error instanceof HttpError).toBeTruthy();
      const httpError = error as HttpError;
      expect(httpError.message).toBe('記事データが存在しませんでした');
      expect(httpError.status).toBe(404);
    }
  });
});
