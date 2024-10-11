import { server } from '@/apiMock/server';
import ViewBlogPostController from '@/components/controllers/blogPost/ViewBlogPostController';
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
      const h2Elements = screen.getAllByRole('heading', { level: 2 });
      expect(h2Elements).not.toHaveLength(0);

      h2Elements.forEach((h2) => {
        expect(h2.textContent).toBe('h2');
      });
    });
  });
});
