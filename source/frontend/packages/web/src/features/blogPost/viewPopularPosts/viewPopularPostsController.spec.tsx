import { render, screen } from '@testing-library/react';
import type { BlogPost } from 'shared-lib/src/api/types';
import { setupMockApiForServer } from 'shared-lib/src/apiMocks/serverForNode';
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
    const blogPosts: BlogPost[] = props.blogPosts;
    expect(blogPosts).toHaveLength(3);
    blogPosts.forEach((blogPost) => {
      expect(blogPost.title).toBeDefined();
      expect(blogPost.thumbnail).toBeDefined();
      expect(blogPost.postDate).toBeDefined();
      expect(blogPost.contents).toBeDefined();
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
