'use client';
import { useRouter } from 'next/navigation';
import type { CreateBlogPostRequest } from 'shared-lib/src/api';
import { toISOStringWithTimezone } from 'shared-lib/src/utils/date';
import CommonModalProvider from '../../../components/modal/CommonModalProvider';
import { useCreateBlogPost } from '../api/useCreateBlogPost';
import { useBlogPostContentsContext } from '../editor/blogPostEditor/BlogPostContentsProvider';
import BlogPostEditor from '../editor/blogPostEditor/BlogPostEditor';
import {
  useBlogPostFormContext,
  type BlogPostFormData,
} from '../editor/form/BlogPostFormProvider';
import PublishedDatePicker from '../editor/form/PublishedDatePicker';
import SubmitButton from '../editor/form/SubmitButton';
import TitleInput from '../editor/form/TitleInput';
import ThumbnailPickModalWithOpenButton from '../editor/ThumbnailPickModal';
import ThumbnailPreview from '../editor/ThumbnailPreview';
import styles from './createBlogPostForm.module.scss';

function CreateBlogPostForm() {
  const router = useRouter();
  const { blogPostContents } = useBlogPostContentsContext();

  const form = useBlogPostFormContext();
  const { handleSubmit } = form;

  const { createBlogPost, error } = useCreateBlogPost();
  const onSubmit = async (formValues: BlogPostFormData) => {
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

              <SubmitButton>投稿</SubmitButton>
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
