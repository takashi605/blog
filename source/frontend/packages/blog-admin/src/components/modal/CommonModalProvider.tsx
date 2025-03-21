'use client';
import { createContext, useContext, useState } from 'react';

type modalState = {
  isOpen: boolean;
  closeModal: () => void;
  openModal: () => void;
};

const SetIsOpenModalContext = createContext<modalState | null>(null);

export default function CommonModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <SetIsOpenModalContext.Provider value={{ isOpen, closeModal, openModal }}>
      {children}
    </SetIsOpenModalContext.Provider>
  );
}

// コンテキストを利用するためのカスタムフック
export const useCommonModal = () => {
  const modalState = useContext(SetIsOpenModalContext);
  if (modalState === null) {
    throw new Error(
      'useCommonModal は CommonModalProvider でラップされていなければ利用できません',
    );
  }
  return modalState;
};
