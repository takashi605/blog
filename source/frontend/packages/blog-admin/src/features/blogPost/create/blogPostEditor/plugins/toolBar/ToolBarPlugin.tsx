import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CiLink } from 'react-icons/ci';
import { MdExpandMore } from 'react-icons/md';
import { TbBold, TbCode, TbH2, TbH3, TbSourceCode } from 'react-icons/tb';
import CommonModalOpenButton from '../../../../../../components/modal/CommonModalOpenButton';
import CommonModalProvider from '../../../../../../components/modal/CommonModalProvider';
import { $isCustomCodeNode } from '../customNodes/codeBlock/CustomCodeNode';
import { CODE_LANGUAGE_COMMAND } from '../customNodes/codeBlock/codeLanguageSelectionCommand';
import { CODE_TITLE_COMMAND } from '../customNodes/codeBlock/codeTitleSelectionCommand';
import ImageInsertModal from './modal/ImageInsertModal';
import LinkInsertModal from './modal/LinkInsertModal';
import { ToolBarButton } from './parts/Button';
import styles from './toolBarPlugin.module.scss';
import {
  useCodeLanguage,
  useCodeTitle,
  useSelectedNode,
  useSelectedTextStyle,
  useUpdateBlockType,
} from './toolBarPluginHooks';
import type { SupportedNodeType } from './types/supportedNodeType';

function ToolBarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [selectedNodeType, setSelectedNodeType] =
    useState<SupportedNodeType | null>(null);
  const [isSelectedParagraphNode, setIsSelectedParagraphNode] =
    useState<boolean>(false);
  const { codeTitle, setCodeTitle } = useCodeTitle();
  const {
    isBoldSelected,
    isInlineCodeSelected,
    isLinkSelected,
    $toggleBoldToSelection,
    $toggleInlineCodeInSelection,
    $removeLinkInSelection,
    $storeSelectedTextStyle,
  } = useSelectedTextStyle();
  const { codeLanguage, setCodeLanguage, codeLanguagesOptions } =
    useCodeLanguage();

  const {
    $setHeadingInSelection,
    $setParagraphInSelection,
    $setCodeInSelection,
  } = useUpdateBlockType();

  const {
    $getElementTypeOfSelected,
    $getSelectionTopLevelElement,
    $isParagraphNodeInSelection,
  } = useSelectedNode();

  // Lexical の Node を source of truth にするため、
  // エディタの状態が変化するタイミングで Node をチェックして各種ステートを更新する
  useEffect(() => {
    return editor.registerUpdateListener(() => {
      editor.read(() => {
        // 選択中のノードの種類を取得して、selectedNodeType に保持
        const selectedNodeType = $getElementTypeOfSelected();
        setSelectedNodeType(selectedNodeType);

        // 選択中のノードが paragraph かどうかを取得して、isSelectedParagraphNode に保持
        setIsSelectedParagraphNode($isParagraphNodeInSelection());

        // 選択中のテキストスタイルを取得して isBoldSelected に保持
        $storeSelectedTextStyle();

        // 選択中のコードノードの言語を取得して、codeLanguage に保持
        const targetNode = $getSelectionTopLevelElement();
        if ($isCustomCodeNode(targetNode)) {
          const currentLanguage = targetNode.getLanguage() || '';
          const currentTitle = targetNode.getTitle();

          if (currentLanguage !== codeLanguage) {
            setCodeLanguage(currentLanguage);
          }

          if (currentTitle !== codeTitle) {
            setCodeTitle(currentTitle);
          }
        }
      });
    });
  }, [
    editor,
    $getElementTypeOfSelected,
    $storeSelectedTextStyle,
    $getSelectionTopLevelElement,
    setCodeLanguage,
    $isParagraphNodeInSelection,
    codeLanguage,
    codeTitle,
    setCodeTitle,
  ]);

  const onClickH2Button = useCallback(() => {
    editor.update(() => {
      if (selectedNodeType === 'h2') {
        $setParagraphInSelection();
        return;
      }
      $setHeadingInSelection('h2');
    });
  }, [
    $setHeadingInSelection,
    $setParagraphInSelection,
    editor,
    selectedNodeType,
  ]);

  const onClickH3Button = useCallback(() => {
    editor.update(() => {
      if (selectedNodeType === 'h3') {
        $setParagraphInSelection();
        return;
      }
      $setHeadingInSelection('h3');
    });
  }, [
    $setHeadingInSelection,
    $setParagraphInSelection,
    editor,
    selectedNodeType,
  ]);

  const onClickBoldButton = useCallback(() => {
    if (selectedNodeType !== 'paragraph') {
      return;
    }
    editor.update(() => {
      $toggleBoldToSelection();
    });
  }, [$toggleBoldToSelection, editor, selectedNodeType]);

  const onClickCodeButton = useCallback(() => {
    if (!(selectedNodeType === 'code' || selectedNodeType === 'paragraph')) {
      return;
    }
    editor.update(() => {
      if (selectedNodeType === 'code') {
        $setParagraphInSelection();
        return;
      }
      $setCodeInSelection();
    });
  }, [$setCodeInSelection, $setParagraphInSelection, editor, selectedNodeType]);

  // タイトル変更ハンドラー
  const titleInputRef = useRef<HTMLInputElement>(null);
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const value = e.target.value;
      editor.dispatchCommand(CODE_TITLE_COMMAND, value);

      // dispatchCommand によりフォーカスがエディタに移ってしまうので、
      // タイトル入力欄にフォーカスを戻す
      setTimeout(() => {
        if (titleInputRef.current) {
          titleInputRef.current.focus();
        }
      }, 0);
    },
    [editor],
  );

  return (
    <div className={styles.toolBar}>
      <div className={styles.toolBarButtons}>
        <ToolBarButton
          onClick={onClickH2Button}
          checked={selectedNodeType === 'h2'}
          ariaLabel="h2"
        >
          <TbH2 />
        </ToolBarButton>
        <ToolBarButton
          onClick={onClickH3Button}
          checked={selectedNodeType === 'h3'}
          ariaLabel="h3"
        >
          <TbH3 />
        </ToolBarButton>
        <ToolBarButton
          onClick={onClickCodeButton}
          checked={selectedNodeType === 'code'}
          ariaLabel="code"
        >
          <TbSourceCode />
        </ToolBarButton>
        {selectedNodeType === 'code' && (
          <>
            <select
              aria-label="code languages"
              value={codeLanguage}
              onChange={(event) =>
                editor.dispatchCommand(
                  CODE_LANGUAGE_COMMAND,
                  event.target.value,
                )
              }
              className={styles.codeSelect}
            >
              <option value="">select...</option>
              {codeLanguagesOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <MdExpandMore />
            <div className={styles.titleInputContainer}>
              <input
                ref={titleInputRef}
                type="text"
                placeholder="コードブロックのタイトル"
                value={codeTitle}
                onChange={handleTitleChange}
                className={styles.titleInput}
                aria-label="code block title"
              />
            </div>
          </>
        )}
      </div>
      <div className={styles.toolBarButtons}>
        <ToolBarButton
          onClick={onClickBoldButton}
          checked={isBoldSelected}
          ariaLabel="bold"
        >
          <TbBold />
        </ToolBarButton>
        <ToolBarButton
          onClick={$toggleInlineCodeInSelection}
          checked={isInlineCodeSelected}
          ariaLabel="inline-code"
        >
          <TbCode />
        </ToolBarButton>
        <CommonModalProvider>
          <CommonModalOpenButton
            isModalOpenable={!isLinkSelected} // リンクが選択されていない場合のみモーダル表示可能
            openFailMessage="リンクを挿入できるノードを選択してください"
            renderButton={({ onClick, children }) => (
              <ToolBarButton
                onClick={isLinkSelected ? $removeLinkInSelection : onClick}
                checked={isLinkSelected}
                ariaLabel="link"
              >
                {children}
              </ToolBarButton>
            )}
          >
            <CiLink />
          </CommonModalOpenButton>

          <LinkInsertModal />
        </CommonModalProvider>
      </div>
      <div className={styles.toolBarButtons}>
        <CommonModalProvider>
          <CommonModalOpenButton
            isModalOpenable={isSelectedParagraphNode}
            openFailMessage="画像を挿入できるノードを選択してください"
          >
            画像を挿入
          </CommonModalOpenButton>
          <ImageInsertModal />
        </CommonModalProvider>
      </div>
    </div>
  );
}

export default ToolBarPlugin;
