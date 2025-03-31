import { FormProvider, useForm } from 'react-hook-form';

export type PickUpPostsFormValues = {
  pickUpPosts: string[];
};

type PickUpPostsFormProviderProps = {
  children: React.ReactNode;
};

function PickUpPostsFormProvider({ children }: PickUpPostsFormProviderProps) {
  const form = useForm<PickUpPostsFormValues>({
    defaultValues: {
      pickUpPosts: [],
    },
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}

export default PickUpPostsFormProvider;
