import CommonModal from '../../../components/modal/CommonModal';
import CommonModalCloseButton from '../../../components/modal/CommonModalCloseButton';
import CommonModalOpenButton from '../../../components/modal/CommonModalOpenButton';
import ImageListProvider from '../list/ImageListProvider';
import ImagePicker from './ImagePicker';

type ImagePickModalWithOpenButtonProps = {
  buttonText: string;
};

function ImagePickModalWithOpenButton({
  buttonText,
}: ImagePickModalWithOpenButtonProps) {
  return (
    <>
      <CommonModalOpenButton>{buttonText}</CommonModalOpenButton>
      <ImagePickModal />
    </>
  );
}

function ImagePickModal() {
  return (
    <CommonModal>
      <ImageListProvider>
        <ImagePicker />
      </ImageListProvider>
      <CommonModalCloseButton>閉じる</CommonModalCloseButton>
    </CommonModal>
  );
}

export default ImagePickModalWithOpenButton;
