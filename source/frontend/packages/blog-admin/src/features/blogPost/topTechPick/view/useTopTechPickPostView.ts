import { useCallback, useEffect } from 'react';
import { api, HttpError } from 'shared-lib/src/api';
import { useTopTechPickPostViewContext } from './TopTechPickViewProvider';

export function useTopTechPickPostList() {
  const { getTopTechPickPost, updateTopTechPickPost } =
    useTopTechPickPostViewContext();

  const fetchTopTechPickPost = useCallback(async () => {
    try {
      const response = await api.get('/api/v2/blog/posts/top-tech-pick');
      updateTopTechPickPost(response);
    } catch (error) {
      console.error('トップテックピック記事の取得に失敗しました:', error);

      if (error instanceof HttpError) {
        // 必要に応じて、より詳細なエラーハンドリングを追加
        console.error(`HTTPエラー: ${error.status}`);
      }

      // エラー時は undefined を設定（空状態）
      updateTopTechPickPost(undefined);
    }
  }, [updateTopTechPickPost]);

  useEffect(() => {
    fetchTopTechPickPost();
  }, [fetchTopTechPickPost]);

  return {
    getTopTechPickPost,
  };
}
