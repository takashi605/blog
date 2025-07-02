/**
 * @jest-environment jsdom
 */

import { act, renderHook } from '@testing-library/react';
import type { BlogPost } from 'shared-lib/src/api';
import { HttpError } from 'shared-lib/src/api';
import { useCreateBlogPost } from './useCreateBlogPost';

// shared-lib/src/api のモック
jest.mock('shared-lib/src/api', () => {
  class MockHttpError extends Error {
    status: number;

    constructor(message: string, status: number) {
      super(message);
      this.name = 'HttpError';
      this.status = status;
    }
  }

  return {
    api: {
      post: jest.fn(),
    },
    HttpError: MockHttpError,
  };
});

const mockPost = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const api = require('shared-lib/src/api').api;
  api.post = mockPost;
});

describe('useCreateBlogPost', () => {
  const mockBlogPost: BlogPost = {
    id: '12345678-1234-1234-1234-123456789012',
    title: 'テスト記事',
    thumbnail: {
      id: 'thumbnail-id',
      path: 'https://example.com/thumbnail.jpg',
    },
    postDate: '2024-01-01',
    lastUpdateDate: '2024-01-01',
    publishedDate: '2024-01-01',
    contents: [
      {
        type: 'paragraph',
        id: 'paragraph-id',
        text: [
          {
            text: 'テストコンテンツ',
            styles: { bold: false, inlineCode: false },
            link: null,
          },
        ],
      },
    ],
  };

  it('正常に記事を投稿できること', async () => {
    mockPost.mockResolvedValueOnce(mockBlogPost);

    const { result } = renderHook(() => useCreateBlogPost());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.blogPost).toBe(null);

    let createdPost: BlogPost | undefined;
    await act(async () => {
      createdPost = await result.current.createBlogPost(mockBlogPost);
    });

    expect(mockPost).toHaveBeenCalledWith(
      '/api/admin/blog/posts',
      mockBlogPost,
    );
    expect(createdPost).toEqual(mockBlogPost);
    expect(result.current.loading).toBe(true); // 成功時はページ遷移があるためloadingをtrueのままにする
    expect(result.current.error).toBe(null);
    expect(result.current.blogPost).toEqual(mockBlogPost);
  });

  it('投稿中はローディング状態になること', async () => {
    let resolvePromise: (value: BlogPost) => void;
    const promise = new Promise<BlogPost>((resolve) => {
      resolvePromise = resolve;
    });
    mockPost.mockReturnValueOnce(promise);

    const { result } = renderHook(() => useCreateBlogPost());

    act(() => {
      result.current.createBlogPost(mockBlogPost);
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);

    await act(async () => {
      resolvePromise!(mockBlogPost);
      await promise;
    });

    expect(result.current.loading).toBe(true); // 成功時はページ遷移があるためloadingをtrueのままにする
  });

  it('400エラーの場合は入力エラーメッセージを表示すること', async () => {
    const error = new HttpError('Bad Request', 400);
    mockPost.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useCreateBlogPost());

    await act(async () => {
      try {
        await result.current.createBlogPost(mockBlogPost);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect((e as Error).message).toBe('入力内容に誤りがあります');
      }
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('入力内容に誤りがあります');
    expect(result.current.blogPost).toBe(null);
  });

  it('409エラーの場合は重複エラーメッセージを表示すること', async () => {
    const error = new HttpError('Conflict', 409);
    mockPost.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useCreateBlogPost());

    await act(async () => {
      try {
        await result.current.createBlogPost(mockBlogPost);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect((e as Error).message).toBe('記事IDが既に存在します');
      }
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('記事IDが既に存在します');
    expect(result.current.blogPost).toBe(null);
  });

  it('その他のHTTPエラーの場合は汎用エラーメッセージを表示すること', async () => {
    const error = new HttpError('Internal Server Error', 500);
    mockPost.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useCreateBlogPost());

    await act(async () => {
      try {
        await result.current.createBlogPost(mockBlogPost);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect((e as Error).message).toBe(
          '記事の投稿に失敗しました: Internal Server Error',
        );
      }
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(
      '記事の投稿に失敗しました: Internal Server Error',
    );
    expect(result.current.blogPost).toBe(null);
  });

  it('一般的なエラーの場合はエラーメッセージを表示すること', async () => {
    const error = new Error('Network error');
    mockPost.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useCreateBlogPost());

    await act(async () => {
      try {
        await result.current.createBlogPost(mockBlogPost);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect((e as Error).message).toBe(
          '記事の投稿に失敗しました: Network error',
        );
      }
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(
      '記事の投稿に失敗しました: Network error',
    );
    expect(result.current.blogPost).toBe(null);
  });

  it('resetErrorでエラーをクリアできること', async () => {
    const error = new HttpError('Bad Request', 400);
    mockPost.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useCreateBlogPost());

    await act(async () => {
      try {
        await result.current.createBlogPost(mockBlogPost);
      } catch (e) {
        // エラーをキャッチして無視
      }
    });

    expect(result.current.error).toBe('入力内容に誤りがあります');

    act(() => {
      result.current.resetError();
    });

    expect(result.current.error).toBe(null);
  });

  it('複数回の投稿で状態が正しく更新されること', async () => {
    const firstPost = { ...mockBlogPost, id: 'first-id' };
    const secondPost = { ...mockBlogPost, id: 'second-id' };

    mockPost.mockResolvedValueOnce(firstPost).mockResolvedValueOnce(secondPost);

    const { result } = renderHook(() => useCreateBlogPost());

    // 1回目の投稿
    await act(async () => {
      await result.current.createBlogPost(firstPost);
    });

    expect(result.current.blogPost).toEqual(firstPost);

    // 2回目の投稿
    await act(async () => {
      await result.current.createBlogPost(secondPost);
    });

    expect(result.current.blogPost).toEqual(secondPost);
    expect(mockPost).toHaveBeenCalledTimes(2);
  });
});
