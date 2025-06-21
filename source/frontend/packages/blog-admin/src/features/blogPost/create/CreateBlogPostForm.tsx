'use client';
import { useRouter } from 'next/navigation';
import type { Dispatch, SetStateAction } from 'react';
import { createContext, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { BlogPost, BlogPostContent } from 'shared-lib/src/api';
import { toISOStringWithTimezone } from 'shared-lib/src/utils/date';
import { createUUIDv4 } from 'shared-lib/src/utils/uuid';
import postTitleStyles from 'shared-ui/src/blogPost/styles/blogPostTitle.module.scss';
import CommonModalProvider from '../../../components/modal/CommonModalProvider';
import { useCreateBlogPost } from '../api/useCreateBlogPost';
import BlogPostEditor from './blogPostEditor/BlogPostEditor';
import styles from './createBlogPostForm.module.scss';
import ThumbnailPickModalWithOpenButton from './ThumbnailPickModal';
import ThumbnailPreview from './ThumbnailPreview';

export type CreateBlogPostFormData = {
  title: string;
  thumbnail: {
    id: string;
    path: string;
  };
};

function CreateBlogPostForm() {
  const form = useForm<CreateBlogPostFormData>({
    defaultValues: {
      title: '',
      thumbnail: {
        id: '',
        path: '',
      },
    },
  });
  const [blogPostContents, setBlogPostContents] = useState<BlogPostContent[]>(
    [],
  );
  const { createBlogPost, error } = useCreateBlogPost();

  const { register, handleSubmit } = form;

  const router = useRouter();

  const onSubmit = async () => {
    const formValues = form.getValues();
    // 日付の生成
    const today = toISOStringWithTimezone(new Date())
      .split('T')[0]
      .replace('/', '-');

    // BlogPost型に合わせてデータを構築
    const blogPost: BlogPost = {
      id: createUUIDv4(),
      title: formValues.title,
      thumbnail: formValues.thumbnail,
      postDate: today,
      lastUpdateDate: today,
      contents: blogPostContents,
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
      <FormProvider {...form}>
        <form
          className={styles.form}
          role="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className={styles.buttons}>
            <button className={styles.submitButton} type="submit">
              投稿
            </button>

            <CommonModalProvider>
              <ThumbnailPickModalWithOpenButton />
            </CommonModalProvider>
          </div>
          {error && <p role="alert">{error}</p>}

          <div className={styles.title}>
            <label htmlFor="title">タイトル</label>
            <input
              className={`${postTitleStyles.title} ${postTitleStyles.large} ${styles.titleInput}`}
              id="title"
              {...register('title')}
            />
          </div>
        </form>

        <ThumbnailPreview />

        <div>
          <h2>内容</h2>
          <BlogPostContentsSetterContext.Provider value={setBlogPostContents}>
            <BlogPostEditor />
          </BlogPostContentsSetterContext.Provider>
        </div>
      </FormProvider>
    </>
  );
}

export default CreateBlogPostForm;

export const BlogPostContentsSetterContext = createContext<
  Dispatch<SetStateAction<BlogPostContent[]>>
>(() => {
  throw new Error('BlogPostContentsSetterContext の設定が完了していません');
});
