'use client';
import React from 'react';
import { api, HttpError } from 'shared-lib/src/api';
import { createUUIDv4 } from 'shared-lib/src/utils/uuid';
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

  const onSubmit = async (data: ImageUploadFormValues) => {
    const isSuccess = await uploadCloudinary(data);
    if (!isSuccess) {
      setErrorMessage('画像ストレージへのアップロードに失敗しました。');
      return;
    }

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
      // ここで return すると画像の再取得が行われず、e2e テストが適切な結果を返さない
    }

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

    setIsUploadSuccess(true);
  };

  return (
    <CommonModal maxWidth="500px" width="90%">
      <div className={styles.modalContent}>
        <h2 className={styles.header}>画像アップロード</h2>
        <div className={styles.formContainer}>
          <ImageUploadFormProvider>
            <ImageUploadForm onSubmit={onSubmit} errorMessage={errorMessage} />
            {isUploadSuccess && (
              <div className={styles.successMessage}>
                画像のアップロードに成功しました
              </div>
            )}
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
