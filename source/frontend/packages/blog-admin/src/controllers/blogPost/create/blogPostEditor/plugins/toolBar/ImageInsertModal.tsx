import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useState } from 'react';
import CommonModal from '../../../../../../components/modal/CommonModal';
import CommonModalCloseButton from '../../../../../../components/modal/CommonModalCloseButton';
import CommonModalOpenButton from '../../../../../../components/modal/CommonModalOpenButton';
import CommonModalProvider from '../../../../../../components/modal/CommonModalProvider';
import ImageListProvider from '../../../../../images/list/ImageListProvider';
import ImagePicker from '../../../../../images/pick/ImagePicker';
import { INSERT_IMAGE_COMMAND } from '../../customNodes/ImageNode/register/InsertImageCommand';

function ImageInsertModalWithOpenButton() {
  const [editor] = useLexicalComposerContext();
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const onChangePickerHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const imageId = e.target.value;
      setSelectedImageId(imageId);
    },
    [],
  );

  const onClickInsertImageButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    editor.update(() => {
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
        altText: '画像の説明',
        src: 'test-book',
      });
    });
  };

  return (
    <>
      <CommonModalProvider>
        <CommonModalOpenButton>画像を挿入</CommonModalOpenButton>
        <CommonModal>
          <ImageListProvider>
            <ImagePicker onChange={onChangePickerHandler} />
          </ImageListProvider>
          <button type="button" onClick={onClickInsertImageButton}>
            挿入
          </button>
          <CommonModalCloseButton>閉じる</CommonModalCloseButton>
        </CommonModal>
      </CommonModalProvider>
    </>
  );
}

export default ImageInsertModalWithOpenButton;
