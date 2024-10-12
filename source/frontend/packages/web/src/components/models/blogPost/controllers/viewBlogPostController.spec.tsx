import { mockApiForServer } from '@/apiMock/serverForNode';
import ViewBlogPostController from '@/components/models/blogPost/controllers/ViewBlogPostController';
import { fetchBlogPost } from '@/components/models/blogPost/services/fetchBlogPost';
import ContentRenderer from '@/components/models/blogPost/ui/contents/Content';
import type { ViewBlogPost } from '@/usecases/view/output';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { useCallback, useEffect, useState } from 'react';

beforeAll(() => {
  mockApiForServer.listen();
});
afterEach(async () => {
  mockApiForServer.resetHandlers();
});
afterAll(() => {
  mockApiForServer.close();
});

const renderTestComponent = () =>
  render(<ViewBlogPostControllerWithDependencies />);

// テスト対象コンポーネントと依存するコンポーネントやロジックを
// まとめたコンポーネント
function ViewBlogPostControllerWithDependencies() {
  const [blogPost, setBlogPost] = useState<ViewBlogPost | null>(null);

  const execFetch = useCallback(async () => {
    const blogPost = await fetchBlogPost(1);
    setBlogPost(blogPost);
  }, []);

  useEffect(() => {
    execFetch();
  }, [execFetch]);

  return (
    <ViewBlogPostController
      blogPost={blogPost}
      ContentComponent={ContentRenderer}
    />
  );
}

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
