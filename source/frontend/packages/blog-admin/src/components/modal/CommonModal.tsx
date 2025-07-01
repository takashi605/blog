import React from 'react';
import Modal from 'react-modal';
import { useCommonModalContext } from './CommonModalProvider';

type CommonModalProps = {
  children: React.ReactNode;
  maxWidth?: string;
  width?: string;
};

function CommonModal({ children, maxWidth, width }: CommonModalProps) {
  const { isOpen, closeModal } = useCommonModalContext();
  
  // React Modalでは style 直書きが公式推奨の方法
  // CSS Modulesでは動的なmaxWidth/widthの制御が困難なため、style属性を使用
  const modalStyle = getModalStyle(maxWidth, width);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={modalStyle}
    >
      {children}
    </Modal>
  );
}

export default React.memo(CommonModal);

/**
 * React Modalのスタイル定義を生成する関数
 * propsが指定されている場合のみカスタムスタイルを適用し、
 * 既存のモーダルには影響しないようにする
 */
function getModalStyle(maxWidth?: string, width?: string) {
  const hasCustomSize = maxWidth || width;
  
  return hasCustomSize ? {
    overlay: { 
      zIndex: 1000,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      position: 'relative' as const,
      top: 'auto',
      left: 'auto',
      right: 'auto',
      bottom: 'auto',
      border: 'none',
      borderRadius: '12px',
      padding: '0',
      background: 'white',
      maxWidth: maxWidth || 'auto',
      width: width || 'auto',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    }
  } : {
    overlay: { zIndex: 1000 }
  };
}
