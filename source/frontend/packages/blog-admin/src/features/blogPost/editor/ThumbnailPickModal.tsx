import { useCallback, useState } from 'react';
import type { Image } from 'shared-lib/src/api';
import ErrorMessage from '../../../components/form/parts/ErrorMessage';
import CommonModal from '../../../components/modal/CommonModal';
import CommonModalCloseButton from '../../../components/modal/CommonModalCloseButton';
import CommonModalOpenButton from '../../../components/modal/CommonModalOpenButton';
import { useCommonModalContext } from '../../../components/modal/CommonModalProvider';
import CommonModalSubmitButton from '../../../components/modal/CommonModalSubmitButton';
import ImageListProvider from '../../images/list/ImageListProvider';
import ImagePicker from '../../images/pick/ImagePicker';
import { useBlogPostFormContext } from './form/BlogPostFormProvider';

function ThumbnailPickModalWithOpenButton() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useBlogPostFormContext();
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const { closeModal } = useCommonModalContext();

  const { onBlur, name, ref } = register('thumbnail.id', {
    required: 'サムネイル画像は必須です',
  });

  const onChangePickHandler = useCallback(
    (_e: React.ChangeEvent<HTMLInputElement>, image: Image) => {
      setSelectedImage(image);
    },
    [],
  );

  const onClickSelectButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (selectedImage) {
      setValue('thumbnail.id', selectedImage.id, { shouldDirty: true });
      setValue('thumbnail.path', selectedImage.path, { shouldDirty: true });
      closeModal();
    }
  };

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
            selectedImageId={selectedImage?.id}
          />
        </ImageListProvider>
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            justifyContent: 'flex-end',
            marginTop: '1rem',
          }}
        >
          <CommonModalCloseButton>閉じる</CommonModalCloseButton>
          <CommonModalSubmitButton
            type="button"
            onClick={onClickSelectButton}
            disabled={!selectedImage}
          >
            選択
          </CommonModalSubmitButton>
        </div>
      </CommonModal>
    </div>
  );
}

export default ThumbnailPickModalWithOpenButton;
