import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useBlogPostList } from '../../list/useBlogPostList';
import type { PostsCheckboxesFormValues } from './PostCheckboxesProvider';
import styles from './postCheckboxes.module.scss';

type PostsCheckboxesProps = {
  onSubmit: (data: PostsCheckboxesFormValues) => void;
  validate: (value: string[]) => boolean | string;
};

function PostCheckboxes({ onSubmit, validate }: PostsCheckboxesProps) {
  const { getAllBlogPosts } = useBlogPostList();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext<PostsCheckboxesFormValues>();
  const error = errors?.checkedPosts;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ul>
        {getAllBlogPosts().map((blogPost) => (
          <li key={blogPost.id}>
            <label className={styles.label}>
              <input
                className={styles.checkbox}
                type="checkbox"
                value={blogPost.id}
                {...register('checkedPosts', {
                  validate,
                })}
              />
              <h3>{blogPost.title}</h3>
            </label>
          </li>
        ))}
      </ul>

      {error && <p>{error.message}</p>}

      <button type="submit">保存</button>
    </form>
  );
}

export default React.memo(PostCheckboxes);
