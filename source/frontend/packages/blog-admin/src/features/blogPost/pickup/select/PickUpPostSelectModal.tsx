'use client';
import React from 'react';
import { api, HttpError } from 'shared-lib/src/api';
import CommonModalOpenButton from '../../../../components/modal/CommonModalOpenButton';
import type { PostsCheckboxesFormValues } from '../../select/checkboxes/PostCheckboxesProvider';
import { usePostsCheckboxes } from '../../select/checkboxes/usePostCheckboxes';
import PostSelectModal from '../../select/PostSelectModal';
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
  const [isLoading, setIsLoading] = React.useState(false);

  const { selectedBlogPosts } = usePostsCheckboxes();

  const onSubmit = async (data: PostsCheckboxesFormValues) => {
    try {
      // 成功フラグをリセット
      setIsUploadSuccess(false);
      setIsLoading(true);

      // 選択されたブログ記事を取得
      const selectedPosts = selectedBlogPosts(data.checkedPosts);

      // ピックアップ記事を更新
      const response = await api.put(
        '/api/admin/blog/posts/pickup',
        selectedPosts,
      );
      updatePickUpPosts(response);
      setIsUploadSuccess(true);
    } catch (error) {
      console.error('ピックアップ記事の更新に失敗しました:', error);

      if (error instanceof HttpError) {
        console.error(`HTTPエラー: ${error.status}`);
      }

      alert('ピックアップ記事の更新に失敗しました。ログを確認してください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PostSelectModal
      title="ピックアップ記事を選択"
      defaultValues={{
        checkedPosts: getAllPickUpPosts().map((post) => post.id),
      }}
      onSubmit={onSubmit}
      validate={(value: string[]) =>
        value.length === 3 || 'ピックアップ記事は3件選択してください'
      }
      successMessage="ピックアップ記事を更新しました。"
      isSuccess={isUploadSuccess}
      loading={isLoading}
    />
  );
}

export default React.memo(PickUpPostSelectModalWithOpenButton);
