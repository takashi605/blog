import type { CreateBlogPostFormData } from '@/models/blogPost/create/formAction';
import {
  createBlogPostAction,
  createBlogPostFormSchema,
} from '@/models/blogPost/create/formAction';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

function CreateBlogPostForm() {
  const { register, handleSubmit } = useForm<CreateBlogPostFormData>({
    resolver: zodResolver(createBlogPostFormSchema),
  });

  return (
    <form role="form" onSubmit={handleSubmit(createBlogPostAction)}>
      <label htmlFor="title">タイトル</label>
      <input id="title" {...register('title')} />
      <button type="submit">投稿</button>
    </form>
  );
}

export default CreateBlogPostForm;
