'use client';
import React from 'react';
import { api, HttpError } from 'shared-lib/src/api';
import CommonModal from '../../../../components/modal/CommonModal';
import CommonModalCloseButton from '../../../../components/modal/CommonModalCloseButton';
import CommonModalOpenButton from '../../../../components/modal/CommonModalOpenButton';
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
    try {
      // 選択されたブログ記事を取得
      const selectedPosts = selectedBlogPosts(data.checkedPosts);
      
      // ピックアップ記事を更新
      const response = await api.put('/api/v2/admin/blog/posts/pickup', selectedPosts);
      updatePickUpPosts(response);
      setIsUploadSuccess(true);
    } catch (error) {
      console.error('ピックアップ記事の更新に失敗しました:', error);
      
      if (error instanceof HttpError) {
        console.error(`HTTPエラー: ${error.status}`);
      }
      
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
