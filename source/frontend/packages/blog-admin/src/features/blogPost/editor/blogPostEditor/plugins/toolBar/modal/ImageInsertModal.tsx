import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useState } from 'react';
import type { Image } from 'shared-lib/src/api';
import CommonModal from '../../../../../../../components/modal/CommonModal';
import CommonModalCloseButton from '../../../../../../../components/modal/CommonModalCloseButton';
import { useCommonModalContext } from '../../../../../../../components/modal/CommonModalProvider';
import ImageListProvider from '../../../../../../images/list/ImageListProvider';
import ImagePicker from '../../../../../../images/pick/ImagePicker';
import { INSERT_IMAGE_COMMAND } from '../../customNodes/image/InsertImageCommand';

function ImageInsertModal() {
  const [editor] = useLexicalComposerContext();
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const { closeModal } = useCommonModalContext();

  const onChangePickerHandler = useCallback(
    (_e: React.ChangeEvent<HTMLInputElement>, image: Image) => {
      setSelectedImage(image);
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
    closeModal();
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
