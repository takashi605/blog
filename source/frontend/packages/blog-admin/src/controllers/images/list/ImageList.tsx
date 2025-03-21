'use client';
import { useCommonModal } from '../../../components/modal/CommonModalProvider';
import ImageUploadModal from '../upload/ImageUploadModal';

function ImageList() {
  const { openModal } = useCommonModal();

  return (
    <>
      <h2>画像の管理</h2>
      <button onClick={openModal}>画像を追加</button>
      <ImageUploadModal />
    </>
  );
}

export default ImageList;
