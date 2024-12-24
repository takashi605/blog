'use client';
import type { Dispatch, SetStateAction } from 'react';
import { createContext, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { ContentDTO } from 'service/src/blogPostService/dto/contentDTO';
import type { BlogPostDTOForCreate } from '../../../usecases/create/createBlogPost';
import BlogPostEditor from './blogPostEditor/BlogPostEditor';
import { typedBlogPostWithoutContentsToDTO } from './helper/typedBlogPostToDTO';

export type CreateBlogPostFormData = {
  title: string;
};

function CreateBlogPostForm() {
  const form = useForm<CreateBlogPostFormData>();
  const [contentsDTO, setContentsDTO] = useState<ContentDTO[]>([]);

  const { register, handleSubmit } = form;

  // const router = useRouter();

  const onSubmit = () => {
    const formValues = form.getValues();
    const blogPostDTO: BlogPostDTOForCreate = {
      ...typedBlogPostWithoutContentsToDTO(formValues),
      contents: contentsDTO,
    };
    console.log(blogPostDTO);
    // await createBlogPostAction(formData);
    // router.push('/posts/create/success');
  };

  return (
    <>
      <ContentsDTOSetterContext.Provider value={setContentsDTO}>
        <BlogPostEditor />
      </ContentsDTOSetterContext.Provider>

      <FormProvider {...form}>
        <form role="form" onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="title">タイトル</label>

          <input id="title" {...register('title')} />

          <button type="submit">投稿</button>
        </form>
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
