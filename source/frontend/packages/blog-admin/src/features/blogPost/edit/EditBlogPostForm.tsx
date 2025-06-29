'use client';
import type { components } from 'shared-lib/src/generated';
import CommonModalProvider from '../../../components/modal/CommonModalProvider';
import { useBlogPostContentsContext } from '../editor/blogPostEditor/BlogPostContentsProvider';
import BlogPostEditor from '../editor/blogPostEditor/BlogPostEditor';
import { useBlogPostFormContext } from '../editor/form/BlogPostFormProvider';
import PublishedDatePicker from '../editor/form/PublishedDatePicker';
import SubmitButton from '../editor/form/SubmitButton';
import TitleInput from '../editor/form/TitleInput';
import ThumbnailPickModalWithOpenButton from '../editor/ThumbnailPickModal';
import ThumbnailPreview from '../editor/ThumbnailPreview';
import styles from './editBlogPostForm.module.scss';

export type EditBlogPostFormData = {
  title: string;
  thumbnail: {
    id: string;
    path: string;
  };
  publishedDate: string;
};

type BlogPost = components['schemas']['BlogPost'];

interface EditBlogPostFormProps {
  initialData: BlogPost;
}

function EditBlogPostForm({ initialData }: EditBlogPostFormProps) {
  const { blogPostContents } = useBlogPostContentsContext();

  const form = useBlogPostFormContext();
  const { handleSubmit } = form;

  const onSubmit = async () => {
    const formValues = form.getValues();

    console.log('編集フォーム送信データ:', {
      title: formValues.title,
      thumbnail: formValues.thumbnail,
      publishedDate: formValues.publishedDate,
      contents: blogPostContents,
      originalData: initialData,
    });

    alert(
      '編集処理はまだ実装されていません。コンソールにデータが出力されました。',
    );
  };

  return (
    <>
      <form
        className={styles.form}
        role="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={styles.formHeader}>
          <TitleInput />

          <div className={styles.controlsContainer}>
            <div className={styles.publishedDateContainer}>
              <PublishedDatePicker />
            </div>

            <div className={styles.buttons}>
              <CommonModalProvider>
                <ThumbnailPickModalWithOpenButton />
              </CommonModalProvider>

              <SubmitButton />
            </div>
          </div>
        </div>
      </form>

      <ThumbnailPreview />

      <div>
        <h2>内容</h2>
        <BlogPostEditor initialContents={initialData.contents} />
      </div>
    </>
  );
}

export default EditBlogPostForm;
