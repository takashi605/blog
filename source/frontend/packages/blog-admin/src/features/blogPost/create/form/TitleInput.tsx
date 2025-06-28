import { useFormContext } from 'react-hook-form';
import postTitleStyles from 'shared-ui/src/blogPost/styles/blogPostTitle.module.scss';
import type { CreateBlogPostFormData } from '../CreateBlogPostForm';
import styles from './titleInput.module.scss';

function TitleInput() {
  const { register } = useFormContext<CreateBlogPostFormData>();

  return (
    <div className={styles.title}>
      <label htmlFor="title">タイトル</label>
      <input
        className={`${postTitleStyles.title} ${postTitleStyles.large} ${styles.titleInput}`}
        id="title"
        {...register('title')}
      />
    </div>
  );
}

export default TitleInput;
