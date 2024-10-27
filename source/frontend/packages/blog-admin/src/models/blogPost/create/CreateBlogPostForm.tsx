import type { CreateBlogPostFormData } from '@/models/blogPost/create/formAction';
import {
  createBlogPostAction,
  createBlogPostFormSchema,
} from '@/models/blogPost/create/formAction';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';

function CreateBlogPostForm() {
  const { register, handleSubmit, control } = useForm<CreateBlogPostFormData>({
    resolver: zodResolver(createBlogPostFormSchema),
  });

  const { fields, append } = useFieldArray({
    control,
    name: 'contents',
  });

  return (
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
      <button type="button" onClick={() => append({ type: 'h2', text: '' })}>
        h2
      </button>
      <button type="submit">投稿</button>
    </form>
  );
}

export default CreateBlogPostForm;
