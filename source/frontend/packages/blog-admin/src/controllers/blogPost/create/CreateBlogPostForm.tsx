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
    // await createBlogPostAction(formData);
    // router.push('/posts/create/success');
  };

  return (
    <>
      <BlogPostEditor />

      <FormProvider {...form}>
        <contentsDTOContext.Provider value={contentsDTO}>
          <contentsDTOSetterContext.Provider value={setContentsDTO}>
            <form role="form" onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="title">タイトル</label>

              <input id="title" {...register('title')} />

              <button type="submit">投稿</button>
            </form>
          </contentsDTOSetterContext.Provider>
        </contentsDTOContext.Provider>
      </FormProvider>
    </>
  );
}

export default CreateBlogPostForm;

const contentsDTOContext = createContext<ContentDTO[]>([]);
const contentsDTOSetterContext = createContext<Dispatch<
  SetStateAction<ContentDTO[]>
> | null>(null);
