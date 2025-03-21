import { Image } from 'entities/src/blogPost/image';
import { createUUIDv4 } from 'service/src/utils/uuid';
import { ApiImageRepository } from '.';
import { setupMockApiForServer } from '../../apiMocks/serverForNode';

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

describe('apiImageRepository', () => {
  it('api を通じて JSON 形式の画像データが保存できる', async () => {
    const apiRepository = new ApiImageRepository('http://localhost:8000');

    const image = new Image(createUUIDv4(), 'path');

    const resp = await apiRepository.save(image);
    expect(resp.id).toBeDefined();
    expect(resp.path).toBeDefined();
  });
});
