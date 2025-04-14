'use client';
import React from 'react';
// import { ApiBlogPostRepository } from 'shared-interface-adapter/src/repositories/apiBlogPostRepository';
import CommonModal from '../../../../components/modal/CommonModal';
import CommonModalCloseButton from '../../../../components/modal/CommonModalCloseButton';
import CommonModalOpenButton from '../../../../components/modal/CommonModalOpenButton';
// import { SelectTopTechPickPostsUseCase } from '../../../../usecases/select/selectTopTechPickPosts';
// import { useTopTechPickPostViewContext } from '../view/TopTechPickViewProvider';
// import TopTechPickPostsForm from './form/TopTechPickPostsForm';
// import type { TopTechPickPostsFormValues } from './form/TopTechPickPostsFormProvider';
// import TopTechPickPostsFormProvider from './form/TopTechPickPostsFormProvider';
// import { useTopTechPickPostsCheckbox } from './form/useTopTechPickPostsCheckbox';

function TopTechPickSelectModalWithOpenButton() {
  return (
    <>
      <CommonModalOpenButton>トップテック記事を選択</CommonModalOpenButton>
      <Modal />
    </>
  );
}

function Modal() {
  // const { getTopTechPickPost, updateTopTechPickPost } =
  //   useTopTechPickPostViewContext();
  // const [isUploadSuccess, setIsUploadSuccess] = React.useState(false);

  // const { selectedBlogPosts } = useTopTechPickPostsCheckbox();

  // const onSubmit = async (data: TopTechPickPostsFormValues) => {
  //   if (!process.env.NEXT_PUBLIC_API_URL) {
  //     throw new Error('API の URL が設定されていません');
  //   }
  //   const blogPostRepository = new ApiBlogPostRepository(
  //     process.env.NEXT_PUBLIC_API_URL,
  //   );
  //   const selectTopTechPickPostsUseCase = new SelectTopTechPickPostsUseCase(
  //     selectedBlogPosts(data.topTechPickPosts),
  //     blogPostRepository,
  //   );
  //   try {
  //     const updatedTopTechPickPosts = await selectTopTechPickPostsUseCase.execute();
  //     updateTopTechPickPost(updatedTopTechPickPosts);
  //     setIsUploadSuccess(true);
  //   } catch (e) {
  //     console.error(e);
  //     alert('トップテック記事の更新に失敗しました。ログを確認してください。');
  //   }
  // };

  return (
    <CommonModal>
      {/* <TopTechPickPostsFormProvider
        defaultValues={{
          topTechPickPost: getTopTechPickPost,
        }}
      >
        <TopTechPickPostsForm onSubmit={onSubmit} />
      </TopTechPickPostsFormProvider>
      {isUploadSuccess && <p>トップテック記事を更新しました。</p>} */}
      <CommonModalCloseButton>閉じる</CommonModalCloseButton>
    </CommonModal>
  );
}

export default React.memo(TopTechPickSelectModalWithOpenButton);
