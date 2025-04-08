import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
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
  const {
    $setHeadingInSelection,
    $setParagraphInSelection,
    $setCodeInSelection,
  } = useUpdateBlockType();
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
      <ImageInsertModalWithOpenButton />
      <br />
      <p>選択中の要素：{selectedNodeType}</p>
      <p>選択中のテキスト：{isBoldSelected ? '太字' : '太字ではない'}</p>
      <br />
    </div>
  );
}

export default ToolBarPlugin;
