'use client';
import { useRouter } from 'next/navigation';
import type { Dispatch, SetStateAction } from 'react';
import { createContext, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { ContentDTO } from 'service/src/blogPostService/dto/contentDTO';
import { ApiBlogPostRepository } from 'shared-interface-adapter/src/repositories/apiBlogPostRepository';
import CommonModalProvider from '../../../components/modal/CommonModalProvider';
import {
  CreateBlogPostUseCase,
  type BlogPostDTOForCreate,
} from '../../../usecases/create/createBlogPost';
import BlogPostEditor from './blogPostEditor/BlogPostEditor';
import { formDataToDTO } from './helper/formDataToDTO';
import ThumbnailPickModalWithOpenButton from './ThumbnailPickModal';
import ThumbnailPreview from './ThumbnailPreview';

export type CreateBlogPostFormData = {
  title: string;
  thumbnail: {
    id: string;
    path: string;
  };
};

function CreateBlogPostForm() {
  const form = useForm<CreateBlogPostFormData>({
    defaultValues: {
      title: '',
      thumbnail: {
        id: '',
        path: '',
      },
    },
  });
  const [contentsDTO, setContentsDTO] = useState<ContentDTO[]>([]);

  const { register, handleSubmit } = form;

  const router = useRouter();

  const onSubmit = async () => {
    console.log(contentsDTO);
    const formValues = form.getValues();
    const blogPostDTO: BlogPostDTOForCreate = {
      ...formDataToDTO(formValues),
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

  return (
    <>
      <FormProvider {...form}>
        <form role="form" onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="title">タイトル</label>
          <input id="title" {...register('title')} />
          <br />

          <CommonModalProvider>
            <ThumbnailPickModalWithOpenButton />
          </CommonModalProvider>
          <br />

          <button type="submit">投稿</button>
        </form>

        <ThumbnailPreview />

        <ContentsDTOSetterContext.Provider value={setContentsDTO}>
          <BlogPostEditor />
        </ContentsDTOSetterContext.Provider>
      </FormProvider>
    </>
  );
}

export default CreateBlogPostForm;

export const ContentsDTOSetterContext = createContext<
  Dispatch<SetStateAction<ContentDTO[]>>
>(() => {
  throw new Error('ContentsDTOSetterContext の設定が完了していません');
});
