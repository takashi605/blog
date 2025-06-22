'use client';
import { CldImage } from 'next-cloudinary';
import { useImageList } from './useImageList';

function ImageList() {
  const { getAllImages } = useImageList();

  return (
    <>
      <h2>画像一覧</h2>
      <ul>
        {getAllImages().map((image) => (
          <li key={image.id}>
            <CldImage
              src={image.path}
              width={500}
              height={500}
              alt="画像コンテンツ"
            />
            <p>{image.path}</p>
          </li>
        ))}
      </ul>
    </>
  );
}

export default ImageList;
