import { FieldArrayFormProvider } from '@/components/form/FieldArrayFormProvider';
import { createBlogPostAction } from '@/models/blogPost/create/formAction';
import AddContentButtonList from '@/models/blogPost/create/formParts/AddContentButton';
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

  const { fields } = fieldArray;

  return (
    <FieldArrayFormProvider {...form} {...fieldArray}>
      <form role="form" onSubmit={handleSubmit(createBlogPostAction)}>
        <label htmlFor="title">タイトル</label>
        <input id="title" {...register('title')} />
        {fields.map((field, index) => (
          <div key={field.id}>
            <label htmlFor={`contents.${index}.text`}>{field.type}</label>
            <input
              id={`contents.${index}.text`}
              {...register(`contents.${index}.text` as const)}
            />
          </div>
        ))}

        <AddContentButtonList />
        <button type="submit">投稿</button>
      </form>
    </FieldArrayFormProvider>
  );
}

export default CreateBlogPostForm;
