'use client';
import { useRouter } from 'next/navigation';
import type { UpdateBlogPostRequest } from 'shared-lib/src/api';
import type { components } from 'shared-lib/src/generated';
import CommonModalProvider from '../../../components/modal/CommonModalProvider';
import { useUpdateBlogPost } from '../api/useUpdateBlogPost';
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
  const router = useRouter();
  const { blogPostContents } = useBlogPostContentsContext();

  const form = useBlogPostFormContext();
  const { handleSubmit } = form;

  const { updateBlogPost, error } = useUpdateBlogPost();

  const onSubmit = async () => {
    const formValues = form.getValues();

    // UpdateBlogPostRequest型に合わせてデータを構築
    const updateRequest: UpdateBlogPostRequest = {
      title: formValues.title,
      thumbnail: formValues.thumbnail,
      publishedDate: formValues.publishedDate,
      contents: blogPostContents,
    };

    try {
      const updatedBlogPost = await updateBlogPost(
        initialData.id,
        updateRequest,
      );
      router.push(`/posts/${updatedBlogPost.id}/edit/success`);
    } catch (e) {
      // エラーメッセージはフック内で設定されるため、ここでは何もしない
    }
  };

  return (
    <>
      <form
        className={styles.form}
        role="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        {error && <p role="alert">{error}</p>}
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
