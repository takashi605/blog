'use client';
import process from 'process';
import React from 'react';
import type { ImageDTO } from 'service/src/imageService/dto/imageDTO';
import { createUUIDv4 } from 'service/src/utils/uuid';
import { ApiImageRepository } from 'shared-interface-adapter/src/repositories/apiImageRepository';
import CommonModal from '../../../components/modal/CommonModal';
import CommonModalCloseButton from '../../../components/modal/CommonModalCloseButton';
import CommonModalOpenButton from '../../../components/modal/CommonModalOpenButton';
import { CreateImageUseCase } from '../../../usecases/create/createImage';
import { ViewImagesUseCase } from '../../../usecases/view/viewImages';
import { useImageListContext } from '../list/ImageListProvider';
import { uploadCloudinary } from './cloudinary/uploadCloudinary';
import ImageUploadForm from './form/ImageUploadForm';
import type { ImageUploadFormValues } from './form/ImageUploadFormProvider';
import ImageUploadFormProvider from './form/ImageUploadFormProvider';

function ImageUploadModalWithOpenButton() {
  return (
    <>
      <CommonModalOpenButton>画像を追加</CommonModalOpenButton>
      <Modal />
    </>
  );
}

function Modal() {
  const { updateImages } = useImageListContext();
  const [isUploadSuccess, setIsUploadSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const onSubmit = async (data: ImageUploadFormValues) => {
    const isSuccess = await uploadCloudinary(data);
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('API の URL が設定されていません');
    }
    if (!isSuccess) {
      setErrorMessage('画像ストレージへのアップロードに失敗しました。');
      return;
    }
    const imageRepository = new ApiImageRepository(
      process.env.NEXT_PUBLIC_API_URL,
    );

    // TODO id の生成をエンティティに移動する
    const imageDTO: ImageDTO = {
      id: createUUIDv4(),
      path: data.imagePath,
    };
    const createImageUsecase = new CreateImageUseCase(
      imageDTO,
      imageRepository,
    );
    try {
      await createImageUsecase.execute();
    } catch {
      setErrorMessage('データベースへのアップロードに失敗しました。');
      return;
    }

    const viewImagesUsecase = new ViewImagesUseCase(imageRepository);
    const fetchedImages = await viewImagesUsecase.execute();
    updateImages(fetchedImages);

    setIsUploadSuccess(true);
  };

  return (
    <CommonModal>
      <ImageUploadFormProvider>
        <ImageUploadForm onSubmit={onSubmit} errorMessage={errorMessage} />
        {isUploadSuccess && <p>画像のアップロードに成功しました</p>}
      </ImageUploadFormProvider>
      <CommonModalCloseButton>閉じる</CommonModalCloseButton>
    </CommonModal>
  );
}

export default React.memo(ImageUploadModalWithOpenButton);
