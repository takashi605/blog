'use client';
import { FieldArrayFormProvider } from '@/components/form/FieldArrayFormProvider';
import { createBlogPostAction } from '@/models/blogPost/create/formAction';
import AddContentButtonList from '@/models/blogPost/create/formParts/AddContentButton';
import ContentInputList from '@/models/blogPost/create/formParts/ContentInputList';
import type { CreateBlogPostFormData } from '@/models/blogPost/create/formSchema';
import { createBlogPostFormSchema } from '@/models/blogPost/create/formSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
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
    router.push('/');
  };

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      (async () => {
        const { mockApiForClient } = await import(
          '@/apiMocks/serverForClient'
        );
        mockApiForClient.start();
      })();
    }
  }, []);

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
