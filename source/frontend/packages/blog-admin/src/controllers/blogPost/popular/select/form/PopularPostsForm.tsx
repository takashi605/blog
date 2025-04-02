'use client';
import { useFormContext } from 'react-hook-form';
import { useBlogPostList } from '../../../list/useBlogPostList';
import type { PopularPostsFormValues } from './PopularPostsFormProvider';

type PopularPostsFormProps = {
  onSubmit: (data: PopularPostsFormValues) => void;
};

function PopularPostsForm({ onSubmit }: PopularPostsFormProps) {
  const { getAllBlogPosts } = useBlogPostList();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext<PopularPostsFormValues>();
  const pickupError = errors?.popularPosts;

  return (
    <>
      <h2>人気記事を選択</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ul>
          {getAllBlogPosts().map((blogPost) => (
            <li key={blogPost.id}>
              <label>
                <input
                  type="checkbox"
                  value={blogPost.id}
                  {...register('popularPosts', {
                    validate: (value) =>
                      value.length === 3 || '人気記事は3件選択してください',
                  })}
                />
                <h3>{blogPost.title}</h3>
                <br />
              </label>
            </li>
          ))}
        </ul>

        {pickupError && <p>{pickupError.message}</p>}

        <button type="submit">保存</button>
      </form>
    </>
  );
}

export default PopularPostsForm;
