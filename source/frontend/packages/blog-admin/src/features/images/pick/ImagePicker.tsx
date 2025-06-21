'use client';
import { CldImage } from 'next-cloudinary';
import type { ImageDTO } from 'service/src/imageService/dto/imageDTO';
import { useImageList } from '../list/useImageList';
import styles from './imagePicker.module.scss';

type ImagePickerProps = {
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    imageDTO: ImageDTO,
  ) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
  ref?: React.Ref<HTMLInputElement>;
};

function ImagePicker({ onChange, onBlur, name, ref }: ImagePickerProps) {
  const { getAllImages } = useImageList();

  return (
    <>
      <h2>画像を選択</h2>
      <ul className={styles.imageList}>
        {getAllImages().map((image) => (
          <li key={image.id}>
            <input
              id={image.id}
              type="radio"
              value={image.id}
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
