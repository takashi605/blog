import { mockApiForServer } from '@/apiMocks/serverForNode';
import { ApiBlogPostRepository } from '@/apiServices/blogPost/apiBlogPostRepository';

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
  it('api を通じて JSON 形式の記録データが保存できる', async() => {
    const apiRepository = new ApiBlogPostRepository();
    const resp = await apiRepository.save(JSON.stringify({ title: '記事タイトル' }));
    expect(resp).toEqual({ title: '記事タイトル' });
  });
});
