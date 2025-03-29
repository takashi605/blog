'use client';
import { CldImage } from 'next-cloudinary';
import { useFormContext } from 'react-hook-form';
import { useImageList } from '../list/useImageList';

function ImagePicker() {
  const { getAllImages } = useImageList();
  const { register, setValue } = useFormContext();

  // 各ラジオボタンに共通の register を渡すために上部で定義
  // 個別に register を実行して渡すと、最後の要素だけが反映されてしまう
  // これは id が共通のものは上書きする react-hook-form の仕様による挙動
  const { onChange, onBlur, name, ref } = register('thumbnail.id');

  return (
    <>
      <h2>画像を選択</h2>
      <ul>
        {getAllImages().map((image) => (
          <li key={image.id}>
            <input
              id={image.id}
              type="radio"
              value={image.id}
              name={name}
              ref={ref}
              onChange={(e) => {
                onChange(e);
                setValue('thumbnail.path', image.path);
              }}
              onBlur={onBlur}
            />
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
