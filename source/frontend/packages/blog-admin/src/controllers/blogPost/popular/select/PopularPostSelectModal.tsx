'use client';
import React from 'react';
import { ApiBlogPostRepository } from 'shared-interface-adapter/src/repositories/apiBlogPostRepository';
import CommonModal from '../../../../components/modal/CommonModal';
import CommonModalCloseButton from '../../../../components/modal/CommonModalCloseButton';
import CommonModalOpenButton from '../../../../components/modal/CommonModalOpenButton';
import { SelectPopularPostsUseCase } from '../../../../usecases/select/selectPopularPosts';
import { usePopularPostListContext } from '../list/PopularPostListProvider';
import PopularPostsForm from './form/PopularPostsForm';
import type { PopularPostsFormValues } from './form/PopularPostsFormProvider';
import PopularPostsFormProvider from './form/PopularPostsFormProvider';
import { usePopularPostsCheckbox } from './form/usePopularPostsCheckbox';

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

  const { selectedBlogPosts } = usePopularPostsCheckbox();

  const onSubmit = async (data: PopularPostsFormValues) => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('API の URL が設定されていません');
    }
    const blogPostRepository = new ApiBlogPostRepository(
      process.env.NEXT_PUBLIC_API_URL,
    );
    const selectPopularPostsUseCase = new SelectPopularPostsUseCase(
      selectedBlogPosts(data.popularPosts),
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
      <PopularPostsFormProvider
        defaultValues={{
          popularPosts: getAllPopularPosts().map((post) => post.id),
        }}
      >
        <PopularPostsForm onSubmit={onSubmit} />
      </PopularPostsFormProvider>
      {isUploadSuccess && <p>人気記事を更新しました。</p>}
      <CommonModalCloseButton>閉じる</CommonModalCloseButton>
    </CommonModal>
  );
}

export default React.memo(PopularPostSelectModalWithOpenButton);
