import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useState } from 'react';
import type { ImageDTO } from 'service/src/imageService/dto/imageDTO';
import CommonModal from '../../../../../../components/modal/CommonModal';
import CommonModalCloseButton from '../../../../../../components/modal/CommonModalCloseButton';
import ImageListProvider from '../../../../../images/list/ImageListProvider';
import ImagePicker from '../../../../../images/pick/ImagePicker';
import { INSERT_IMAGE_COMMAND } from '../customNodes/image/InsertImageCommand';

function ImageInsertModal() {
  const [editor] = useLexicalComposerContext();
  const [selectedImage, setSelectedImage] = useState<ImageDTO | null>(null);

  const onChangePickerHandler = useCallback(
    (_e: React.ChangeEvent<HTMLInputElement>, imageDTO: ImageDTO) => {
      setSelectedImage(imageDTO);
    },
    [],
  );

  const onClickInsertImageButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    editor.update(() => {
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
        altText: '画像の説明',
        src: selectedImage?.path ?? '',
      });
    });
  };

  return (
    <>
      <CommonModal>
        <ImageListProvider>
          <ImagePicker onChange={onChangePickerHandler} name="imageContent" />
        </ImageListProvider>
        <button type="button" onClick={onClickInsertImageButton}>
          挿入
        </button>
        <CommonModalCloseButton>閉じる</CommonModalCloseButton>
      </CommonModal>
    </>
  );
}

export default ImageInsertModal;
