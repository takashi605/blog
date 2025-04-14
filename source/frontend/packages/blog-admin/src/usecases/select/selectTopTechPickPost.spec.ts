import type { BlogPost } from 'entities/src/blogPost';
import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import { blogPostDTOToEntity } from 'service/src/blogPostService/dto/blogPostDTOToEntity';
import type { BlogPostRepository } from 'service/src/blogPostService/repository/blogPostRepository';
import { mockBlogPostDTO } from 'service/src/mockData/mockBlogPostDTO';
import { mockBlogPostRepository } from 'service/src/testUtils/blogPostRepositoryMock';
import { createUUIDv4 } from 'service/src/utils/uuid';
import { setupMockApiForServer } from 'shared-interface-adapter/src/apiMocks/serverForNode';
import { SelectTopTechPickPostUseCase } from './selectTopTechPickPost';

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

describe('ユースケース: トップテックピック記事の選択', () => {
  it('ユースケースを実行するとデータリポジトリ内のトップテックピック記事が新しいものに更新される', async () => {
    const newTopTechPickPostDTOMock: BlogPostDTO =
      createNewTopTechPickPostDTOMock();
    const mockRepository: BlogPostRepository = {
      ...mockBlogPostRepository,
      updateTopTechPickPost: jest
        .fn()
        .mockResolvedValue(newTopTechPickPostDTOMock),
    };

    const selectTopTechPickPostUseCase = new SelectTopTechPickPostUseCase(
      newTopTechPickPostDTOMock,
      mockRepository,
    );

    const selectedTopTechPickPost =
      await selectTopTechPickPostUseCase.execute();

    expect(mockRepository.updateTopTechPickPost).toHaveBeenCalledTimes(1);
    expect(mockRepository.updateTopTechPickPost).toHaveBeenCalledWith(
      convertToEntity(newTopTechPickPostDTOMock),
    );

    expect(selectedTopTechPickPost).toEqual(newTopTechPickPostDTOMock);
  });
});

// ヘルパー関数
function createNewTopTechPickPostDTOMock(): BlogPostDTO {
  return {
    ...mockBlogPostDTO,
    id: createUUIDv4(),
    title: '新しい記事タイトル1',
  };
}

function convertToEntity(blogPostDTO: BlogPostDTO): BlogPost {
  return blogPostDTOToEntity(blogPostDTO);
}
