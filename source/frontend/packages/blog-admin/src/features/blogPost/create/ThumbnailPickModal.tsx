import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import type { Image } from 'shared-lib/src/api';
import CommonModal from '../../../components/modal/CommonModal';
import CommonModalCloseButton from '../../../components/modal/CommonModalCloseButton';
import CommonModalOpenButton from '../../../components/modal/CommonModalOpenButton';
import ImageListProvider from '../../images/list/ImageListProvider';
import ImagePicker from '../../images/pick/ImagePicker';

function ThumbnailPickModalWithOpenButton() {
  const { register, setValue } = useFormContext();

  const { onBlur, name, ref } = register('thumbnail.id');

  const onChangePickHandler = useCallback(
    (_e: React.ChangeEvent<HTMLInputElement>, image: Image) => {
      setValue('thumbnail.id', image.id);
      setValue('thumbnail.path', image.path);
    },
    [setValue],
  );

  return (
    <>
      <CommonModalOpenButton>サムネイル画像を選択</CommonModalOpenButton>
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
    </>
  );
}

export default ThumbnailPickModalWithOpenButton;
