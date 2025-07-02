'use client';
import ErrorMessage from '../../../../components/form/parts/ErrorMessage';
import { useBlogPostFormContext } from './BlogPostFormProvider';
import styles from './publishedDatePicker.module.scss';

function PublishedDatePicker() {
  const {
    register,
    formState: { errors },
  } = useBlogPostFormContext();

  return (
    <div className={styles.publishedDate}>
      <label htmlFor="publishedDate">公開日</label>
      <input
        type="date"
        id="publishedDate"
        role="combobox"
        aria-label="公開日"
        aria-expanded="false"
        aria-controls="publishedDate"
        {...register('publishedDate', { required: '公開日を選択してください' })}
      />
      {errors.publishedDate && (
        <ErrorMessage>{errors.publishedDate.message}</ErrorMessage>
      )}
    </div>
  );
}

export default PublishedDatePicker;
