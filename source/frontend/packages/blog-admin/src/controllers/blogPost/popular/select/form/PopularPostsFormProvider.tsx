import { FormProvider, useForm } from 'react-hook-form';

export type PopularPostsFormValues = {
  popularPosts: string[];
};

type PopularPostsFormProviderProps = {
  defaultValues?: PopularPostsFormValues;
  children: React.ReactNode;
};

function PopularPostsFormProvider({
  defaultValues,
  children,
}: PopularPostsFormProviderProps) {
  const form = useForm<PopularPostsFormValues>({
    defaultValues,
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}

export default PopularPostsFormProvider;
