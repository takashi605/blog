'use client';
import { useCallback, useState } from 'react';
import Modal from 'react-modal';

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
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="overlay"
      >
        <button onClick={closeModal} className="modal-close" type="button">
          閉じる
        </button>
      </Modal>
    </>
  );
}

export default ImageList;
