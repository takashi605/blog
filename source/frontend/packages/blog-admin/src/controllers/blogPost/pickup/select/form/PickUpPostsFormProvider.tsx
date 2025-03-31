import { FormProvider, useForm } from 'react-hook-form';

export type PickUpPostsFormValues = {
  pickUpPosts: string[];
};

type PickUpPostsFormProviderProps = {
  defaultValues?: PickUpPostsFormValues;
  children: React.ReactNode;
};

function PickUpPostsFormProvider({ defaultValues, children }: PickUpPostsFormProviderProps) {
  const form = useForm<PickUpPostsFormValues>({
    defaultValues,
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}

export default PickUpPostsFormProvider;
