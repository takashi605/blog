'use client';
import { FieldArrayFormProvider } from '@/components/form/FieldArrayFormProvider';
import { createBlogPostAction } from '@/controllers/blogPost/create/formAction';
import AddContentButtonList from '@/controllers/blogPost/create/formParts/AddContentButton';
import ContentInputList from '@/controllers/blogPost/create/formParts/ContentInputList';
import type { CreateBlogPostFormData } from '@/controllers/blogPost/create/formSchema';
import { createBlogPostFormSchema } from '@/controllers/blogPost/create/formSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import type { SubmitHandler } from 'react-hook-form';
import { useFieldArray, useForm } from 'react-hook-form';

function CreateBlogPostForm() {
  const form = useForm<CreateBlogPostFormData>({
    resolver: zodResolver(createBlogPostFormSchema),
  });

  const { register, handleSubmit, control } = form;

  const fieldArray = useFieldArray<CreateBlogPostFormData>({
    control,
    name: 'contents',
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<CreateBlogPostFormData> = async (formData) => {
    await createBlogPostAction(formData);
    router.push('/posts/create/success');
  };

  return (
    <FieldArrayFormProvider {...form} {...fieldArray}>
      <form role="form" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="title">タイトル</label>

        <input id="title" {...register('title')} />
        <ContentInputList />

        <AddContentButtonList />
        <button type="submit">投稿</button>
      </form>
    </FieldArrayFormProvider>
  );
}

export default CreateBlogPostForm;
