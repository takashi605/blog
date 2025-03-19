import React from 'react';
import CommonModal from '../../../components/modal/CommonModal';
import { useCommonModal } from '../../../components/modal/CommonModalProvider';
import ImageUploadForm from './form/ImageUploadForm';
import type { ImageUploadFormValues } from './form/ImageUploadFormProvider';
import ImageUploadFormProvider from './form/ImageUploadFormProvider';

function ImageUploadModal() {
  const { closeModal } = useCommonModal();
  const onSubmit = (data: ImageUploadFormValues) => {
    console.log(data);
  };

  return (
    <CommonModal>
      <ImageUploadFormProvider>
        <ImageUploadForm onSubmit={onSubmit} />
      </ImageUploadFormProvider>
      <button onClick={closeModal} className="modal-close" type="button">
        閉じる
      </button>
    </CommonModal>
  );
}

export default React.memo(ImageUploadModal);
