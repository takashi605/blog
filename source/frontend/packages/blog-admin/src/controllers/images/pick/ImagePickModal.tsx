import CommonModal from '../../../components/modal/CommonModal';
import CommonModalOpenButton from '../../../components/modal/CommonModalOpenButton';
import { useCommonModalContext } from '../../../components/modal/CommonModalProvider';
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
  const { closeModal } = useCommonModalContext();

  return (
    <CommonModal>
      <ImageListProvider>
        <ImagePicker />
      </ImageListProvider>
      <button onClick={closeModal} className="modal-close" type="button">
        閉じる
      </button>
    </CommonModal>
  );
}

export default ImagePickModalWithOpenButton;
