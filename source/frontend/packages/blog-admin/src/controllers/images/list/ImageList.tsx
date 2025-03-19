'use client';
import CommonModal from '../../../components/modal/CommonModal';
import { useCommonModal } from '../../../components/modal/CommonModalProvider';

function ImageList() {
  const { closeModal, openModal } = useCommonModal();

  return (
    <>
      <h2>画像の管理</h2>
      <button onClick={openModal}>画像を追加</button>
      <CommonModal>
        <label htmlFor="image">ファイルを選択</label>
        <input id="image" type="file" />
        <button onClick={closeModal} className="modal-close" type="button">
          閉じる
        </button>
      </CommonModal>
    </>
  );
}

export default ImageList;
