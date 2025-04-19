'use client';
import React from 'react';
import { ApiBlogPostRepository } from 'shared-interface-adapter/src/repositories/apiBlogPostRepository';
import CommonModal from '../../../../components/modal/CommonModal';
import CommonModalCloseButton from '../../../../components/modal/CommonModalCloseButton';
import CommonModalOpenButton from '../../../../components/modal/CommonModalOpenButton';
import { SelectTopTechPickPostUseCase } from '../../../../usecases/select/selectTopTechPickPost';
import PostCheckboxes from '../../select/checkboxes/PostCheckboxes';
import type { PostsCheckboxesFormValues } from '../../select/checkboxes/PostCheckboxesProvider';
import PostCheckboxesFormProvider from '../../select/checkboxes/PostCheckboxesProvider';
import { usePostsCheckboxes } from '../../select/checkboxes/usePostCheckboxes';
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
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('API の URL が設定されていません');
    }
    const blogPostRepository = new ApiBlogPostRepository(
      process.env.NEXT_PUBLIC_API_URL,
    );

    const selectedTopTechPickBlogPosts = selectedBlogPosts(data.checkedPosts);
    if (selectedTopTechPickBlogPosts.length !== 1) {
      alert('トップテックピック記事は1つだけ選択してください。');
      return;
    }

    const selectTopTechPickPostsUseCase = new SelectTopTechPickPostUseCase(
      selectedTopTechPickBlogPosts[0],
      blogPostRepository,
    );

    try {
      const updatedTopTechPickPosts =
        await selectTopTechPickPostsUseCase.execute();
      updateTopTechPickPost(updatedTopTechPickPosts);
      setIsUploadSuccess(true);
    } catch (e) {
      console.error(e);
      alert(
        'トップテックピック記事の更新に失敗しました。ログを確認してください。',
      );
    }
  };

  return (
    <CommonModal>
      <PostCheckboxesFormProvider
        defaultValues={{
          checkedPosts: [getTopTechPickPost()?.id ?? ''],
        }}
      >
        <h2>ピックアップ記事を選択</h2>
        <PostCheckboxes
          onSubmit={onSubmit}
          validate={(value: string[]) =>
            value.length === 1 ||
            'トップテック記事は必ず1つのみ選択してください'
          }
        />
      </PostCheckboxesFormProvider>
      {isUploadSuccess && <p>トップテックピック記事を更新しました。</p>}
      <CommonModalCloseButton>閉じる</CommonModalCloseButton>
    </CommonModal>
  );
}

export default React.memo(TopTechPickSelectModalWithOpenButton);
