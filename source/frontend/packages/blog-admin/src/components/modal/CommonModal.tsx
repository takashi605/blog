import React from 'react';
import Modal from 'react-modal';
import { useCommonModalContext } from './CommonModalProvider';

type CommonModalProps = {
  children: React.ReactNode;
};

function CommonModal({ children }: CommonModalProps) {
  const { isOpen, closeModal } = useCommonModalContext();
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={{ overlay: { zIndex: 1000 } }}
    >
      {children}
    </Modal>
  );
}

export default React.memo(CommonModal);
