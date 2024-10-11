import { server } from '@/apiMock/server';
import ViewBlogPostController from '@/components/models/blogPost/ViewBlogPostController';
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

describe('コンポーネント: viewBlogPostController', () => {
  it('記事タイトルが表示されている', async () => {
    render(<ViewBlogPostController />);
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toBeInTheDocument();

    await waitFor(() => {
      expect(title.textContent).not.toBe('');
    });
  });

  describe('コンテンツ', () => {
    it('h2 が表示されている', async () => {
      render(<ViewBlogPostController />);

      const h2 = await screen.findAllByRole('heading', { level: 2 });
      expect(h2).not.toHaveLength(0);
    });

    it('h3 が表示されている', async () => {
      render(<ViewBlogPostController />);

      const h3 = await screen.findAllByRole('heading', { level: 3 });
      expect(h3).not.toHaveLength(0);
    });

    it('p が表示されている', async () => {
      render(<ViewBlogPostController />);

      const p = await screen.findAllByRole('paragraph');
      expect(p).not.toHaveLength(0);
    });
  });
});
