import { useFormContext } from 'react-hook-form';
import ImageInput from '../../../../components/form/parts/ImageInput';
import TextInput from '../../../../components/form/parts/TextInput';
import type { ImageUploadFormValues } from './ImageUploadFormProvider';

type ImageUploadFormProps = {
  onSubmit: (data: ImageUploadFormValues) => void;
};

function ImageUploadForm({ onSubmit }: ImageUploadFormProps) {
  const { register, handleSubmit } = useFormContext<ImageUploadFormValues>();
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ImageInput id="image" label="ファイルを選択" {...register('image')} />
      <TextInput id="name" label="画像名" {...register('imageName')} />
      <TextInput id="path" label="パス" {...register('imagePath')} />
      <button type="submit">アップロード</button>
    </form>
  );
}

export default ImageUploadForm;
