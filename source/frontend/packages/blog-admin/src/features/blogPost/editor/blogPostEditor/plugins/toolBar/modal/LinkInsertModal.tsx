import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useState } from 'react';
import TextInput from '../../../../../../../components/form/parts/TextInput';
import CommonModal from '../../../../../../../components/modal/CommonModal';
import CommonModalCloseButton from '../../../../../../../components/modal/CommonModalCloseButton';
import { useCommonModalContext } from '../../../../../../../components/modal/CommonModalProvider';
import CommonModalSubmitButton from '../../../../../../../components/modal/CommonModalSubmitButton';
import { validateUrl } from '../../../helper/url';
import styles from './LinkInsertModal.module.scss';

function LinkInsertModal() {
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [editor] = useLexicalComposerContext();
  const { closeModal } = useCommonModalContext();

  const onClickHandler = () => {
    if (validateUrl(url)) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
      closeModal();
    } else {
      setUrlError('有効なURL（http(s)://から始まるもの）を入力してください。');
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (urlError) {
      setUrlError('');
    }
  };

  return (
    <>
      <CommonModal>
        <div className={styles.content}>
          <h2 className={styles.title}>リンクを挿入</h2>
          <div className={styles.formContainer}>
            <TextInput
              id="url"
              label="URL(http(s):// から始まるもの)を入力してください。"
              value={url}
              onChange={handleUrlChange}
              error={urlError}
              placeholder="https://example.com"
            />
          </div>
          <div className={styles.buttonContainer}>
            <CommonModalSubmitButton onClick={onClickHandler}>
              リンクを挿入
            </CommonModalSubmitButton>
            <CommonModalCloseButton>キャンセル</CommonModalCloseButton>
          </div>
        </div>
      </CommonModal>
    </>
  );
}
export default LinkInsertModal;
