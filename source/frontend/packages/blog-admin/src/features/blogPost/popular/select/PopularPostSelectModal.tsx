'use client';
import React from 'react';
import { ApiBlogPostRepository } from 'shared-lib/src/repositories/apiBlogPostRepository';
import CommonModal from '../../../../components/modal/CommonModal';
import CommonModalCloseButton from '../../../../components/modal/CommonModalCloseButton';
import CommonModalOpenButton from '../../../../components/modal/CommonModalOpenButton';
import { SelectPopularPostsUseCase } from '../../../../usecases/select/selectPopularPosts';
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
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('API の URL が設定されていません');
    }
    const blogPostRepository = new ApiBlogPostRepository(
      process.env.NEXT_PUBLIC_API_URL,
    );
    const selectPopularPostsUseCase = new SelectPopularPostsUseCase(
      selectedBlogPosts(data.checkedPosts),
      blogPostRepository,
    );
    try {
      const updatedPopularPosts = await selectPopularPostsUseCase.execute();
      updatePopularPosts(updatedPopularPosts);
      setIsUploadSuccess(true);
    } catch (e) {
      console.error(e);
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
