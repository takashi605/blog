'use client';
import { useFormContext } from 'react-hook-form';
import type { CreateBlogPostFormData } from '../CreateBlogPostForm';
import styles from './publishedDatePicker.module.scss';

function PublishedDatePicker() {
  const { register } = useFormContext<CreateBlogPostFormData>();

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
        {...register('publishedDate')}
      />
    </div>
  );
}

export default PublishedDatePicker;