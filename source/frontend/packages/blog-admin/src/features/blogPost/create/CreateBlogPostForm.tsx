'use client';
import { useRouter } from 'next/navigation';
import type { CreateBlogPostRequest } from 'shared-lib/src/api';
import { toISOStringWithTimezone } from 'shared-lib/src/utils/date';
import CommonModalProvider from '../../../components/modal/CommonModalProvider';
import { useCreateBlogPost } from '../api/useCreateBlogPost';
import { useBlogPostContentsContext } from './blogPostEditor/BlogPostContentsProvider';
import BlogPostEditor from './blogPostEditor/BlogPostEditor';
import styles from './createBlogPostForm.module.scss';
import { useBlogPostFormContext } from './form/BlogPostFormProvider';
import PublishedDatePicker from './form/PublishedDatePicker';
import SubmitButton from './form/SubmitButton';
import TitleInput from './form/TitleInput';
import ThumbnailPickModalWithOpenButton from './ThumbnailPickModal';
import ThumbnailPreview from './ThumbnailPreview';

export type CreateBlogPostFormData = {
  title: string;
  thumbnail: {
    id: string;
    path: string;
  };
  publishedDate: string;
};

function CreateBlogPostForm() {
  const router = useRouter();
  const { blogPostContents } = useBlogPostContentsContext();

  const form = useBlogPostFormContext();
  const { handleSubmit } = form;

  const { createBlogPost, error } = useCreateBlogPost();
  const onSubmit = async () => {
    const formValues = form.getValues();
    // 日付の生成
    const todaySlashDelimited = toISOStringWithTimezone(new Date())
      .split('T')[0]
      .replace('/', '-');

    // BlogPost型に合わせてデータを構築
    const blogPost: CreateBlogPostRequest = {
      title: formValues.title,
      thumbnail: formValues.thumbnail,
      postDate: todaySlashDelimited,
      lastUpdateDate: todaySlashDelimited,
      contents: blogPostContents,
      publishedDate: formValues.publishedDate,
    };

    try {
      const createdBlogPost = await createBlogPost(blogPost);
      router.push(`/posts/create/success?id=${createdBlogPost.id}`);
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
        <BlogPostEditor />
      </div>
    </>
  );
}

export default CreateBlogPostForm;
