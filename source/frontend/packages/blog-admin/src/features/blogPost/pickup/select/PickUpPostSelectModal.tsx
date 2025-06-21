'use client';
import React from 'react';
import { ApiBlogPostRepository } from 'shared-lib/src/repositories/apiBlogPostRepository';
import CommonModal from '../../../../components/modal/CommonModal';
import CommonModalCloseButton from '../../../../components/modal/CommonModalCloseButton';
import CommonModalOpenButton from '../../../../components/modal/CommonModalOpenButton';
import { SelectPickUpPostsUseCase } from '../../../../usecases/select/selectPickUpPosts';
import PostCheckboxes from '../../select/checkboxes/PostCheckboxes';
import type { PostsCheckboxesFormValues } from '../../select/checkboxes/PostCheckboxesProvider';
import PostCheckboxesFormProvider from '../../select/checkboxes/PostCheckboxesProvider';
import { usePostsCheckboxes } from '../../select/checkboxes/usePostCheckboxes';
import { usePickUpPostListContext } from '../list/PickUpPostListProvider';

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

  const { selectedBlogPosts } = usePostsCheckboxes();

  const onSubmit = async (data: PostsCheckboxesFormValues) => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('API の URL が設定されていません');
    }
    const blogPostRepository = new ApiBlogPostRepository(
      process.env.NEXT_PUBLIC_API_URL,
    );
    const selectPickUpPostsUseCase = new SelectPickUpPostsUseCase(
      selectedBlogPosts(data.checkedPosts),
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
      <PostCheckboxesFormProvider
        defaultValues={{
          checkedPosts: getAllPickUpPosts().map((post) => post.id),
        }}
      >
        <h2>ピックアップ記事を選択</h2>
        <PostCheckboxes
          onSubmit={onSubmit}
          validate={(value: string[]) =>
            value.length === 3 || 'ピックアップ記事は3件選択してください'
          }
        />
      </PostCheckboxesFormProvider>
      {isUploadSuccess && <p>ピックアップ記事を更新しました。</p>}
      <CommonModalCloseButton>閉じる</CommonModalCloseButton>
    </CommonModal>
  );
}

export default React.memo(PickUpPostSelectModalWithOpenButton);
