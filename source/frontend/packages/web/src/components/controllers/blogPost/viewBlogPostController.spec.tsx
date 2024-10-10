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
    const title = screen.getByRole('heading');
    expect(title).toBeInTheDocument();

    await waitFor(() => {
      expect(title.textContent).not.toBe('');
    });
  });
});
