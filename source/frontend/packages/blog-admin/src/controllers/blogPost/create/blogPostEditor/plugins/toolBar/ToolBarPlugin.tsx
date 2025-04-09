import { $isCodeNode, CODE_LANGUAGE_FRIENDLY_NAME_MAP } from '@lexical/code';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection } from 'lexical';
import { useCallback, useEffect, useState } from 'react';
import { MdExpandMore } from 'react-icons/md';
import { TbBold, TbCode, TbH2, TbH3 } from 'react-icons/tb';
import { CODE_LANGUAGE_COMMAND } from '../customNodes/codeBlock/codeLanguageSelectionCommand';
import ImageInsertModalWithOpenButton from './ImageInsertModal';
import { ToolBarButton } from './parts/Button';
import {
  useSelectedNode,
  useSelectedTextStyle,
  useUpdateBlockType,
} from './toolBarPluginHooks';
import type { SupportedNodeType } from './types/supportedNodeType';

function ToolBarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [selectedNodeType, setSelectedNodeType] =
    useState<SupportedNodeType | null>(null);
  const {
    $setHeadingInSelection,
    $setParagraphInSelection,
    $setCodeInSelection,
  } = useUpdateBlockType();
  const { $getElementTypeOfSelected } = useSelectedNode();
  const { isBoldSelected, $storeSelectedTextStyle, $toggleBoldToSelection } =
    useSelectedTextStyle();
  const [codeLanguage, setCodeLanguage] = useState('');
  const CodeLanguagesOptions = Object.entries(
    CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  ).map(([value, label]) => ({ value, label }));

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      editor.read(() => {
        const selectedNodeType = $getElementTypeOfSelected();
        setSelectedNodeType(selectedNodeType);

        // 選択中のテキストスタイルを確認して isBoldSelected 等のステートに保持
        $storeSelectedTextStyle();

        // 選択中のコードノードの言語を取得して、codeLanguage に保持
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;
        const anchorNode = selection.anchor.getNode();
        const targetNode =
          anchorNode.getKey() === 'root'
            ? anchorNode
            : anchorNode.getTopLevelElementOrThrow();
        if ($isCodeNode(targetNode)) {
          setCodeLanguage(targetNode.getLanguage() || '');
        }
      });
    });
  }, [editor, $getElementTypeOfSelected, $storeSelectedTextStyle]);

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
    // TODO すでに太字の paragraph を見出しにした場合等に太字が解除されない問題があるので、修正する
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
        onClick={onClickBoldButton}
        checked={isBoldSelected}
        ariaLabel="bold"
      >
        <TbBold />
      </ToolBarButton>
      <ToolBarButton
        onClick={onClickCodeButton}
        checked={selectedNodeType === 'code'}
        ariaLabel="code"
      >
        <TbCode />
      </ToolBarButton>
      {selectedNodeType === 'code' && (
        <div>
          <select
            aria-label="code languages"
            value={codeLanguage}
            onChange={(event) =>
              editor.dispatchCommand(CODE_LANGUAGE_COMMAND, event.target.value)
            }
          >
            <option value="">select...</option>
            {CodeLanguagesOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <MdExpandMore />
        </div>
      )}
      <ImageInsertModalWithOpenButton />
      <br />
      <p>選択中の要素：{selectedNodeType}</p>
      <p>選択中のテキスト：{isBoldSelected ? '太字' : '太字ではない'}</p>
      <br />
    </div>
  );
}

export default ToolBarPlugin;
