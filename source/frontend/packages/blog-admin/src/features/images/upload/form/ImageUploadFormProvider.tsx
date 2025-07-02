import { FormProvider, useForm } from 'react-hook-form';

export type ImageUploadFormValues = {
  image: FileList | null;
  imagePath: string;
};

type ImageUploadFormProviderProps = {
  children: React.ReactNode;
};

function ImageUploadFormProvider({ children }: ImageUploadFormProviderProps) {
  const form = useForm<ImageUploadFormValues>({
    defaultValues: {
      image: null,
      imagePath: '',
    },
  });
  return <FormProvider {...form}>{children}</FormProvider>;
}

export default ImageUploadFormProvider;
