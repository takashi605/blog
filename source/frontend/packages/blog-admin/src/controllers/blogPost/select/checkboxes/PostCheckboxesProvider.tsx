import { FormProvider, useForm } from 'react-hook-form';

export type PostsCheckboxesFormValues = {
  checkedPosts: string[];
};

type PostCheckboxesFormProviderProps = {
  defaultValues?: PostsCheckboxesFormValues;
  children: React.ReactNode;
};

function PostCheckboxesFormProvider({
  defaultValues,
  children,
}: PostCheckboxesFormProviderProps) {
  const form = useForm<PostsCheckboxesFormValues>({
    defaultValues,
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}

export default PostCheckboxesFormProvider;
