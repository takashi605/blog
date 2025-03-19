import { FormProvider, useForm } from 'react-hook-form';

export type ImageUploadFormValues = {
  imageName: string;
  imagePath: string;
};

type ImageUploadFormProviderProps = {
  children: React.ReactNode;
};

function ImageUploadFormProvider({ children }: ImageUploadFormProviderProps) {
  const form = useForm<ImageUploadFormValues>({
    defaultValues: {
      imageName: '',
      imagePath: '',
    },
  });
  return <FormProvider {...form}>{children}</FormProvider>;
}

export default ImageUploadFormProvider;
