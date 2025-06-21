/**
 * useViewBlogPostフックのテスト
 */

import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupMockApiForServer } from 'shared-lib/src/apiMocks/serverForNode';
import { UUIDList } from 'shared-test-data';
import { useViewBlogPost } from './useViewBlogPost';

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

describe('useViewBlogPost', () => {
  it('記事データを正常に取得できる', async () => {
    const { result } = renderHook(() => useViewBlogPost(UUIDList.UUID1));

    expect(result.current.loading).toBe(true);
    expect(result.current.blogPost).toBeNull();
    expect(result.current.error).toBeNull();

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
      },
      { timeout: 3000 },
    );

    expect(result.current.blogPost).toBeTruthy();
    expect(result.current.error).toBeNull();
  });

  it('記事が見つからない場合(404)のエラーハンドリング', async () => {
    mockApiForServer.use(
      http.get(`${process.env.NEXT_PUBLIC_API_URL}/blog/posts/:uuid`, () => {
        return new HttpResponse('Not found', {
          status: 404,
        });
      }),
    );

    const { result } = renderHook(() => useViewBlogPost('not-found-id'));

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
      },
      { timeout: 3000 },
    );

    expect(result.current.blogPost).toBeNull();
    expect(result.current.error).toBe('記事が見つかりませんでした');
  });

  it('その他のHTTPエラーのハンドリング', async () => {
    mockApiForServer.use(
      http.get(`${process.env.NEXT_PUBLIC_API_URL}/blog/posts/:uuid`, () => {
        return HttpResponse.json({ message: 'Bad Request' }, { status: 400 });
      }),
    );

    const { result } = renderHook(() => useViewBlogPost('error-id'));

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
      },
      { timeout: 3000 },
    );

    expect(result.current.blogPost).toBeNull();
    expect(result.current.error).toBe('Bad Request');
  });

  it('ネットワークエラーのハンドリング', async () => {
    mockApiForServer.use(
      http.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v2/blog/posts/:uuid`,
        () => {
          return HttpResponse.error();
        },
      ),
    );

    const { result } = renderHook(() => useViewBlogPost('network-error-id'));

    // ネットワークエラーの場合、リトライが発生するため長いタイムアウトを設定
    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
      },
      { timeout: 15000 }, // リトライ3回 + タイムアウトを考慮
    );

    expect(result.current.blogPost).toBeNull();
    expect(result.current.error).toBeTruthy();
  }, 20000); // Jestのテストタイムアウトも増やす

  it('enabled=falseの場合はリクエストを送信しない', () => {
    const { result } = renderHook(() =>
      useViewBlogPost('test-id', { enabled: false }),
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.blogPost).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('postIdが空の場合はリクエストを送信しない', () => {
    const { result } = renderHook(() => useViewBlogPost(''));

    expect(result.current.loading).toBe(false);
    expect(result.current.blogPost).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
