import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import CommonModal from '../../../components/modal/CommonModal';
import CommonModalCloseButton from '../../../components/modal/CommonModalCloseButton';
import CommonModalOpenButton from '../../../components/modal/CommonModalOpenButton';
import ImageListProvider from '../../images/list/ImageListProvider';
import ImagePicker from '../../images/pick/ImagePicker';

function ThumbnailPickModalWithOpenButton() {
  const { register, setValue } = useFormContext();

  const { onChange, onBlur, name, ref } = register('thumbnail.id');

  const onChangePickHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e);
      setValue('thumbnail.path', e.target.value);
    },
    [onChange, setValue],
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
