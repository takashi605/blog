import { UUIDList } from 'shared-test-data';
import { ApiBlogPostRepository } from '.';
import { setupMockApiForServer } from '../../apiMocks/serverForNode';
import { HttpError } from '../../error/httpError';
import { MockBlogPost } from 'entities/src/mockData/blogPost/mockBlogPost';
import { createUUIDv4 } from 'service/src/utils/uuid';

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

    const blogPost = new MockBlogPost(createUUIDv4()).successfulMock();

    const resp = await apiRepository.save(blogPost);
    expect(resp.id).toBeDefined();
    expect(resp.title).toBeDefined();
    expect(resp.thumbnail).toBeDefined();
    expect(resp.postDate).toBeDefined();
    expect(resp.lastUpdateDate).toBeDefined();
    expect(resp.contents.length).toBeGreaterThan(0);
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

  it('api から新着記事の一覧を取得できる（取得数を指定）', async () => {
    const apiRepository = new ApiBlogPostRepository('http://localhost:8000');

    const resp = await apiRepository.fetchLatests(3);
    expect(resp.length).toBe(3);

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

  it('api からピックアップ記事を複数件取得できる', async () => {
    const apiRepository = new ApiBlogPostRepository('http://localhost:8000');

    const resp = await apiRepository.fetchPickUpPosts(3);
    expect(resp.length).toBe(3);

    resp.forEach((pickUpPost) => {
      expect(pickUpPost.id).toBeDefined();
      expect(pickUpPost.title).toBeDefined();
      expect(pickUpPost.thumbnail).toBeDefined();
      expect(pickUpPost.postDate).toBeDefined();
      expect(pickUpPost.lastUpdateDate).toBeDefined();
      expect(pickUpPost.contents.length).toBeGreaterThan(0);
    });
  });

  it('api から人気記事を複数件取得できる', async () => {
    const apiRepository = new ApiBlogPostRepository('http://localhost:8000');

    const resp = await apiRepository.fetchPopularPosts(3);
    expect(resp.length).toBe(3);

    resp.forEach((pickUpPost) => {
      expect(pickUpPost.id).toBeDefined();
      expect(pickUpPost.title).toBeDefined();
      expect(pickUpPost.thumbnail).toBeDefined();
      expect(pickUpPost.postDate).toBeDefined();
      expect(pickUpPost.lastUpdateDate).toBeDefined();
      expect(pickUpPost.contents.length).toBeGreaterThan(0);
    });
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
