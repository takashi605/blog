import { fetchBlogPost } from '@/components/models/blogPost/services/fetchBlogPost';
import ViewBlogPostController from '@/components/models/blogPost/view/controllers/ViewBlogPostController';
import '@testing-library/jest-dom';
import { render, screen, waitFor, within } from '@testing-library/react';
import { setupMockApiForServer } from 'shared-interface-adapter/src/apiMocks/serverForNode';

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

const renderTestComponent = async () =>
  render(await ViewBlogPostControllerWithDependencies());

// テスト対象コンポーネントと依存するコンポーネントやロジックを
// まとめたコンポーネント
async function ViewBlogPostControllerWithDependencies() {
  const blogPost = await fetchBlogPost(1);
  return <ViewBlogPostController blogPost={blogPost} />;
}

describe('コンポーネント: viewBlogPostController', () => {
  it('記事タイトルが表示されている', async () => {
    await renderTestComponent();
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toBeInTheDocument();

    // タイトルが取得できるまで待機し、空文字でないことを確認
    await waitFor(() => {
      expect(title.textContent).not.toBe('');
    });
  });

  it('サムネイル画像が表示されている', async () => {
    await renderTestComponent();
    const mainVisual = screen.getByRole('img', {
      name: 'サムネイル画像',
    }) as HTMLImageElement;
    expect(mainVisual).toBeInTheDocument();

    // サムネイル画像が取得できるまで待機し、path が空文字でないことを確認
    // TODO localhost/ は環境によって変わるため、動的に取得するように修正する
    await waitFor(() => {
      expect(mainVisual.src.replace('http://localhost/', '')).not.toBe('');
    });
  });

  it('投稿日,更新日が表示されている', async () => {
    await renderTestComponent();

    const postDateSection = screen.getByText('投稿日:');

    if (postDateSection) {
      const { findByText } = within(postDateSection);
      expect(await findByText('投稿日:')).toBeInTheDocument();
      expect(await findByText(/\d{4}\/\d{1,2}\/\d{1,2}/)).toBeInTheDocument();
    }

    const updateDateSection = screen.getByText('更新日:');

    if (updateDateSection) {
      const { findByText } = within(updateDateSection);
      expect(await findByText('更新日:')).toBeInTheDocument();
      expect(await findByText(/\d{4}\/\d{1,2}\/\d{1,2}/)).toBeInTheDocument();
    }
  });

  describe('コンテンツ', () => {
    it('h2 が表示されている', async () => {
      await renderTestComponent();

      const h2 = await screen.findAllByRole('heading', { level: 2 });
      expect(h2).not.toHaveLength(0);
    });

    it('h3 が表示されている', async () => {
      await renderTestComponent();

      const h3 = await screen.findAllByRole('heading', { level: 3 });
      expect(h3).not.toHaveLength(0);
    });

    it('p が表示されている', async () => {
      await renderTestComponent();

      const p = await screen.findAllByRole('paragraph');
      expect(p).not.toHaveLength(0);
    });

    it('画像が表示されている', async () => {
      await renderTestComponent();

      const img = await screen.findAllByRole('img', { name: '画像コンテンツ' });
      expect(img).not.toHaveLength(0);
    });
  });
});
