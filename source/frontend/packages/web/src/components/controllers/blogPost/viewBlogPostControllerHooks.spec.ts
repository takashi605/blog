import { server } from '@/apiMock/server';
import { useViewBlogPostController } from '@/components/controllers/blogPost/viewBlogPostControllerHooks';
import { renderHook, waitFor } from '@testing-library/react';

beforeAll(() => {
  server.listen();
});
afterEach(async () => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

describe('カスタムフック: useViewBlogPostController', () => {
  it('記事タイトルが取得できる', async () => {
    const { result } = renderHook(() => useViewBlogPostController());
    await waitFor(() => {
      expect(result.current.title).not.toBe('');
    });
  });
});
