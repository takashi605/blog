import postTitleStyles from 'shared-ui/src/blogPost/styles/blogPostTitle.module.scss';
import ErrorMessage from '../../../../components/form/parts/ErrorMessage';
import { useBlogPostFormContext } from './BlogPostFormProvider';
import styles from './titleInput.module.scss';

function TitleInput() {
  const {
    register,
    formState: { errors },
  } = useBlogPostFormContext();

  return (
    <div className={styles.title}>
      <label htmlFor="title">タイトル</label>
      <input
        className={`${postTitleStyles.title} ${postTitleStyles.large} ${styles.titleInput}`}
        id="title"
        {...register('title', { required: 'タイトルは必須です' })}
      />
      {errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}
    </div>
  );
}

export default TitleInput;
