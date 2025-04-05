import CommonModal from '../../../components/modal/CommonModal';
import CommonModalCloseButton from '../../../components/modal/CommonModalCloseButton';
import CommonModalOpenButton from '../../../components/modal/CommonModalOpenButton';
import ImageListProvider from '../../images/list/ImageListProvider';
import ImagePicker from '../../images/pick/ImagePicker';

function ThumbnailPickModalWithOpenButton() {
  return (
    <>
      <CommonModalOpenButton>サムネイル画像を選択</CommonModalOpenButton>
      <CommonModal>
        <ImageListProvider>
          <ImagePicker />
        </ImageListProvider>
        <CommonModalCloseButton>閉じる</CommonModalCloseButton>
      </CommonModal>
    </>
  );
}

export default ThumbnailPickModalWithOpenButton;
