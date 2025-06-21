import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import type { BlogPost } from 'shared-lib/src/api';
import ViewLatestBlogPostsController from './ViewLatestBlogPostsController';

// shared-lib/src/api のモック
jest.mock('shared-lib/src/api', () => ({
  api: {
    get: jest.fn(),
  },
}));

const mockGet = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const api = require('shared-lib/src/api').api;
  api.get = mockGet;
});

const mockBlogPosts: BlogPost[] = [
  {
    id: 'post-1',
    title: 'テスト記事1',
    thumbnail: { id: 'thumb-1', path: 'https://example.com/thumb1.jpg' },
    postDate: '2024-01-01',
    lastUpdateDate: '2024-01-01',
    contents: [],
  },
  {
    id: 'post-2',
    title: 'テスト記事2',
    thumbnail: { id: 'thumb-2', path: 'https://example.com/thumb2.jpg' },
    postDate: '2024-01-02',
    lastUpdateDate: '2024-01-02',
    contents: [],
  },
  {
    id: 'post-3',
    title: 'テスト記事3',
    thumbnail: { id: 'thumb-3', path: 'https://example.com/thumb3.jpg' },
    postDate: '2024-01-03',
    lastUpdateDate: '2024-01-03',
    contents: [],
  },
];

const renderController = async (quantity?: number) => {
  mockGet.mockResolvedValue(mockBlogPosts);
  const ControllerComponent = await ViewLatestBlogPostsController({ quantity });
  return render(ControllerComponent);
};

describe('コンポーネント: ViewLatestBlogPostsController', () => {
  it('新着記事のタイトルが表示されている', async () => {
    await renderController();
    expect(mockGet).toHaveBeenCalledWith('/api/v2/blog/posts/latest');

    const sectionTitle = screen.getByText('新着記事');
    expect(sectionTitle).toBeInTheDocument();
  });

  it('記事データが表示されている', async () => {
    await renderController();

    // 記事リンクが表示されることを確認
    const postLinks = screen.getAllByRole('link');
    expect(postLinks.length).toBeGreaterThan(0);

    // 記事のタイトルが表示されることを確認
    const titles = screen.getAllByRole('heading', { level: 3 });
    expect(titles.length).toBeGreaterThan(0);
    expect(titles[0].textContent).not.toBe('');
  });

  it('取得するデータ数を指定した場合、その数だけの記事データが表示される', async () => {
    await renderController(2);

    expect(mockGet).toHaveBeenCalledWith('/api/v2/blog/posts/latest');

    // 2件の記事リンクが表示されることを確認
    const postLinks = screen.getAllByRole('link');
    expect(postLinks).toHaveLength(2);
  });

  it('サムネイル画像が表示されている', async () => {
    await renderController();

    const thumbnails = screen.getAllByRole('img', {
      name: 'サムネイル画像',
    });
    expect(thumbnails.length).toBeGreaterThan(0);
  });

  it('投稿日が表示されている', async () => {
    await renderController();

    const postDates = screen.getAllByText(/投稿日:/);
    expect(postDates.length).toBeGreaterThan(0);
  });

  it('APIエラー時にエラーメッセージが表示される', async () => {
    mockGet.mockRejectedValue(new Error('API Error'));

    const ControllerComponent = await ViewLatestBlogPostsController({});
    render(ControllerComponent);

    const errorMessage = screen.getByText('最新記事の読み込みに失敗しました');
    expect(errorMessage).toBeInTheDocument();
  });

  it('quantityが未指定の場合は全件を表示する', async () => {
    await renderController();

    expect(mockGet).toHaveBeenCalledWith('/api/v2/blog/posts/latest');

    // 全3件の記事リンクが表示されることを確認
    const postLinks = screen.getAllByRole('link');
    expect(postLinks).toHaveLength(3);
  });
});
