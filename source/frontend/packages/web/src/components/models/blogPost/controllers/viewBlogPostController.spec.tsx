import { server } from '@/apiMock/server';
import ViewBlogPostController from '@/components/models/blogPost/controllers/ViewBlogPostController';
import ContentRenderer from '@/components/models/blogPost/elements/contents/Content';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';

beforeAll(() => {
  server.listen();
});
afterEach(async () => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

const renderTestComponent = () =>
  render(<ViewBlogPostController ContentComponent={ContentRenderer} />);

describe('コンポーネント: viewBlogPostController', () => {
  it('記事タイトルが表示されている', async () => {
    renderTestComponent();
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toBeInTheDocument();

    await waitFor(() => {
      expect(title.textContent).not.toBe('');
    });
  });

  describe('Content コンポーネントとの結合テスト', () => {
    it('h2 が表示されている', async () => {
      renderTestComponent();

      const h2 = await screen.findAllByRole('heading', { level: 2 });
      expect(h2).not.toHaveLength(0);
    });

    it('h3 が表示されている', async () => {
      renderTestComponent();

      const h3 = await screen.findAllByRole('heading', { level: 3 });
      expect(h3).not.toHaveLength(0);
    });

    it('p が表示されている', async () => {
      renderTestComponent();

      const p = await screen.findAllByRole('paragraph');
      expect(p).not.toHaveLength(0);
    });
  });
});
