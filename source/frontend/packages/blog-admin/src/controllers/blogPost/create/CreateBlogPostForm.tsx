'use client';
import { FormProvider, useForm } from 'react-hook-form';
import BlogPostEditor from './blogPostEditor/BlogPostEditor';
import type { CreateBlogPostFormData } from './formSchema';

function CreateBlogPostForm() {
  const form = useForm<CreateBlogPostFormData>();

  const { register, handleSubmit } = form;

  // const router = useRouter();

  const onSubmit = async () => {
    const blogPostTitle = form.getValues('title');
    console.log(blogPostTitle);
    // await createBlogPostAction(formData);
    // router.push('/posts/create/success');
  };

  return (
    <>
      <BlogPostEditor />

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
