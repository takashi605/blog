import { $isCodeNode } from '@lexical/code';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect, useState } from 'react';
import { MdExpandMore } from 'react-icons/md';
import { TbBold, TbCode, TbH2, TbH3, TbSourceCode } from 'react-icons/tb';
import CommonModalOpenButton from '../../../../../../components/modal/CommonModalOpenButton';
import CommonModalProvider from '../../../../../../components/modal/CommonModalProvider';
import { CODE_LANGUAGE_COMMAND } from '../customNodes/codeBlock/codeLanguageSelectionCommand';
import ImageInsertModal from './ImageInsertModal';
import { ToolBarButton } from './parts/Button';
import {
  useCodeLanguage,
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
  const {
    isBoldSelected,
    isInlineCodeSelected,
    $toggleBoldToSelection,
    $toggleInlineCodeInSelection,
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
        if ($isCodeNode(targetNode)) {
          setCodeLanguage(targetNode.getLanguage() || '');
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

  return (
    <div>
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
              editor.dispatchCommand(CODE_LANGUAGE_COMMAND, event.target.value)
            }
          >
            <option value="">select...</option>
            {codeLanguagesOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <MdExpandMore />
        </>
      )}
      <br />
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
      <br />
      <CommonModalProvider>
        <CommonModalOpenButton
          isModalOpenable={isSelectedParagraphNode}
          openFailMessage="画像を挿入できるノードを選択してください"
        >
          画像を挿入
        </CommonModalOpenButton>
        <ImageInsertModal />
      </CommonModalProvider>
      <br />
      <p>選択中の要素：{selectedNodeType}</p>
      <p>選択中のテキスト：{isBoldSelected ? '太字' : '太字ではない'}</p>
      <br />
    </div>
  );
}

export default ToolBarPlugin;
