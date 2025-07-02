'use client';
import { CldImage } from 'next-cloudinary';
import type { Image } from 'shared-lib/src/api';
import { useImageList } from '../list/useImageList';
import styles from './imagePicker.module.scss';

type ImagePickerProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>, image: Image) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
  ref?: React.Ref<HTMLInputElement>;
  selectedImageId?: string;
};

function ImagePicker({
  onChange,
  onBlur,
  name,
  ref,
  selectedImageId,
}: ImagePickerProps) {
  const { getAllImages } = useImageList();

  return (
    <>
      <h2
        style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}
      >
        画像を選択
      </h2>
      <ul className={styles.imageList}>
        {getAllImages().map((image) => (
          <li key={image.id}>
            <input
              id={image.id}
              type="radio"
              value={image.id}
              checked={selectedImageId === image.id}
              onChange={(e) => onChange(e, image)}
              {...(onBlur && { onBlur })}
              {...(name && { name })}
              {...(ref && { ref })}
            />
            <label htmlFor={image.id}>
              <CldImage
                src={image.path}
                width={200}
                height={200}
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
