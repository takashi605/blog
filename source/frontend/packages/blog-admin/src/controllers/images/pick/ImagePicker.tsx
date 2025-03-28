'use client';
import { CldImage } from 'next-cloudinary';
import { useImageList } from '../list/useImageList';

function ImagePicker() {
  const { getAllImages } = useImageList();

  return (
    <>
      <h3>画像を選択</h3>
      <ul>
        {getAllImages().map((image) => (
          <li key={image.id}>
            <input id={image.id} type="radio" value="image_a.jpg" name="image" />
            <label htmlFor={image.id}>
              <CldImage
                src={image.path}
                width={500}
                height={500}
                alt="画像コンテンツ"
              />
              <p>{image.path}</p>
            </label>
          </li>
        ))}
      </ul>
    </>
  );
}

export default ImagePicker;
