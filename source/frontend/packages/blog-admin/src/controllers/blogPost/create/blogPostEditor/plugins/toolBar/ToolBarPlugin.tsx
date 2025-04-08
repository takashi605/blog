import { $createCodeNode } from '@lexical/code';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $setBlocksType } from '@lexical/selection';
import { $getSelection, $isRangeSelection } from 'lexical';
import { useCallback, useEffect, useState } from 'react';
import { TbBold, TbCode, TbH2, TbH3 } from 'react-icons/tb';
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
  const { $setHeadingToSelection, $setParagraphInSelection } =
    useUpdateBlockType();
  const { $getElementTypeOfSelected } = useSelectedNode();
  const { isBoldSelected, $storeSelectedTextStyle, $toggleBoldToSelection } =
    useSelectedTextStyle();

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      editor.read(() => {
        const selectedNodeType = $getElementTypeOfSelected();
        setSelectedNodeType(selectedNodeType);

        // 選択中のテキストスタイルを確認して isBoldSelected 等のステートに保持
        $storeSelectedTextStyle();
      });
    });
  }, [editor, $getElementTypeOfSelected, $storeSelectedTextStyle]);

  const onClickH2Button = () => {
    editor.update(() => {
      if (selectedNodeType === 'h2') {
        $setParagraphInSelection();
        return;
      }
      $setHeadingToSelection('h2');
    });
  };

  const onClickH3Button = () => {
    editor.update(() => {
      if (selectedNodeType === 'h3') {
        $setParagraphInSelection();
        return;
      }
      $setHeadingToSelection('h3');
    });
  };

  const onClickBoldButton = () => {
    editor.update(() => {
      $toggleBoldToSelection();
    });
  };

  const onClickCodeButton = useCallback(() => {
    if (!(selectedNodeType === 'code' || selectedNodeType === 'paragraph')) {
      return;
    }
    editor.update(() => {
      if (selectedNodeType === 'code') {
        $setParagraphInSelection();
        return;
      }
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createCodeNode());
      }
    });
  }, [$setParagraphInSelection, editor, selectedNodeType]);

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
        ariaLabel='code'
      >
        <TbCode />
      </ToolBarButton>
      <ImageInsertModalWithOpenButton />
      <br />
      <p>選択中の要素：{selectedNodeType}</p>
      <p>選択中のテキスト：{isBoldSelected ? '太字' : '太字ではない'}</p>
      <br />
    </div>
  );
}

export default ToolBarPlugin;
