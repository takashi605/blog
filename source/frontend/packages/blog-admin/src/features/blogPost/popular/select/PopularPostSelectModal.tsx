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

  const { selectedBlogPosts } = usePostsCheckboxes();

  const onSubmit = async (data: PostsCheckboxesFormValues) => {
    try {
      // 選択されたブログ記事を取得
      const selectedPosts = selectedBlogPosts(data.checkedPosts);
      
      // 人気記事を更新
      const response = await api.put('/api/v2/admin/blog/posts/popular', selectedPosts);
      updatePopularPosts(response);
      setIsUploadSuccess(true);
    } catch (error) {
      console.error('人気記事の更新に失敗しました:', error);
      
      if (error instanceof HttpError) {
        console.error(`HTTPエラー: ${error.status}`);
      }
      
      alert('人気記事の更新に失敗しました。ログを確認してください。');
    }
  };

  return (
    <CommonModal>
      <PostCheckboxesFormProvider
        defaultValues={{
          checkedPosts: getAllPopularPosts().map((post) => post.id),
        }}
      >
        <h2>人気記事を選択</h2>
        <PostCheckboxes
          onSubmit={onSubmit}
          validate={(value: string[]) =>
            value.length === 3 || '人気記事は3件選択してください'
          }
        />
      </PostCheckboxesFormProvider>
      {isUploadSuccess && <p>人気記事を更新しました。</p>}
      <CommonModalCloseButton>閉じる</CommonModalCloseButton>
    </CommonModal>
  );
}

export default React.memo(PopularPostSelectModalWithOpenButton);
