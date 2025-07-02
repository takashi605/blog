import { useFormContext } from 'react-hook-form';
import ImageInput from '../../../../components/form/parts/ImageInput';
import TextInput from '../../../../components/form/parts/TextInput';
import UploadButton from '../ui/UploadButton';
import type { ImageUploadFormValues } from './ImageUploadFormProvider';

type ImageUploadFormProps = {
  onSubmit: (data: ImageUploadFormValues) => void;
  errorMessage?: string;
  loading?: boolean;
};

function ImageUploadForm({ onSubmit, errorMessage, loading = false }: ImageUploadFormProps) {
  const { register, handleSubmit } = useFormContext<ImageUploadFormValues>();
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ImageInput id="image" label="ファイルを選択" {...register('image')} />
      <TextInput id="name" label="画像名" {...register('imagePath')} />
      <UploadButton loading={loading}>
        {loading ? 'アップロード中...' : 'アップロード'}
      </UploadButton>
      {errorMessage && (
        <p role="alert" style={{ color: 'red' }}>
          {errorMessage}
        </p>
      )}
    </form>
  );
}

export default ImageUploadForm;
