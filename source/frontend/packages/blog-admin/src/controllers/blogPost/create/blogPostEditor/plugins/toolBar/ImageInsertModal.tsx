import CommonModal from '../../../../../../components/modal/CommonModal';
import CommonModalCloseButton from '../../../../../../components/modal/CommonModalCloseButton';
import CommonModalOpenButton from '../../../../../../components/modal/CommonModalOpenButton';
import ImageListProvider from '../../../../../images/list/ImageListProvider';

function ImageInsertModalWithOpenButton() {
  // const { register, setValue } = useFormContext();

  // const { onChange, onBlur, name, ref } = register('thumbnail.id');

  // const onChangePickHandler = useCallback(
  //   (e: React.ChangeEvent<HTMLInputElement>) => {
  //     onChange(e);
  //     setValue('thumbnail.path', e.target.value);
  //   },
  //   [onChange, setValue],
  // );

  return (
    <>
      <CommonModalOpenButton>画像を挿入</CommonModalOpenButton>
      <CommonModal>
        <ImageListProvider>
          {/* <ImagePicker
            onChange={onChangePickHandler}
            onBlur={onBlur}
            name={name}
            ref={ref}
          /> */}
          リスト
        </ImageListProvider>
        <CommonModalCloseButton>閉じる</CommonModalCloseButton>
      </CommonModal>
    </>
  );
}

export default ImageInsertModalWithOpenButton;
