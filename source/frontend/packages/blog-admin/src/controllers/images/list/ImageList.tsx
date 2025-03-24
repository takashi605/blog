import { ApiImageRepository } from 'shared-interface-adapter/src/repositories/apiImageRepository';
import { ViewImagesUseCase } from '../../../usecases/view/viewImages';
import ImageListClient from './ImageListClient';

async function ImageList() {
  const api_url = process.env.NEXT_PUBLIC_API_URL;
  if (!api_url) {
    throw new Error('API URL が設定されていません');
  }
  const imageRepository = new ApiImageRepository(api_url);
  const viewImagesUsecase = new ViewImagesUseCase(imageRepository);
  const images = await viewImagesUsecase.execute();

  return <ImageListClient imageList={images} />;
}

export default ImageList;
