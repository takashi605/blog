import { useCallback, useEffect } from 'react';
import { ApiImageRepository } from 'shared-interface-adapter/src/repositories/apiImageRepository';
import { ViewImagesUseCase } from '../../../usecases/view/viewImages';
import { useImageListContext } from './ImageListProvider';

export function useImageList() {
  const { getAllImages, updateImages } = useImageListContext();

  const fetchImages = useCallback(async () => {
    const api_url = process.env.NEXT_PUBLIC_API_URL;
    if (!api_url) {
      throw new Error('API URL が設定されていません');
    }
    const imageRepository = new ApiImageRepository(api_url);
    const viewImagesUsecase = new ViewImagesUseCase(imageRepository);
    const fetchedImages = await viewImagesUsecase.execute();
    updateImages(fetchedImages);
  }, [updateImages]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return {
    getAllImages,
  };
}
