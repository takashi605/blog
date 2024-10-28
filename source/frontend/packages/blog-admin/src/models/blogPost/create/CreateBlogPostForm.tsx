'use client';
import { FieldArrayFormProvider } from '@/components/form/FieldArrayFormProvider';
import { createBlogPostAction } from '@/models/blogPost/create/formAction';
import AddContentButtonList from '@/models/blogPost/create/formParts/AddContentButton';
import ContentInputList from '@/models/blogPost/create/formParts/ContentInputList';
import type { CreateBlogPostFormData } from '@/models/blogPost/create/formSchema';
import { createBlogPostFormSchema } from '@/models/blogPost/create/formSchema';
import { zodResolver } from '@hookform/resolvers/zod';
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

  return (
    <FieldArrayFormProvider {...form} {...fieldArray}>
      <form role="form" onSubmit={handleSubmit(createBlogPostAction)}>
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
