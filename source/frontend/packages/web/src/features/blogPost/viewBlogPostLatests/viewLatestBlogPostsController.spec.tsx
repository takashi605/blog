import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { setupMockApiForServer } from 'shared-lib/src/apiMocks/serverForNode';
import ViewLatestBlogPostsController from './ViewLatestBlogPostsController';

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

const renderController = (quantity?: number) =>
  render(<ViewLatestBlogPostsController quantity={quantity} />);

describe('コンポーネント: ViewLatestBlogPostsController', () => {
  it('新着記事のタイトルが表示されている', async () => {
    renderController();
    const sectionTitle = await screen.findByText('新着記事');
    expect(sectionTitle).toBeInTheDocument();
  });

  it('記事データが表示されている', async () => {
    renderController();

    // 記事リンクが表示されるまで待機
    const postLinks = await screen.findAllByRole('link');
    expect(postLinks.length).toBeGreaterThan(0);

    // 最初の記事のタイトルが表示されるまで待機
    await waitFor(() => {
      const titles = screen.getAllByRole('heading', { level: 3 });
      expect(titles.length).toBeGreaterThan(0);
      expect(titles[0].textContent).not.toBe('');
    });
  });

  it('取得するデータ数を指定した場合、その数だけの記事データが表示される', async () => {
    renderController(2);

    // 記事が表示されるまで待機
    await waitFor(async () => {
      const postLinks = await screen.findAllByRole('link');
      expect(postLinks).toHaveLength(2);
    });
  });

  it('サムネイル画像が表示されている', async () => {
    renderController();

    const thumbnails = await screen.findAllByRole('img', {
      name: 'サムネイル画像',
    });
    expect(thumbnails.length).toBeGreaterThan(0);
  });

  it('投稿日が表示されている', async () => {
    renderController();

    const postDates = await screen.findAllByText(/投稿日:/);
    expect(postDates.length).toBeGreaterThan(0);
  });
});
