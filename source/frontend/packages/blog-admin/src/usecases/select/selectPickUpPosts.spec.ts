import type { BlogPost } from 'entities/src/blogPost';
import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import { blogPostDTOToEntity } from 'service/src/blogPostService/dto/blogPostDTOToEntity';
import type { BlogPostRepository } from 'service/src/blogPostService/repository/blogPostRepository';
import { mockBlogPostDTO } from 'service/src/mockData/mockBlogPostDTO';
import { mockBlogPostRepository } from 'service/src/testUtils/blogPostRepositoryMock';
import { createUUIDv4 } from 'service/src/utils/uuid';
import { setupMockApiForServer } from 'shared-interface-adapter/src/apiMocks/serverForNode';
import { SelectPickUpPostsUseCase } from './selectPickUpPosts';

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

describe('ユースケース: ピックアップ記事の選択', () => {
  it('ユースケースを実行するとデータリポジトリ内のピックアップ記事が新しいものに更新される', async () => {
    const newPickUpPostsDTOMock: BlogPostDTO[] = createNewPickUpPostsDTOMock();
    const mockRepository: BlogPostRepository = {
      ...mockBlogPostRepository,
      updatePickUpPosts: jest.fn().mockResolvedValue(newPickUpPostsDTOMock),
    };

    const selectPickUpPostsUseCase = new SelectPickUpPostsUseCase(
      newPickUpPostsDTOMock,
      mockRepository,
    );

    const selectedPickUpPosts = await selectPickUpPostsUseCase.execute();

    expect(mockRepository.updatePickUpPosts).toHaveBeenCalledTimes(1);
    expect(mockRepository.updatePickUpPosts).toHaveBeenCalledWith(
      convertToEntities(newPickUpPostsDTOMock),
    );

    expect(selectedPickUpPosts).toEqual(newPickUpPostsDTOMock);
  });
});

// ヘルパー関数
function createNewPickUpPostsDTOMock(): BlogPostDTO[] {
  return [
    {
      ...mockBlogPostDTO,
      id: createUUIDv4(),
      title: '新しい記事タイトル1',
    },
    {
      ...mockBlogPostDTO,
      id: createUUIDv4(),
      title: '新しい記事タイトル2',
    },
    {
      ...mockBlogPostDTO,
      id: createUUIDv4(),
      title: '新しい記事タイトル3',
    },
  ];
}

function convertToEntities(blogPostsDTO: BlogPostDTO[]): BlogPost[] {
  return blogPostsDTO.map((blogPostDTO) => {
    return blogPostDTOToEntity(blogPostDTO);
  });
}
