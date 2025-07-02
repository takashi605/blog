import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useState } from 'react';
import type { Image } from 'shared-lib/src/api';
import CommonModal from '../../../../../../../components/modal/CommonModal';
import CommonModalCloseButton from '../../../../../../../components/modal/CommonModalCloseButton';
import { useCommonModalContext } from '../../../../../../../components/modal/CommonModalProvider';
import CommonModalSubmitButton from '../../../../../../../components/modal/CommonModalSubmitButton';
import ImageListProvider from '../../../../../../images/list/ImageListProvider';
import ImagePicker from '../../../../../../images/pick/ImagePicker';
import { INSERT_IMAGE_COMMAND } from '../../customNodes/image/InsertImageCommand';
import styles from './imageInsertModal.module.scss';

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
          <ImagePicker
            onChange={onChangePickerHandler}
            name="imageContent"
            selectedImageId={selectedImage?.id}
          />
        </ImageListProvider>
        <div className={styles.buttonContainer}>
          <CommonModalCloseButton>閉じる</CommonModalCloseButton>
          <CommonModalSubmitButton
            type="button"
            onClick={onClickInsertImageButton}
            disabled={!selectedImage}
          >
            挿入
          </CommonModalSubmitButton>
        </div>
      </CommonModal>
    </>
  );
}

export default ImageInsertModal;
