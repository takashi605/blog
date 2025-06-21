/**
 * useViewLatestBlogPostsフックのテスト
 */

import { renderHook, waitFor } from '@testing-library/react';
import { setupMockApiForServer } from 'shared-lib/src/apiMocks/serverForNode';
import { useViewLatestBlogPosts } from './useViewLatestBlogPosts';

const mockApiForServer = setupMockApiForServer(
  process.env.NEXT_PUBLIC_API_URL!,
);

beforeAll(() => {
  mockApiForServer.listen();
});

afterEach(() => {
  mockApiForServer.resetHandlers();
});

afterAll(() => {
  mockApiForServer.close();
});

describe('useViewLatestBlogPosts', () => {
  it('最新記事一覧データを正常に取得できる', async () => {
    const { result } = renderHook(() => useViewLatestBlogPosts());

    expect(result.current.loading).toBe(true);
    expect(result.current.blogPosts).toEqual([]);
    expect(result.current.error).toBeNull();

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
      },
      { timeout: 3000 },
    );

    expect(result.current.blogPosts).toBeTruthy();
    expect(result.current.blogPosts.length).toBeGreaterThan(0);
    expect(result.current.error).toBeNull();

    // 取得したデータの構造を検証
    const firstPost = result.current.blogPosts[0];
    expect(firstPost.id).toBeDefined();
    expect(firstPost.title).toBeDefined();
    expect(firstPost.postDate).toBeDefined();
    expect(firstPost.thumbnail).toBeDefined();
    expect(firstPost.contents).toBeDefined();
  });

  it('quantityパラメータで記事数を制限できる', async () => {
    const quantity = 2;
    const { result } = renderHook(() => useViewLatestBlogPosts({ quantity }));

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
      },
      { timeout: 3000 },
    );

    expect(result.current.blogPosts).toHaveLength(quantity);
    expect(result.current.error).toBeNull();
  });

  it('quantity=0の場合は空配列を返す', async () => {
    const { result } = renderHook(() =>
      useViewLatestBlogPosts({ quantity: 0 }),
    );

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
      },
      { timeout: 3000 },
    );

    expect(result.current.blogPosts).toHaveLength(0);
    expect(result.current.error).toBeNull();
  });

  it('quantityが全記事数より大きい場合は全記事を返す', async () => {
    const { result } = renderHook(() =>
      useViewLatestBlogPosts({ quantity: 999 }),
    );

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
      },
      { timeout: 3000 },
    );

    // 全記事数を返している（制限されていない）
    expect(result.current.blogPosts.length).toBeGreaterThan(0);
    expect(result.current.error).toBeNull();
  });

  it('enabled=falseの場合はリクエストを送信しない', () => {
    const { result } = renderHook(() =>
      useViewLatestBlogPosts({ enabled: false }),
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.blogPosts).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('環境変数NEXT_PUBLIC_API_URLが設定されていない場合のエラーハンドリング', async () => {
    const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;
    delete process.env.NEXT_PUBLIC_API_URL;

    const { result } = renderHook(() => useViewLatestBlogPosts());

    // useEffectが実行されてステートが更新されるまで待機
    await waitFor(() => {
      expect(result.current.error).toBe(
        '環境変数 NEXT_PUBLIC_API_URL が設定されていません',
      );
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.blogPosts).toHaveLength(0);

    // 環境変数を復元
    process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
  });

  it('quantityパラメータの変更でリクエストが再実行される', async () => {
    const { result, rerender } = renderHook(
      ({ quantity }) => useViewLatestBlogPosts({ quantity }),
      { initialProps: { quantity: 1 } },
    );

    // 最初のリクエスト完了を待機
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.blogPosts).toHaveLength(1);

    // quantityを変更
    rerender({ quantity: 3 });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.blogPosts).toHaveLength(3);
  });

  it('enabledパラメータの変更でリクエストが制御される', async () => {
    const { result, rerender } = renderHook(
      ({ enabled }) => useViewLatestBlogPosts({ enabled }),
      { initialProps: { enabled: false } },
    );

    // enabled=falseの場合はリクエストされない
    expect(result.current.loading).toBe(false);
    expect(result.current.blogPosts).toHaveLength(0);

    // enabled=trueに変更
    rerender({ enabled: true });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.blogPosts.length).toBeGreaterThan(0);
  });
});
