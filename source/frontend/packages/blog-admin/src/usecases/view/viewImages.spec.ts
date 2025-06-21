import type { ImageRepository } from 'service/src/imageService/repository/imageRepository';
import { mockImageListDTO } from 'service/src/mockData/mockImageDTO';
import { mockImageRepository } from 'service/src/mockData/mockImageRepository';
import { setupMockApiForServer } from 'shared-lib/src/apiMocks/serverForNode';
import { ViewImagesUseCase } from './viewImages';

const mockApiForServer = setupMockApiForServer(
  process.env.NEXT_PUBLIC_API_URL!,
);
beforeAll(() => {
  mockApiForServer.listen();
});
afterEach(async () => {
  mockApiForServer.resetHandlers();
});
afterAll(() => {
  mockApiForServer.close();
});

describe('ユースケース: 画像の一覧取得', () => {
  it('ユースケースを実行するとデータリポジトリから全ての画像データを取得する', async () => {
    const mockFetchAll = jest.fn().mockReturnValue(mockImageListDTO);
    const mockRepository: ImageRepository = {
      ...mockImageRepository,
      findAll: mockFetchAll,
    };

    const createImageUseCase = new ViewImagesUseCase(mockRepository);

    const fetchedImages = await createImageUseCase.execute();

    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);

    mockImageListDTO.forEach((imageDTO, i) => {
      expect(fetchedImages[i].id).toBe(imageDTO.id);
      expect(fetchedImages[i].path).toBe(imageDTO.path);
    });
  });
});
