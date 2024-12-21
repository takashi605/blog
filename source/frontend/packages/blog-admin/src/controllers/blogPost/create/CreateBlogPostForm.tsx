'use client';
// import type { CreateBlogPostFormData } from '@/controllers/blogPost/create/formSchema';
// import { createBlogPostFormSchema } from '@/controllers/blogPost/create/formSchema';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
import BlogPostEditor from './blogPostEditor/BlogPostEditor';

function CreateBlogPostForm() {
  // const form = useForm<CreateBlogPostFormData>({
  //   resolver: zodResolver(createBlogPostFormSchema),
  // });

  // const { register, handleSubmit, control } = form;

  // const fieldArray = useFieldArray<CreateBlogPostFormData>({
  //   control,
  //   name: 'contents',
  // });

  // const router = useRouter();

  // const onSubmit: SubmitHandler<CreateBlogPostFormData> = async (formData) => {
  //   await createBlogPostAction(formData);
  //   router.push('/posts/create/success');
  // };

  return (
    <BlogPostEditor />

    // <FieldArrayFormProvider {...form} {...fieldArray}>
    //   <form role="form" onSubmit={handleSubmit(onSubmit)}>
    //     <label htmlFor="title">タイトル</label>

    //     <input id="title" {...register('title')} />
    //     <ContentInputList />

    //     <AddContentButtonList />
    //     <button type="submit">投稿</button>
    //   </form>
    // </FieldArrayFormProvider>
  );
}

export default CreateBlogPostForm;
