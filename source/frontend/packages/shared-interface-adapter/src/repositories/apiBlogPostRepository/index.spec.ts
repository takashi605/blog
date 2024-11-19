import { createBlogPostBuilder } from 'service/src/blogPostBuilder';
import { createUUIDv4 } from 'service/src/utils/uuid';
import { ApiBlogPostRepository } from '.';
import { UUIDList } from '../../apiMocks/handlers/blogPostHandlers';
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
    const blogPostBuilder = createBlogPostBuilder()
      .setId(id)
      .setThumbnail('path/to/thumbnail')
      .setPostTitle('記事タイトル')
      .setPostDate('1999-01-01')
      .setLastUpdateDate('1999-01-02')
      .addH2(1, 'h2見出し1')
      .addH3(2, 'h3見出し1')
      .addParagraph(3, '段落1');
    const blogPost = blogPostBuilder.build();

    const resp = await apiRepository.save(blogPost);
    expect(resp).toEqual({
      id,
      title: '記事タイトル',
      thumbnail: { path: 'path/to/thumbnail' },
      postDate: '1999-01-01',
      lastUpdateDate: '1999-01-02',
      contents: [
        { id: 1, type: 'h2', text: 'h2見出し1' },
        { id: 2, type: 'h3', text: 'h3見出し1' },
        { id: 3, type: 'paragraph', text: '段落1' },
      ],
    });
  });

  it('api から JSON 形式の記事データを取得できる', async () => {
    const apiRepository = new ApiBlogPostRepository('http://localhost:8000');

    // TODO UUID を指定して取得するように変更
    const resp = await apiRepository.fetch('1');
    expect(resp.id).toBe(UUIDList.UUID1);
    expect(resp.title).not.toBeUndefined();
    expect(resp.thumbnail).not.toBeUndefined();
    expect(resp.postDate).not.toBeUndefined();
    expect(resp.lastUpdateDate).not.toBeUndefined();
    expect(resp.contents.length).toBeGreaterThan(0);
  });

  it('404 エラーレスポンスが返るとエラーが throw される', async () => {
    const apiRepository = new ApiBlogPostRepository('http://localhost:8000');
    try {
      await apiRepository.fetch('1000');
    } catch (error) {
      expect(error instanceof HttpError).toBeTruthy();
      const httpError = error as HttpError;
      expect(httpError.message).toBe('記事データが存在しませんでした');
      expect(httpError.status).toBe(404);
    }
  });
});
