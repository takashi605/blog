import process from 'process';
import React from 'react';
import type { ImageDTO } from 'service/src/imageService/dto/imageDTO';
import { createUUIDv4 } from 'service/src/utils/uuid';
import { ApiImageRepository } from 'shared-interface-adapter/src/repositories/apiImageRepository';
import CommonModal from '../../../components/modal/CommonModal';
import { useCommonModal } from '../../../components/modal/CommonModalProvider';
import { CreateImageUseCase } from '../../../usecases/create/createImage';
import { uploadCloudinary } from './cloudinary/uploadCloudinary';
import ImageUploadForm from './form/ImageUploadForm';
import type { ImageUploadFormValues } from './form/ImageUploadFormProvider';
import ImageUploadFormProvider from './form/ImageUploadFormProvider';

function ImageUploadModal() {
  const [isUploadSuccess, setIsUploadSuccess] = React.useState(false);
  const { closeModal } = useCommonModal();
  const onSubmit = async (data: ImageUploadFormValues) => {
    const isSuccess = uploadCloudinary(data);
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('API の URL が設定されていません');
    }
    if (!isSuccess) {
      alert('画像のアップロードに失敗しました。ログを確認してください。');
    }
    const imageRepository = new ApiImageRepository(
      process.env.NEXT_PUBLIC_API_URL,
    );
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
      alert('画像の保存に失敗しました。ログを確認してください。');
    }
    setIsUploadSuccess(true);
  };

  return (
    <CommonModal>
      <ImageUploadFormProvider>
        <ImageUploadForm onSubmit={onSubmit} />
        {isUploadSuccess && <p>画像のアップロードに成功しました</p>}
      </ImageUploadFormProvider>
      <button onClick={closeModal} className="modal-close" type="button">
        閉じる
      </button>
    </CommonModal>
  );
}

export default React.memo(ImageUploadModal);
