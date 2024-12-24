'use client';
import type { Dispatch, SetStateAction } from 'react';
import { createContext, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { ContentDTO } from 'service/src/blogPostService/dto/contentDTO';
import BlogPostEditor from './blogPostEditor/BlogPostEditor';
import type { CreateBlogPostFormData } from './formSchema';

function CreateBlogPostForm() {
  const form = useForm<CreateBlogPostFormData>();
  const [contentsDTO, setContentsDTO] = useState<ContentDTO[]>([]);

  const { register, handleSubmit } = form;

  // const router = useRouter();

  const onSubmit = () => {
    const blogPostTitle = form.getValues('title');
    console.log(blogPostTitle);
    console.log(contentsDTO);
    // await createBlogPostAction(formData);
    // router.push('/posts/create/success');
  };

  return (
    <>
      <ContentsDTOSetterContext.Provider value={setContentsDTO}>
        <BlogPostEditor />
      </ContentsDTOSetterContext.Provider>

      <FormProvider {...form}>
        <ContentsDTOContext.Provider value={contentsDTO}>
          <form role="form" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="title">タイトル</label>

            <input id="title" {...register('title')} />

            <button type="submit">投稿</button>
          </form>
        </ContentsDTOContext.Provider>
      </FormProvider>
    </>
  );
}

export default CreateBlogPostForm;

const ContentsDTOContext = createContext<ContentDTO[]>([]);
export const ContentsDTOSetterContext = createContext<
  Dispatch<SetStateAction<ContentDTO[]>>
>(() => {
  throw new Error('ContentsDTOSetterContext の設定が完了していません');
});
