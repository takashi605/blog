import CommonModal from '../../../components/modal/CommonModal';
import CommonModalCloseButton from '../../../components/modal/CommonModalCloseButton';
import ImageListProvider from '../list/ImageListProvider';
import ImagePicker from './ImagePicker';

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

export default ImagePickModal;
