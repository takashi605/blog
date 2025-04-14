'use client';
import React from 'react';
import { ApiBlogPostRepository } from 'shared-interface-adapter/src/repositories/apiBlogPostRepository';
import CommonModal from '../../../../components/modal/CommonModal';
import CommonModalCloseButton from '../../../../components/modal/CommonModalCloseButton';
import CommonModalOpenButton from '../../../../components/modal/CommonModalOpenButton';
import { SelectTopTechPickPostUseCase } from '../../../../usecases/select/selectTopTechPickPost';
import { useTopTechPickPostViewContext } from '../view/TopTechPickViewProvider';
import TopTechPickForm from './form/TopTechPickForm';
import type { TopTechPickFormValues } from './form/TopTechPickFormProvider';
import TopTechPickFormProvider from './form/TopTechPickFormProvider';
import { useTopTechPickPostsCheckbox } from './form/useTopTechPickCheckbox';

function TopTechPickSelectModalWithOpenButton() {
  return (
    <>
      <CommonModalOpenButton>トップテック記事を選択</CommonModalOpenButton>
      <Modal />
    </>
  );
}

function Modal() {
  const { getTopTechPickPost, updateTopTechPickPost } =
    useTopTechPickPostViewContext();
  const [isUploadSuccess, setIsUploadSuccess] = React.useState(false);

  const { findSelectedBlogPosts } = useTopTechPickPostsCheckbox();

  const onSubmit = async (data: TopTechPickFormValues) => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('API の URL が設定されていません');
    }
    const blogPostRepository = new ApiBlogPostRepository(
      process.env.NEXT_PUBLIC_API_URL,
    );

    const selectedBlogPosts = findSelectedBlogPosts(data.topTechPickPosts);
    if (selectedBlogPosts.length !== 1) {
      alert('トップテック記事は1つだけ選択してください。');
      return;
    }

    const selectTopTechPickPostsUseCase = new SelectTopTechPickPostUseCase(
      selectedBlogPosts[0],
      blogPostRepository,
    );

    try {
      const updatedTopTechPickPosts =
        await selectTopTechPickPostsUseCase.execute();
      updateTopTechPickPost(updatedTopTechPickPosts);
      setIsUploadSuccess(true);
    } catch (e) {
      console.error(e);
      alert('トップテック記事の更新に失敗しました。ログを確認してください。');
    }
  };

  return (
    <CommonModal>
      <TopTechPickFormProvider
        defaultValues={{
          topTechPickPosts: [getTopTechPickPost()?.id ?? ''],
        }}
      >
        <TopTechPickForm onSubmit={onSubmit} />
      </TopTechPickFormProvider>
      {isUploadSuccess && <p>トップテック記事を更新しました。</p>}
      <CommonModalCloseButton>閉じる</CommonModalCloseButton>
    </CommonModal>
  );
}

export default React.memo(TopTechPickSelectModalWithOpenButton);
