import { useFormContext } from 'react-hook-form';
import ErrorMessage from '../../../../components/form/parts/ErrorMessage';
import ImageInput from '../../../../components/form/parts/ImageInput';
import TextInput from '../../../../components/form/parts/TextInput';
import UploadButton from '../ui/UploadButton';
import type { ImageUploadFormValues } from './ImageUploadFormProvider';

type ImageUploadFormProps = {
  onSubmit: (data: ImageUploadFormValues) => void;
  errorMessage?: string;
  loading?: boolean;
};

function ImageUploadForm({
  onSubmit,
  errorMessage,
  loading = false,
}: ImageUploadFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext<ImageUploadFormValues>();
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ImageInput
        id="image"
        label="ファイルを選択"
        {...register('image', {
          validate: (files) => {
            if (!files || files.length === 0) {
              return '画像ファイルを選択してください';
            }
            return true;
          },
        })}
      />
      {errors.image && <ErrorMessage>{errors.image.message}</ErrorMessage>}
      <TextInput
        id="name"
        label="画像名"
        {...register('imagePath', {
          required: '画像名を入力してください',
        })}
      />
      {errors.imagePath && (
        <ErrorMessage>{errors.imagePath.message}</ErrorMessage>
      )}
      <UploadButton loading={loading}>
        {loading ? 'アップロード中...' : 'アップロード'}
      </UploadButton>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </form>
  );
}

export default ImageUploadForm;
