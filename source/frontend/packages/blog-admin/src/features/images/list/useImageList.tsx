import { useCallback, useEffect } from 'react';
import { api, HttpError } from 'shared-lib/src/api';
import { useImageListContext } from './ImageListProvider';

export function useImageList() {
  const { getAllImages, updateImages } = useImageListContext();

  const fetchImages = useCallback(async () => {
    try {
      const response = await api.get('/api/v2/blog/images');
      updateImages(response);
    } catch (error) {
      console.error('画像一覧の取得に失敗しました:', error);
      
      if (error instanceof HttpError) {
        // 必要に応じて、より詳細なエラーハンドリングを追加
        console.error(`HTTPエラー: ${error.status}`);
      }
      
      // エラー時は空配列を設定
      updateImages([]);
    }
  }, [updateImages]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return {
    getAllImages,
  };
}
