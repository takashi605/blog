import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import { setupMockApiForServer } from 'shared-interface-adapter/src/apiMocks/serverForNode';
import ViewPickUpPostsController from './ViewPickUpPostsController';

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

describe('viewPickUpPosts', () => {
  it('props に3件分の記事データが渡されたコンポーネントを返却する', async () => {
    const { props } = await ViewPickUpPostsController();
    const blogPostsDTO: BlogPostDTO[] = props.blogPostsDTO;
    expect(blogPostsDTO).toHaveLength(3);
    blogPostsDTO.forEach((blogPostDTO) => {
      expect(blogPostDTO.title).toBeDefined();
      expect(blogPostDTO.thumbnail).toBeDefined();
      expect(blogPostDTO.postDate).toBeDefined();
      expect(blogPostDTO.contents).toBeDefined();
    });
  });
});
