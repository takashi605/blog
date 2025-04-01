import type { BlogPost } from 'entities/src/blogPost';
import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import { blogPostDTOToEntity } from 'service/src/blogPostService/dto/blogPostDTOToEntity';
import type { BlogPostRepository } from 'service/src/blogPostService/repository/blogPostRepository';
import { mockBlogPostDTO } from 'service/src/mockData/mockBlogPostDTO';
import { mockBlogPostRepository } from 'service/src/testUtils/blogPostRepositoryMock';
import { createUUIDv4 } from 'service/src/utils/uuid';
import { setupMockApiForServer } from 'shared-interface-adapter/src/apiMocks/serverForNode';
import { SelectPopularPostsUseCase } from './selectPopularPosts';

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

describe('ユースケース: 人気記事の選択', () => {
  it('ユースケースを実行するとデータリポジトリ内の人気記事が新しいものに更新される', async () => {
    const newPopularPostsDTOMock: BlogPostDTO[] = createNewPopularPostsDTOMock();
    const mockRepository: BlogPostRepository = {
      ...mockBlogPostRepository,
      updatePopularPosts: jest.fn().mockResolvedValue(newPopularPostsDTOMock),
    };

    const selectPopularPostsUseCase = new SelectPopularPostsUseCase(
      newPopularPostsDTOMock,
      mockRepository,
    );

    const selectedPopularPosts = await selectPopularPostsUseCase.execute();

    expect(mockRepository.updatePopularPosts).toHaveBeenCalledTimes(1);
    expect(mockRepository.updatePopularPosts).toHaveBeenCalledWith(
      convertEntity(newPopularPostsDTOMock),
    );

    expect(selectedPopularPosts).toEqual(newPopularPostsDTOMock);
  });
});

// ヘルパー関数
function createNewPopularPostsDTOMock(): BlogPostDTO[] {
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

function convertEntity(blogPostsDTO: BlogPostDTO[]): BlogPost[] {
  return blogPostsDTO.map((blogPostDTO) => {
    return blogPostDTOToEntity(blogPostDTO);
  });
}
