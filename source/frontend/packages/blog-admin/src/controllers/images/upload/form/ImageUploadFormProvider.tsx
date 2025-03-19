import { FormProvider, useForm } from 'react-hook-form';

export type ImageUploadFormValues = {
  image: FileList | null;
  imageName: string;
  imagePath: string;
};

type ImageUploadFormProviderProps = {
  children: React.ReactNode;
};

function ImageUploadFormProvider({ children }: ImageUploadFormProviderProps) {
  const form = useForm<ImageUploadFormValues>({
    defaultValues: {
      image: null,
      imageName: '',
      imagePath: '',
    },
  });
  return <FormProvider {...form}>{children}</FormProvider>;
}

export default ImageUploadFormProvider;
