import { mockApiForServer } from '@/apiMock/server';
import { useViewBlogPostController } from '@/components/models/blogPost/controllers/viewBlogPostControllerHooks';
import { renderHook, waitFor } from '@testing-library/react';

beforeAll(() => {
  mockApiForServer.listen();
});
afterEach(async () => {
  mockApiForServer.resetHandlers();
});
afterAll(() => {
  mockApiForServer.close();
});

describe('カスタムフック: useViewBlogPostController', () => {
  it('記事タイトルが取得できる', async () => {
    const { result } = renderHook(() => useViewBlogPostController(1));
    await waitFor(() => {
      if (result.current === null) {
        throw new Error('投稿記事が取得できませんでした');
      }
      expect(result.current.title).not.toBe('');
    });
  });

  describe('コンテンツ', () => {
    it('h2 が取得できる', async () => {
      const { result } = renderHook(() => useViewBlogPostController(1));
      await waitFor(() => {
        if (result.current === null) {
          throw new Error('投稿記事が取得できませんでした');
        }
        expect(result.current.contents).not.toHaveLength(0);
        expectContainH2TypeContent();

        function expectContainH2TypeContent() {
          expect(
            result.current.contents.some((content) => content.type === 'h2'),
          ).toBe(true);
        }
      });
    });

    it('h3 が取得できる', async () => {
      const { result } = renderHook(() => useViewBlogPostController(1));
      await waitFor(() => {
        if (result.current === null) {
          throw new Error('投稿記事が取得できませんでした');
        }
        expect(result.current.contents).not.toHaveLength(0);
        expectContainH3TypeContent();

        function expectContainH3TypeContent() {
          expect(
            result.current.contents.some((content) => content.type === 'h3'),
          ).toBe(true);
        }
      });
    });

    it('paragraph が取得できる', async () => {
      const { result } = renderHook(() => useViewBlogPostController(1));
      await waitFor(() => {
        if (result.current === null) {
          throw new Error('投稿記事が取得できませんでした');
        }
        expect(result.current.contents).not.toHaveLength(0);
        expectContainParagraphTypeContent();

        function expectContainParagraphTypeContent() {
          expect(
            result.current.contents.some(
              (content) => content.type === 'paragraph',
            ),
          ).toBe(true);
        }
      });
    });
  });
});
