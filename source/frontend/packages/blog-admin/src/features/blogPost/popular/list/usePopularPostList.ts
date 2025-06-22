import { useCallback, useEffect } from 'react';
import { api, HttpError } from 'shared-lib/src/api';
import { usePopularPostListContext } from './PopularPostListProvider';

export function usePopularPostList() {
  const { getAllPopularPosts, updatePopularPosts } =
    usePopularPostListContext();

  const fetchPopularPosts = useCallback(async () => {
    try {
      const response = await api.get('/api/blog/posts/popular');
      updatePopularPosts(response);
    } catch (error) {
      console.error('人気記事の取得に失敗しました:', error);

      if (error instanceof HttpError) {
        // 必要に応じて、より詳細なエラーハンドリングを追加
        console.error(`HTTPエラー: ${error.status}`);
      }

      // エラー時は空配列を設定
      updatePopularPosts([]);
    }
  }, [updatePopularPosts]);

  useEffect(() => {
    fetchPopularPosts();
  }, [fetchPopularPosts]);

  return {
    getAllPopularPosts,
  };
}
