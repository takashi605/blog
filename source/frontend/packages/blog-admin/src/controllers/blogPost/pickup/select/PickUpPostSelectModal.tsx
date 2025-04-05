'use client';
import React from 'react';
import { ApiBlogPostRepository } from 'shared-interface-adapter/src/repositories/apiBlogPostRepository';
import CommonModal from '../../../../components/modal/CommonModal';
import CommonModalOpenButton from '../../../../components/modal/CommonModalOpenButton';
import { useCommonModalContext } from '../../../../components/modal/CommonModalProvider';
import { SelectPickUpPostsUseCase } from '../../../../usecases/select/selectPickUpPosts';
import { usePickUpPostListContext } from '../list/PickUpPostListProvider';
import PickUpPostsForm from './form/PickUpPostsForm';
import type { PickUpPostsFormValues } from './form/PickUpPostsFormProvider';
import PickUpPostsFormProvider from './form/PickUpPostsFormProvider';
import { usePickUpPostsCheckbox } from './form/usePickUpPostsCheckbox';

function PickUpPostSelectModalWithOpenButton() {
  return (
    <>
      <CommonModalOpenButton>ピックアップ記事を選択</CommonModalOpenButton>
      <Modal />
    </>
  );
}

function Modal() {
  const { getAllPickUpPosts, updatePickUpPosts } = usePickUpPostListContext();
  const [isUploadSuccess, setIsUploadSuccess] = React.useState(false);
  const { closeModal } = useCommonModalContext();

  const { selectedBlogPosts } = usePickUpPostsCheckbox();

  const onSubmit = async (data: PickUpPostsFormValues) => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('API の URL が設定されていません');
    }
    const blogPostRepository = new ApiBlogPostRepository(
      process.env.NEXT_PUBLIC_API_URL,
    );
    const selectPickUpPostsUseCase = new SelectPickUpPostsUseCase(
      selectedBlogPosts(data.pickUpPosts),
      blogPostRepository,
    );
    try {
      const updatedPickUpPosts = await selectPickUpPostsUseCase.execute();
      updatePickUpPosts(updatedPickUpPosts);
      setIsUploadSuccess(true);
    } catch (e) {
      console.error(e);
      alert('ピックアップ記事の更新に失敗しました。ログを確認してください。');
    }
  };

  return (
    <CommonModal>
      <PickUpPostsFormProvider
        defaultValues={{
          pickUpPosts: getAllPickUpPosts().map((post) => post.id),
        }}
      >
        <PickUpPostsForm onSubmit={onSubmit} />
      </PickUpPostsFormProvider>
      {isUploadSuccess && <p>ピックアップ記事を更新しました。</p>}
      <button onClick={closeModal} className="modal-close" type="button">
        閉じる
      </button>
    </CommonModal>
  );
}

export default React.memo(PickUpPostSelectModalWithOpenButton);
