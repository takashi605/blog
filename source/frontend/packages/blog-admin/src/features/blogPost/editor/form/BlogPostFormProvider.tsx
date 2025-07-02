'use client';
import type { ReactNode } from 'react';
import { createContext } from 'react';
import {
  FormProvider,
  useForm,
  useFormContext,
  type UseFormReturn,
} from 'react-hook-form';
export type BlogPostFormData = {
  title: string;
  thumbnail: {
    id: string;
    path: string;
  };
  publishedDate: string;
};

type BlogPostFormState = UseFormReturn<BlogPostFormData>;

type BlogPostFormProviderProps = {
  children: ReactNode;
  defaultValues?: Partial<BlogPostFormData>;
};

const BlogPostFormContext = createContext<BlogPostFormState | null>(null);

export function BlogPostFormProvider({
  children,
  defaultValues,
}: BlogPostFormProviderProps) {
  // 今日の日付をYYYY-MM-DD形式で取得
  const todayHyphenDelimited = new Date().toISOString().split('T')[0];

  const form = useForm<BlogPostFormData>({
    mode: 'onSubmit',
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
  const formState = useFormContext<BlogPostFormData>();
  if (formState === null) {
    throw new Error(
      'useBlogPostFormContext は BlogPostFormProvider でラップされていなければ利用できません',
    );
  }
  return formState;
};
