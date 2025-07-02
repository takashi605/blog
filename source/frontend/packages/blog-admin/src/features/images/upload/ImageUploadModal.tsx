'use client';
import React from 'react';
import { api, HttpError } from 'shared-lib/src/api';
import { createUUIDv4 } from 'shared-lib/src/utils/uuid';
import SuccessMessage from '../../../components/form/parts/SuccessMessage';
import CommonModal from '../../../components/modal/CommonModal';
import CommonModalCloseButton from '../../../components/modal/CommonModalCloseButton';
import CommonModalOpenButton from '../../../components/modal/CommonModalOpenButton';
import { useImageListContext } from '../list/ImageListProvider';
import { uploadCloudinary } from './cloudinary/uploadCloudinary';
import ImageUploadForm from './form/ImageUploadForm';
import type { ImageUploadFormValues } from './form/ImageUploadFormProvider';
import ImageUploadFormProvider from './form/ImageUploadFormProvider';
import styles from './ImageUploadModal.module.scss';

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
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSuccessMessageHide = () => {
    setIsUploadSuccess(false);
  };

  const onSubmit = async (data: ImageUploadFormValues) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      // 画像をDBに保存
      const imageData = {
        id: createUUIDv4(),
        path: data.imagePath,
      };

      await api.post('/api/admin/blog/images', imageData);
    } catch (error) {
      console.error('データベースへのアップロードに失敗しました:', error);

      if (error instanceof HttpError) {
        console.error(`HTTPエラー: ${error.status}`);
      }

      setErrorMessage('データベースへのアップロードに失敗しました。');
      setIsLoading(false);
      fetchImages();
      return;
    }

    const isSuccess = await uploadCloudinary(data);
    if (!isSuccess) {
      setErrorMessage('画像ストレージへのアップロードに失敗しました。');
      setIsLoading(false);
      fetchImages();
      return;
    }

    fetchImages();
    setIsUploadSuccess(true);
    setIsLoading(false);

    async function fetchImages() {
      try {
        // 画像一覧を再取得
        const fetchedImages = await api.get('/api/blog/images');
        updateImages(fetchedImages);
      } catch (error) {
        console.error('画像一覧の再取得に失敗しました:', error);

        if (error instanceof HttpError) {
          console.error(`HTTPエラー: ${error.status}`);
        }

        // エラー時は空配列を設定
        updateImages([]);
      }
    }
  };

  return (
    <CommonModal maxWidth="500px" width="90%">
      <div className={styles.modalContent}>
        <h2 className={styles.header}>画像アップロード</h2>
        <div className={styles.formContainer}>
          <ImageUploadFormProvider>
            <ImageUploadForm
              onSubmit={onSubmit}
              errorMessage={errorMessage}
              loading={isLoading}
            />
            <SuccessMessage
              message="画像のアップロードに成功しました"
              isVisible={isUploadSuccess}
              onHide={handleSuccessMessageHide}
            />
          </ImageUploadFormProvider>
        </div>
        <div className={styles.buttonContainer}>
          <CommonModalCloseButton>閉じる</CommonModalCloseButton>
        </div>
      </div>
    </CommonModal>
  );
}

export default React.memo(ImageUploadModalWithOpenButton);
