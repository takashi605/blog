import { useFormContext } from 'react-hook-form';
import TextInput from '../../../../components/form/parts/TextInput';
import type { ImageUploadFormValues } from './ImageUploadFormProvider';

type ImageUploadFormProps = {
  onSubmit: (data: ImageUploadFormValues) => void;
};

function ImageUploadForm({ onSubmit }: ImageUploadFormProps) {
  const { register, handleSubmit } = useFormContext<ImageUploadFormValues>();
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="image">ファイルを選択</label>
        <input id="image" type="file" />
      </div>
      <TextInput id="name" label="画像名" {...register('imageName')} />
      <TextInput id="path" label="パス" {...register('imagePath')} />
      <button type="submit">アップロード</button>
    </form>
  );
}

export default ImageUploadForm;
