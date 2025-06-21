/**
 * 最新記事一覧取得用カスタムフック
 *
 * shared-libのAPIクライアントを使用して最新記事一覧を取得します
 */

import { useEffect, useState } from 'react';
import { api, HttpError, type BlogPost } from 'shared-lib/src/api';

interface UseViewLatestBlogPostsState {
  blogPosts: BlogPost[];
  loading: boolean;
  error: string | null;
}

interface UseViewLatestBlogPostsOptions {
  quantity?: number;
  enabled?: boolean;
}

/**
 * 最新記事一覧取得フック
 *
 * @param options オプション（記事数の指定など）
 * @returns 記事一覧データ、ローディング状態、エラー状態
 */
export function useViewLatestBlogPosts(
  options: UseViewLatestBlogPostsOptions = {},
): UseViewLatestBlogPostsState {
  const { quantity, enabled = true } = options;

  const [state, setState] = useState<UseViewLatestBlogPostsState>({
    blogPosts: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const fetchLatestBlogPosts = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        // 現在のv2 APIはquantityパラメータをサポートしていないため、全件取得後にフロントエンドで制限
        const allBlogPosts = await api.get('/api/v2/blog/posts/latest');

        // quantityが指定されている場合は、その数だけ制限
        const blogPosts =
          quantity !== undefined
            ? allBlogPosts.slice(0, quantity)
            : allBlogPosts;

        setState({
          blogPosts,
          loading: false,
          error: null,
        });
      } catch (error) {
        let errorMessage = '最新記事の取得に失敗しました';

        if (error instanceof HttpError) {
          errorMessage = error.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        setState({
          blogPosts: [],
          loading: false,
          error: errorMessage,
        });
      }
    };

    fetchLatestBlogPosts();
  }, [quantity, enabled]);

  return state;
}
