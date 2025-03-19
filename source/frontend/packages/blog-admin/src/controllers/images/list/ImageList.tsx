'use client';
import TextInput from '../../../components/form/parts/TextInput';
import CommonModal from '../../../components/modal/CommonModal';
import { useCommonModal } from '../../../components/modal/CommonModalProvider';

function ImageList() {
  const { closeModal, openModal } = useCommonModal();

  return (
    <>
      <h2>画像の管理</h2>
      <button onClick={openModal}>画像を追加</button>
      <CommonModal>
        <div>
          <label htmlFor="image">ファイルを選択</label>
          <input id="image" type="file" />
        </div>
        <TextInput id="name" label="画像名" />
        <TextInput id="path" label="パス" />
        <button onClick={closeModal} className="modal-close" type="button">
          閉じる
        </button>
      </CommonModal>
    </>
  );
}

export default ImageList;
