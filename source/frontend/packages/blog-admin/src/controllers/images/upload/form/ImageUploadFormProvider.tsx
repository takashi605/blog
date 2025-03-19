import { FormProvider, useForm } from 'react-hook-form';

type ImageUploadFormProviderProps = {
  children: React.ReactNode;
};

function ImageUploadFormProvider({ children }: ImageUploadFormProviderProps) {
  const form = useForm({
    defaultValues: {
      imageName: '',
      imagePath: '',
    },
  });
  return <FormProvider {...form}>{children}</FormProvider>;
}

export default ImageUploadFormProvider;
