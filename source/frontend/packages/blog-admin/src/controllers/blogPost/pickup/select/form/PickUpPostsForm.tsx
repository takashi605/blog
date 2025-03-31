'use client';
import { useFormContext } from 'react-hook-form';
import { useBlogPostList } from '../../../list/useBlogPostList';
import type { PickUpPostsFormValues } from './PickUpPostsFormProvider';

type PickUpPostsFormProps = {
  onSubmit: (data: PickUpPostsFormValues) => void;
};

function PickUpPostsForm({ onSubmit }: PickUpPostsFormProps) {
  const { getAllBlogPosts } = useBlogPostList();
  const { register, handleSubmit } = useFormContext<PickUpPostsFormValues>();

  return (
    <>
      <h2>ピックアップ記事を選択</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ul>
          {getAllBlogPosts().map((blogPost) => (
            <label key={blogPost.id}>
              <input
                type="checkbox"
                value={blogPost.id}
                {...register('pickUpPosts')}
              />
              <h3>{blogPost.title}</h3>
              <br />
            </label>
          ))}
        </ul>

        <button type="submit">保存</button>
      </form>
    </>
  );
}

export default PickUpPostsForm;
