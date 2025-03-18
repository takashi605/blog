'use client';
import { useCallback, useState } from 'react';
import CommonModal from '../../../components/modal/CommonModal';

function ImageList() {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);
  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);
  return (
    <>
      <h2>画像の管理</h2>
      <button onClick={openModal}>画像を追加</button>
      <CommonModal isOpen={isOpen} closeModal={closeModal}>
        <button onClick={closeModal} className="modal-close" type="button">
          閉じる
        </button>
      </CommonModal>
    </>
  );
}

export default ImageList;
