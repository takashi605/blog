import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useState } from 'react';
import CommonModal from '../../../../../../../components/modal/CommonModal';
import CommonModalCloseButton from '../../../../../../../components/modal/CommonModalCloseButton';
import { useCommonModalContext } from '../../../../../../../components/modal/CommonModalProvider';
import { validateUrl } from '../../../helper/url';

function LinkInsertModal() {
  const [url, setUrl] = useState('');
  const [editor] = useLexicalComposerContext();
  const { closeModal } = useCommonModalContext();

  const onClickHandler = () => {
    if (validateUrl(url)) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
    } else {
      console.error('invalid url');
    }
    closeModal();
  };

  return (
    <>
      <CommonModal>
        <div>
          <label htmlFor="url">
            URL(https:// から始まるもの)を入力してください。
          </label>
          <input
            id="url"
            onChange={(e) => {
              setUrl(e.target.value);
            }}
          />
          <div>
            <button onClick={onClickHandler}>挿入</button>
          </div>
        </div>
        <CommonModalCloseButton>閉じる</CommonModalCloseButton>
      </CommonModal>
    </>
  );
}
export default LinkInsertModal;
