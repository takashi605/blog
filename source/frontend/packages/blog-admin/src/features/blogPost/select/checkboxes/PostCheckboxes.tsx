import CommonModalSubmitButton from '@/components/modal/CommonModalSubmitButton';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useBlogPostList } from '../../list/useBlogPostList';
import styles from './postCheckboxes.module.scss';
import type { PostsCheckboxesFormValues } from './PostCheckboxesProvider';

type PostsCheckboxesProps = {
  onSubmit: (data: PostsCheckboxesFormValues) => void;
  validate: (value: string[]) => boolean | string;
};

function PostCheckboxes({ onSubmit, validate }: PostsCheckboxesProps) {
  const { getAllBlogPosts } = useBlogPostList({ includeUnpublished: false });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext<PostsCheckboxesFormValues>();
  const error = errors?.checkedPosts;

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <ul className={styles.postList}>
        {getAllBlogPosts().map((blogPost) => (
          <li key={blogPost.id} className={styles.postItem}>
            <label className={styles.label}>
              <input
                className={styles.checkbox}
                type="checkbox"
                value={blogPost.id}
                {...register('checkedPosts', {
                  validate,
                })}
              />
              <h3 className={styles.postTitle}>{blogPost.title}</h3>
            </label>
          </li>
        ))}
      </ul>

      {error && <p className={styles.errorMessage}>{error.message}</p>}

      <CommonModalSubmitButton>保存</CommonModalSubmitButton>
    </form>
  );
}

export default React.memo(PostCheckboxes);
