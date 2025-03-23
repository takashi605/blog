import type { ImageRepository } from 'service/src/imageService/repository/imageRepository';
import { mockImageDTO } from 'service/src/mockData/mockImageDTO';
import { mockImageRepository } from 'service/src/mockData/mockImageRepository';
import { setupMockApiForServer } from 'shared-interface-adapter/src/apiMocks/serverForNode';
import { CreateImageUseCase } from './createImage';

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

describe('ユースケース: 画像のアップロード', () => {
  it('ユースケースを実行すると画像データを生成してデータリポジトリへ保存する', async () => {
    const mockSave = jest.fn().mockReturnValue(mockImageDTO);
    const mockRepository: ImageRepository = {
      ...mockImageRepository,
      save: mockSave,
    };

    const createImageUseCase = new CreateImageUseCase(
      mockImageDTO,
      mockRepository,
    );

    const createdImage = await createImageUseCase.execute();

    expect(mockRepository.save).toHaveBeenCalledTimes(1);

    expect(createdImage.id).toBeDefined();
    expect(createdImage.path).toBeDefined();
  });
});
