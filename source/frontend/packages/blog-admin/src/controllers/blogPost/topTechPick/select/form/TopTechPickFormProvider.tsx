import { FormProvider, useForm } from 'react-hook-form';

export type TopTechPickFormValues = {
  topTechPickPosts: string[];
};

type TopTechPickFormProviderProps = {
  defaultValues?: TopTechPickFormValues;
  children: React.ReactNode;
};

function TopTechPickFormProvider({
  defaultValues,
  children,
}: TopTechPickFormProviderProps) {
  const form = useForm<TopTechPickFormValues>({
    defaultValues,
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}

export default TopTechPickFormProvider;
