'use client';
import { useRouter } from 'next/navigation';
import type { UpdateBlogPostRequest } from 'shared-lib/src/api';
import type { components } from 'shared-lib/src/generated';
import ErrorMessage from '../../../components/form/parts/ErrorMessage';
import CommonModalProvider from '../../../components/modal/CommonModalProvider';
import { useUpdateBlogPost } from '../api/useUpdateBlogPost';
import { useBlogPostContentsContext } from '../editor/blogPostEditor/BlogPostContentsProvider';
import BlogPostEditor from '../editor/blogPostEditor/BlogPostEditor';
import type { BlogPostFormData } from '../editor/form/BlogPostFormProvider';
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

  const { updateBlogPost, error, loading } = useUpdateBlogPost();

  const onSubmit = async (formValues: BlogPostFormData) => {
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
      <div className={styles.formSection}>
        <form
          className={styles.form}
          role="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          {error && <ErrorMessage>{error}</ErrorMessage>}
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

                <SubmitButton isLoading={loading} loadingText="更新中...">
                  編集確定
                </SubmitButton>
              </div>
            </div>
          </div>
        </form>

        <ThumbnailPreview />
      </div>

      <div>
        <h2>内容</h2>
        <BlogPostEditor initialContents={initialData.contents} />
      </div>
    </>
  );
}

export default EditBlogPostForm;
