'use client';
import React from 'react';
import { api, HttpError } from 'shared-lib/src/api';
import CommonModalOpenButton from '../../../../components/modal/CommonModalOpenButton';
import type { PostsCheckboxesFormValues } from '../../select/checkboxes/PostCheckboxesProvider';
import { usePostsCheckboxes } from '../../select/checkboxes/usePostCheckboxes';
import PostSelectModal from '../../select/PostSelectModal';
import { useTopTechPickPostViewContext } from '../view/TopTechPickViewProvider';

function TopTechPickSelectModalWithOpenButton() {
  return (
    <>
      <CommonModalOpenButton>
        トップテックピック記事を選択
      </CommonModalOpenButton>
      <Modal />
    </>
  );
}

function Modal() {
  const { getTopTechPickPost, updateTopTechPickPost } =
    useTopTechPickPostViewContext();
  const [isUploadSuccess, setIsUploadSuccess] = React.useState(false);

  const { selectedBlogPosts } = usePostsCheckboxes();

  const onSubmit = async (data: PostsCheckboxesFormValues) => {
    try {
      const selectedTopTechPickBlogPosts = selectedBlogPosts(data.checkedPosts);
      if (selectedTopTechPickBlogPosts.length !== 1) {
        alert('トップテックピック記事は1つだけ選択してください。');
        return;
      }

      // 選択された記事（単一）を取得
      const selectedPost = selectedTopTechPickBlogPosts[0];

      // トップテックピック記事を更新
      const response = await api.put(
        '/api/admin/blog/posts/top-tech-pick',
        selectedPost,
      );
      updateTopTechPickPost(response);
      setIsUploadSuccess(true);
    } catch (error) {
      console.error('トップテックピック記事の更新に失敗しました:', error);

      if (error instanceof HttpError) {
        console.error(`HTTPエラー: ${error.status}`);
      }

      alert(
        'トップテックピック記事の更新に失敗しました。ログを確認してください。',
      );
    }
  };

  return (
    <PostSelectModal
      title="トップテックピック記事を選択"
      defaultValues={{
        checkedPosts: [getTopTechPickPost()?.id ?? ''],
      }}
      onSubmit={onSubmit}
      validate={(value: string[]) =>
        value.length === 1 || 'トップテック記事は必ず1つのみ選択してください'
      }
      successMessage="トップテックピック記事を更新しました。"
      isSuccess={isUploadSuccess}
    />
  );
}

export default React.memo(TopTechPickSelectModalWithOpenButton);
