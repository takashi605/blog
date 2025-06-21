import { Image } from 'entities/src/blogPost/image';
import { createUUIDv4 } from 'service/src/utils/uuid';
import { ApiImageRepository } from '.';
import { createdImages } from '../../apiMocks/handlers/image/imageHandlerReponse';
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
  it('api を通じて JSON 形式の全画像データを取得できる', async () => {
    const apiRepository = new ApiImageRepository('http://localhost:8000');

    const image = new Image(createUUIDv4(), 'path');
    await apiRepository.save(image);

    const resp = await apiRepository.findAll();
    resp.forEach((image, i) => {
      expect(image.id).toBe(createdImages[i].id);
      expect(image.path).toBe(createdImages[i].path);
    });
  });
});
