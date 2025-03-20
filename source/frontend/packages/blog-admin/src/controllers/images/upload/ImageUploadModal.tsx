import React from 'react';
import CommonModal from '../../../components/modal/CommonModal';
import { useCommonModal } from '../../../components/modal/CommonModalProvider';
import ImageUploadForm from './form/ImageUploadForm';
import type { ImageUploadFormValues } from './form/ImageUploadFormProvider';
import ImageUploadFormProvider from './form/ImageUploadFormProvider';

function ImageUploadModal() {
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const { closeModal } = useCommonModal();
  const onSubmit = async (data: ImageUploadFormValues) => {
    console.log('data', data);
    const file = data.image?.[0];
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'blog_images_preset');
    formData.append('public_id', data.imagePath);

    const response = await fetch(
      // APIリファレンス： https://cloudinary.com/documentation/upload_images#basic_uploading
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    );
    const result = await response.json();
    console.log(result);
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
