'use client';
import { useFormContext } from 'react-hook-form';
import { useBlogPostList } from '../../../list/useBlogPostList';
import type { TopTechPickFormValues } from './TopTechPickFormProvider';

type TopTechPickFormProps = {
  onSubmit: (data: TopTechPickFormValues) => void;
};

function TopTechPickForm({ onSubmit }: TopTechPickFormProps) {
  const { getAllBlogPosts } = useBlogPostList();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext<TopTechPickFormValues>();
  const pickupError = errors?.topTechPickPosts;

  return (
    <>
      <h2>ピックアップ記事を選択</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ul>
          {getAllBlogPosts().map((blogPost) => (
            <li key={blogPost.id}>
              <label>
                <input
                  type="checkbox"
                  value={blogPost.id}
                  {...register('topTechPickPosts', {
                    validate: (value) =>
                      value.length === 1 ||
                      'トップテック記事は必ず1つのみ選択してください',
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

export default TopTechPickForm;
