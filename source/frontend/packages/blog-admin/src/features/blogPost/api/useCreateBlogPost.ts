/**
 * 記事投稿用カスタムフック
 *
 * shared-libのAPIクライアントを使用して記事を投稿します
 */

import { useCallback, useState } from 'react';
import type { CreateBlogPostRequest } from 'shared-lib/src/api';
import { api, HttpError, type BlogPost } from 'shared-lib/src/api';

interface UseCreateBlogPostState {
  loading: boolean;
  error: string | null;
  blogPost: BlogPost | null;
}

/**
 * 記事投稿フック
 *
 * @returns 記事投稿関数、ローディング状態、エラー状態、投稿された記事データ
 */
export function useCreateBlogPost() {
  const [state, setState] = useState<UseCreateBlogPostState>({
    loading: false,
    error: null,
    blogPost: null,
  });

  const createBlogPost = useCallback(
    async (blogPost: CreateBlogPostRequest): Promise<BlogPost> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const createdBlogPost = await api.post(
          '/api/admin/blog/posts',
          blogPost,
        );
        setState({
          // 成功時は別ページに遷移するので、loadingをtrueのままにする
          loading: true,
          error: null,
          blogPost: createdBlogPost,
        });
        return createdBlogPost;
      } catch (error) {
        let errorMessage = '記事の投稿に失敗しました';

        if (error instanceof HttpError) {
          if (error.status === 400) {
            errorMessage = '入力内容に誤りがあります';
          } else if (error.status === 409) {
            errorMessage = '記事IDが既に存在します';
          } else {
            errorMessage = `記事の投稿に失敗しました: ${error.message}`;
          }
        } else if (error instanceof Error) {
          errorMessage = `記事の投稿に失敗しました: ${error.message}`;
        }

        setState({
          loading: false,
          error: errorMessage,
          blogPost: null,
        });

        throw new Error(errorMessage);
      }
    },
    [],
  );

  const resetError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    createBlogPost,
    loading: state.loading,
    error: state.error,
    blogPost: state.blogPost,
    resetError,
  };
}
