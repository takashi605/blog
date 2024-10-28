// 下記を参考に作成
// github.com/orgs/react-hook-form/discussions/3942#discussioncomment-9165585

import type { CreateBlogPostFormData } from '@/models/blogPost/create/formSchema';
import React, { useContext } from 'react';
import type { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';

type AllFormMethods = UseFormReturn<CreateBlogPostFormData> &
  UseFieldArrayReturn<CreateBlogPostFormData>;

const FieldArrayFormContext = React.createContext<AllFormMethods | null>(null);

FieldArrayFormContext.displayName = 'RHFArrayContext';

export const useFieldArrayFormContext = (): AllFormMethods => {
  return useContext(FieldArrayFormContext) as AllFormMethods;
};

export declare type FieldArrayFormProviderProps = {
  children: React.ReactNode;
} & AllFormMethods;

export const FieldArrayFormProvider = ({
  children,
  ...props
}: FieldArrayFormProviderProps) => {
  return (
    <FieldArrayFormContext.Provider value={{ ...props } as AllFormMethods}>
      {children}
    </FieldArrayFormContext.Provider>
  );
};
