'use client';
import { useRouter } from 'next/navigation';
import type { Dispatch, SetStateAction } from 'react';
import { createContext, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { ContentDTO } from 'service/src/blogPostService/dto/contentDTO';
import { ApiBlogPostRepository } from 'shared-interface-adapter/src/repositories/apiBlogPostRepository';
import CommonModal from '../../../components/modal/CommonModal';
import { useCommonModalContext } from '../../../components/modal/CommonModalProvider';
import {
  CreateBlogPostUseCase,
  type BlogPostDTOForCreate,
} from '../../../usecases/create/createBlogPost';
import ImageList from '../../images/list/ImageList';
import ImageListProvider from '../../images/list/ImageListProvider';
import BlogPostEditor from './blogPostEditor/BlogPostEditor';
import { typedBlogPostWithoutContentsToDTO } from './helper/typedBlogPostToDTO';

export type CreateBlogPostFormData = {
  title: string;
};

function CreateBlogPostForm() {
  const form = useForm<CreateBlogPostFormData>();
  const [contentsDTO, setContentsDTO] = useState<ContentDTO[]>([]);

  const { register, handleSubmit } = form;

  const router = useRouter();

  const onSubmit = async () => {
    const formValues = form.getValues();
    const blogPostDTO: BlogPostDTOForCreate = {
      ...typedBlogPostWithoutContentsToDTO(formValues),
      contents: contentsDTO,
    };
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('API の URL が設定されていません');
    }
    const repository = new ApiBlogPostRepository(
      process.env.NEXT_PUBLIC_API_URL,
    );
    const createBlogPostUseCase = new CreateBlogPostUseCase(
      blogPostDTO,
      repository,
    );
    const createdBlogPost = await createBlogPostUseCase.execute();
    router.push(`/posts/create/success?id=${createdBlogPost.id}`);
  };

  const { openModal, closeModal } = useCommonModalContext();

  return (
    <>
      <FormProvider {...form}>
        <form role="form" onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="title">タイトル</label>

          <input id="title" {...register('title')} />

          <button type="button" onClick={openModal}>
            サムネイル画像を選択
          </button>
          <br />

          <button type="submit">投稿</button>

          <CommonModal>
            <ImageListProvider>
              <ImageList />
            </ImageListProvider>
            <button onClick={closeModal} className="modal-close" type="button">
              閉じる
            </button>
          </CommonModal>
        </form>
      </FormProvider>

      <ContentsDTOSetterContext.Provider value={setContentsDTO}>
        <BlogPostEditor />
      </ContentsDTOSetterContext.Provider>
    </>
  );
}

export default CreateBlogPostForm;

export const ContentsDTOSetterContext = createContext<
  Dispatch<SetStateAction<ContentDTO[]>>
>(() => {
  throw new Error('ContentsDTOSetterContext の設定が完了していません');
});
