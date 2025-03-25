'use client';
import { CldImage } from 'next-cloudinary';
import { useCallback, useEffect } from 'react';
import { ApiImageRepository } from 'shared-interface-adapter/src/repositories/apiImageRepository';
import { ViewImagesUseCase } from '../../../usecases/view/viewImages';
import { useImageListContext } from './ImageListProvider';

function ImageList() {
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

  return (
    <>
      <h3>画像一覧</h3>
      <ul>
        {getAllImages().map((image) => (
          <li key={image.id}>
            <CldImage
              src={image.path}
              width={500}
              height={500}
              alt="画像コンテンツ"
            />
            <p>{image.path}</p>
          </li>
        ))}
      </ul>
    </>
  );
}

export default ImageList;
