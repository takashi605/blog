'use client';
import React from 'react';
import CommonModal from '../../../../components/modal/CommonModal';
import { useCommonModalContext } from '../../../../components/modal/CommonModalProvider';
import type { ImageUploadFormValues } from '../../../images/upload/form/ImageUploadFormProvider';
import { usePickUpPostListContext } from '../list/PickUpPostListProvider';
import PickUpPostsForm from './form/PickUpPostsForm';

function PickUpPostSelectModalWithOpenButton() {
  const { openModal } = useCommonModalContext();

  return (
    <>
      <button onClick={openModal}>ピックアップ記事を選択</button>
      <Modal />
    </>
  );
}

function Modal() {
  const { updatePickUpPosts } = usePickUpPostListContext();
  const [isUploadSuccess, setIsUploadSuccess] = React.useState(false);
  const { closeModal } = useCommonModalContext();

  const onSubmit = async (data: ImageUploadFormValues) => {
    console.log(data);
    // if (!process.env.NEXT_PUBLIC_API_URL) {
    //   throw new Error('API の URL が設定されていません');
    // }
    // const blogPostRepository = new ApiBlogPostRepository(
    //   process.env.NEXT_PUBLIC_API_URL,
    // );
    // const selectedPickUpPosts = null;
    // const selectPickUpPostsUseCase = new SelectPickUpPostsUseCase(
    //   selectedPickUpPosts,
    //   blogPostRepository,
    // );
    // try {
    //   const updatedPickUpPosts = await selectPickUpPostsUseCase.execute();
    //   updatePickUpPosts(updatedPickUpPosts);
    //   setIsUploadSuccess(true);
    // } catch {
    //   alert('ピックアップ記事の更新に失敗しました。ログを確認してください。');
    // }
  };

  return (
    <CommonModal>
      <PickUpPostsForm />
      {/* <ImageUploadFormProvider>
        <ImageUploadForm onSubmit={onSubmit} />
        {isUploadSuccess && <p>画像のアップロードに成功しました</p>}
      </ImageUploadFormProvider> */}
      <button onClick={closeModal} className="modal-close" type="button">
        閉じる
      </button>
    </CommonModal>
  );
}

export default React.memo(PickUpPostSelectModalWithOpenButton);
