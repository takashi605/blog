'use client';
import { CldImage } from 'next-cloudinary';
import type { ImageDTO } from 'service/src/imageService/dto/imageDTO';

type ImageListClientProps = {
  imageList: ImageDTO[];
};

function ImageListClient({ imageList }: ImageListClientProps) {
  return (
    <>
      <h3>画像一覧</h3>
      <ul>
        {imageList.map((image) => (
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

export default ImageListClient;
