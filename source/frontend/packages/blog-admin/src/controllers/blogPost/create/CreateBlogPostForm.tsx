'use client';
import { useRouter } from 'next/navigation';
import type { Dispatch, SetStateAction } from 'react';
import { createContext, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { ContentDTO } from 'service/src/blogPostService/dto/contentDTO';
import { ApiBlogPostRepository } from 'shared-interface-adapter/src/repositories/apiBlogPostRepository';
import postTitleStyles from 'shared-ui/src/blogPost/styles/blogPostTitle.module.scss';
import CommonModalProvider from '../../../components/modal/CommonModalProvider';
import {
  CreateBlogPostUseCase,
  type BlogPostDTOForCreate,
} from '../../../usecases/create/createBlogPost';
import BlogPostEditor from './blogPostEditor/BlogPostEditor';
import styles from './createBlogPostForm.module.scss';
import { formDataToDTO } from './helper/formDataToDTO';
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
  const [contentsDTO, setContentsDTO] = useState<ContentDTO[]>([]);

  const { register, handleSubmit } = form;

  const router = useRouter();

  const onSubmit = async () => {
    const formValues = form.getValues();
    const blogPostDTO: BlogPostDTOForCreate = {
      ...formDataToDTO(formValues),
      contents: contentsDTO,
    };
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('API の URL が設定されていません');
    }
    const repository = new ApiBlogPostRepository(
      process.env.NEXT_PUBLIC_API_URL,
    );
    const createBlogPostUseCase = new CreateBlogPostUseCase(
      blogPostDTO,
      repository,
    );
    const createdBlogPost = await createBlogPostUseCase.execute();
    router.push(`/posts/create/success?id=${createdBlogPost.id}`);
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
          <ContentsDTOSetterContext.Provider value={setContentsDTO}>
            <BlogPostEditor />
          </ContentsDTOSetterContext.Provider>
        </div>
      </FormProvider>
    </>
  );
}

export default CreateBlogPostForm;

export const ContentsDTOSetterContext = createContext<
  Dispatch<SetStateAction<ContentDTO[]>>
>(() => {
  throw new Error('ContentsDTOSetterContext の設定が完了していません');
});
