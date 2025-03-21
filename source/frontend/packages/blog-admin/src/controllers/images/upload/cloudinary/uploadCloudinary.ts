import type { ImageUploadFormValues } from '../form/ImageUploadFormProvider';

export async function uploadCloudinary(
  data: ImageUploadFormValues,
): Promise<boolean> {
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!CLOUD_NAME) {
    console.error('CLOUD_NAME が設定されていません');
    return false;
  }
  const file = data.image?.[0];
  if (!file) {
    return false;
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
  if (!response.ok) {
    console.error(result);
    return false;
  }
  return true;
}
