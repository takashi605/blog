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
  const { $setHeadingToSelection } = useUpdateBlockType();
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
      $setHeadingToSelection('h2');
    });
  };

  const onClickH3Button = () => {
    editor.update(() => {
      $setHeadingToSelection('h3');
    });
  };

  const onClickBoldButton = () => {
    editor.update(() => {
      $toggleBoldToSelection();
    });
  };

  const onClickCodeButton = useCallback(() => {
    if (selectedNodeType !== 'code') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createCodeNode());
        }
      });
    }
  }, [editor, selectedNodeType]);

  return (
    <div>
      <ToolBarButton
        onClick={onClickH2Button}
        disabled={selectedNodeType === 'h2'}
      >
        <TbH2 />
      </ToolBarButton>
      <ToolBarButton
        onClick={onClickH3Button}
        disabled={selectedNodeType === 'h3'}
      >
        <TbH3 />
      </ToolBarButton>
      <ToolBarButton onClick={onClickBoldButton} disabled={isBoldSelected}>
        <TbBold />
      </ToolBarButton>
      <ToolBarButton
        onClick={onClickCodeButton}
        disabled={selectedNodeType === 'code'}
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
