import { useCallback } from 'react';
import type { Image } from 'shared-lib/src/api';
import ErrorMessage from '../../../components/form/parts/ErrorMessage';
import CommonModal from '../../../components/modal/CommonModal';
import CommonModalCloseButton from '../../../components/modal/CommonModalCloseButton';
import CommonModalOpenButton from '../../../components/modal/CommonModalOpenButton';
import ImageListProvider from '../../images/list/ImageListProvider';
import ImagePicker from '../../images/pick/ImagePicker';
import { useBlogPostFormContext } from './form/BlogPostFormProvider';

function ThumbnailPickModalWithOpenButton() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useBlogPostFormContext();

  const { onBlur, name, ref } = register('thumbnail.id', {
    required: 'サムネイル画像は必須です',
  });

  const onChangePickHandler = useCallback(
    (_e: React.ChangeEvent<HTMLInputElement>, image: Image) => {
      setValue('thumbnail.id', image.id, { shouldDirty: true });
      setValue('thumbnail.path', image.path, { shouldDirty: true });
    },
    [setValue],
  );

  return (
    <div style={{ position: 'relative' }}>
      <CommonModalOpenButton>サムネイル画像を選択</CommonModalOpenButton>
      {errors.thumbnail?.id && (
        <ErrorMessage absolute>{errors.thumbnail.id.message}</ErrorMessage>
      )}
      <CommonModal>
        <ImageListProvider>
          <ImagePicker
            onChange={onChangePickHandler}
            onBlur={onBlur}
            name={name}
            ref={ref}
          />
        </ImageListProvider>
        <CommonModalCloseButton>閉じる</CommonModalCloseButton>
      </CommonModal>
    </div>
  );
}

export default ThumbnailPickModalWithOpenButton;
