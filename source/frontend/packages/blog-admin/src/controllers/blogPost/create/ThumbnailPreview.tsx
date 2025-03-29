import { CldImage } from 'next-cloudinary';
import { useFormContext } from 'react-hook-form';

function ThumbnailPreview() {
  const form = useFormContext();
  const path = form.watch('thumbnail.path');
  return (
    <>
      {path && (
        <CldImage src={path} width={500} height={500} alt="画像コンテンツ" />
      )}
    </>
  );
}

export default ThumbnailPreview;
