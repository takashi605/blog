import { useCallback, useEffect } from 'react';
import { api, HttpError } from 'shared-lib/src/api';
import { usePickUpPostListContext } from './PickUpPostListProvider';

export function usePickUpPostList() {
  const { getAllPickUpPosts, updatePickUpPosts } = usePickUpPostListContext();

  const fetchPickUpPosts = useCallback(async () => {
    try {
      const response = await api.get('/api/blog/posts/pickup');
      updatePickUpPosts(response);
    } catch (error) {
      console.error('ピックアップ記事の取得に失敗しました:', error);

      if (error instanceof HttpError) {
        // 必要に応じて、より詳細なエラーハンドリングを追加
        console.error(`HTTPエラー: ${error.status}`);
      }

      // エラー時は空配列を設定
      updatePickUpPosts([]);
    }
  }, [updatePickUpPosts]);

  useEffect(() => {
    fetchPickUpPosts();
  }, [fetchPickUpPosts]);

  return {
    getAllPickUpPosts,
  };
}
