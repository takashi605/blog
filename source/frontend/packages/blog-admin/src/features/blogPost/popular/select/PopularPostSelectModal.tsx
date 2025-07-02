'use client';
import React from 'react';
import { api, HttpError } from 'shared-lib/src/api';
import CommonModalOpenButton from '../../../../components/modal/CommonModalOpenButton';
import type { PostsCheckboxesFormValues } from '../../select/checkboxes/PostCheckboxesProvider';
import { usePostsCheckboxes } from '../../select/checkboxes/usePostCheckboxes';
import PostSelectModal from '../../select/PostSelectModal';
import { usePopularPostListContext } from '../list/PopularPostListProvider';

function PopularPostSelectModalWithOpenButton() {
  return (
    <>
      <CommonModalOpenButton>人気記事を選択</CommonModalOpenButton>
      <Modal />
    </>
  );
}

function Modal() {
  const { getAllPopularPosts, updatePopularPosts } =
    usePopularPostListContext();
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

      // 人気記事を更新
      const response = await api.put(
        '/api/admin/blog/posts/popular',
        selectedPosts,
      );
      updatePopularPosts(response);
      setIsUploadSuccess(true);
    } catch (error) {
      console.error('人気記事の更新に失敗しました:', error);

      if (error instanceof HttpError) {
        console.error(`HTTPエラー: ${error.status}`);
      }

      alert('人気記事の更新に失敗しました。ログを確認してください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PostSelectModal
      title="人気記事を選択"
      defaultValues={{
        checkedPosts: getAllPopularPosts().map((post) => post.id),
      }}
      onSubmit={onSubmit}
      validate={(value: string[]) =>
        value.length === 3 || '人気記事は3件選択してください'
      }
      successMessage="人気記事を更新しました。"
      isSuccess={isUploadSuccess}
      loading={isLoading}
    />
  );
}

export default React.memo(PopularPostSelectModalWithOpenButton);
