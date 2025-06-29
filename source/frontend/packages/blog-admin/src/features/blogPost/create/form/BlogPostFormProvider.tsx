'use client';
import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { FormProvider, useForm, type UseFormReturn } from 'react-hook-form';
import type { CreateBlogPostFormData } from '../CreateBlogPostForm';

type BlogPostFormState = UseFormReturn<CreateBlogPostFormData>;

type BlogPostFormProviderProps = {
  children: ReactNode;
  defaultValues?: Partial<CreateBlogPostFormData>;
};

const BlogPostFormContext = createContext<BlogPostFormState | null>(null);

export function BlogPostFormProvider({
  children,
  defaultValues,
}: BlogPostFormProviderProps) {
  // 今日の日付をYYYY-MM-DD形式で取得
  const todayHyphenDelimited = new Date().toISOString().split('T')[0];

  const form = useForm<CreateBlogPostFormData>({
    defaultValues: {
      title: '',
      thumbnail: {
        id: '',
        path: '',
      },
      publishedDate: todayHyphenDelimited,
      ...defaultValues,
    },
  });

  return (
    <FormProvider {...form}>
      <BlogPostFormContext.Provider value={form}>
        {children}
      </BlogPostFormContext.Provider>
    </FormProvider>
  );
}

/**
 * BlogPostFormのコンテキストにアクセスするためのカスタムフック
 * useContextのラッパーとして機能
 */
export const useBlogPostFormContext = () => {
  const formState = useContext(BlogPostFormContext);
  if (formState === null) {
    throw new Error(
      'useBlogPostFormContext は BlogPostFormProvider でラップされていなければ利用できません',
    );
  }
  return formState;
};
