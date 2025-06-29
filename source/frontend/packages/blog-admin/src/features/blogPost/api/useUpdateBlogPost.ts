/**
 * 記事編集用カスタムフック
 *
 * shared-libのAPIクライアントを使用して記事を編集します
 */

import { useCallback, useState } from 'react';
import type { UpdateBlogPostRequest } from 'shared-lib/src/api';
import { api, HttpError, type BlogPost } from 'shared-lib/src/api';

interface UseUpdateBlogPostState {
  loading: boolean;
  error: string | null;
  blogPost: BlogPost | null;
}

/**
 * 記事編集フック
 *
 * @returns 記事編集関数、ローディング状態、エラー状態、編集された記事データ
 */
export function useUpdateBlogPost() {
  const [state, setState] = useState<UseUpdateBlogPostState>({
    loading: false,
    error: null,
    blogPost: null,
  });

  const updateBlogPost = useCallback(
    async (id: string, blogPost: UpdateBlogPostRequest): Promise<BlogPost> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const updatedBlogPost = (await api.put(
          '/api/admin/blog/posts/{uuid}',
          blogPost,
          { pathParams: { uuid: id } },
        )) as BlogPost;
        setState({
          loading: false,
          error: null,
          blogPost: updatedBlogPost,
        });
        return updatedBlogPost;
      } catch (error) {
        let errorMessage = '記事の編集に失敗しました';

        if (error instanceof HttpError) {
          if (error.status === 400) {
            errorMessage = '入力内容に誤りがあります';
          } else if (error.status === 404) {
            errorMessage = '記事が見つかりません';
          } else {
            errorMessage = `記事の編集に失敗しました: ${error.message}`;
          }
        } else if (error instanceof Error) {
          errorMessage = `記事の編集に失敗しました: ${error.message}`;
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
    updateBlogPost,
    loading: state.loading,
    error: state.error,
    blogPost: state.blogPost,
    resetError,
  };
}
