/**
 * 記事閲覧用カスタムフック
 *
 * shared-libのAPIクライアントを使用して単一記事を取得します
 */

import { useEffect, useState } from 'react';
import { api, HttpError, type BlogPost } from 'shared-lib/src/api';

interface UseViewBlogPostState {
  blogPost: BlogPost | null;
  loading: boolean;
  error: string | null;
}

interface UseViewBlogPostOptions {
  enabled?: boolean;
}

/**
 * 単一記事取得フック
 *
 * @param postId 記事ID
 * @param options オプション
 * @returns 記事データ、ローディング状態、エラー状態
 */
export function useViewBlogPost(
  postId: string,
  options: UseViewBlogPostOptions = {},
): UseViewBlogPostState {
  const { enabled = true } = options;

  const [state, setState] = useState<UseViewBlogPostState>({
    blogPost: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!enabled || !postId) {
      return;
    }

    const fetchBlogPost = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        // パスパラメータを含むAPIエンドポイントの型安全な呼び出し
        const blogPost = await api.get('/api/v2/blog/posts/{uuid}', {
          pathParams: { uuid: postId },
        });
        setState({
          blogPost,
          loading: false,
          error: null,
        });
      } catch (error) {
        let errorMessage = '記事の取得に失敗しました';

        if (error instanceof HttpError) {
          if (error.status === 404) {
            errorMessage = '記事が見つかりませんでした';
          } else {
            errorMessage = error.message;
          }
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        setState({
          blogPost: null,
          loading: false,
          error: errorMessage,
        });
      }
    };

    fetchBlogPost();
  }, [postId, enabled]);

  return state;
}
