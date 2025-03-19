import React from 'react';
import TextInput from '../../../components/form/parts/TextInput';
import CommonModal from '../../../components/modal/CommonModal';
import { useCommonModal } from '../../../components/modal/CommonModalProvider';

function ImageUploadModal() {
  const { closeModal } = useCommonModal();

  return (
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
  );
}

export default React.memo(ImageUploadModal);
