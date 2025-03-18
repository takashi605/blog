import React from 'react';
import Modal from 'react-modal';

type CommonModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
};

function CommonModal({ isOpen, closeModal, children }: CommonModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      className="modal"
      overlayClassName="overlay"
    >
      {children}
    </Modal>
  );
}

export default React.memo(CommonModal);
