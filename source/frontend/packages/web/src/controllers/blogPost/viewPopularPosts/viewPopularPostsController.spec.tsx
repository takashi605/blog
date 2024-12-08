import { render, screen } from '@testing-library/react';
import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import { setupMockApiForServer } from 'shared-interface-adapter/src/apiMocks/serverForNode';
import ViewPopularPostsController from './ViewPopularPostsController';

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

const renderController = async () => render(await ViewPopularPostsController());

describe('viewPopularPosts', () => {
  it('props に3件分の記事データが渡されたコンポーネントを返却する', async () => {
    const { props } = await ViewPopularPostsController();
    const blogPostsDTO: BlogPostDTO[] = props.blogPostsDTO;
    expect(blogPostsDTO).toHaveLength(3);
    blogPostsDTO.forEach((blogPostDTO) => {
      expect(blogPostDTO.title).toBeDefined();
      expect(blogPostDTO.thumbnail).toBeDefined();
      expect(blogPostDTO.postDate).toBeDefined();
      expect(blogPostDTO.contents).toBeDefined();
    });
  });

  it('記事のタイトルが3件分表示されている', async () => {
    await renderController();
    const titles = screen.getAllByRole('heading', { level: 3 });
    expect(titles).toHaveLength(3);
  });

  it('記事のサムネイル画像が3件分表示されている', async () => {
    await renderController();
    const thumbnails = await screen.findAllByRole('img', {
      name: 'サムネイル画像',
    });
    expect(thumbnails).toHaveLength(3);
  });
});
