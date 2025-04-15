import {
  $createCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
} from '@lexical/code';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import type { LexicalNode } from 'lexical';
import {
  $createParagraphNode,
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
} from 'lexical';
import { useState } from 'react';
import type { SupportedNodeType } from './types/supportedNodeType';
import { isSupportedNode } from './types/supportedNodeType';

export function useUpdateBlockType() {
  const $setHeadingInSelection = (headingType: 'h2' | 'h3') => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return;
    }
    $setBlocksType(selection, () => $createHeadingNode(headingType));
  };
  const $setParagraphInSelection = () => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return;
    }
    $setBlocksType(selection, () => $createParagraphNode());
  };
  const $setCodeInSelection = () => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      $setBlocksType(selection, () => $createCodeNode());
    }
  };
  return {
    $setHeadingInSelection,
    $setParagraphInSelection,
    $setCodeInSelection,
  } as const;
}

export function useSelectedNode() {
  const $getElementTypeOfSelected = (): SupportedNodeType => {
    const selectedElementNode = $getSelectionTopLevelElement();
    if (!selectedElementNode) {
      return null;
    }
    const selectedElementType = $getSelectedNodeType(selectedElementNode);

    return selectedElementType;
  };
  function $getSelectionTopLevelElement() {
    const selectedNode = $getSelectedNode();
    if (!selectedNode) {
      return null;
    }
    const targetNode = $findTopLevelElementByNode(selectedNode);

    return targetNode;
  }
  function $isParagraphNodeInSelection(): boolean {
    const selectedNode = $getSelectedNode();
    if ($isParagraphNode(selectedNode)) {
      return true;
    }
    return false;
  }

  return {
    $getElementTypeOfSelected,
    $getSelectionTopLevelElement,
    $isParagraphNodeInSelection,
  } as const;

  /* 以下ヘルパー関数 */
  function $getSelectedNode() {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return null;
    }
    const focusNode = selection.focus.getNode();
    return focusNode;
  }

  function $findTopLevelElementByNode(node: LexicalNode): LexicalNode | null {
    if (node.getKey() === 'root') {
      return node;
    }
    return node.getTopLevelElementOrThrow();
  }

  function $getSelectedNodeType(
    selectedElementNode: LexicalNode,
  ): SupportedNodeType {
    if ($isHeadingNode(selectedElementNode)) {
      // h2,h3,h4 等の文字列を返す
      // getType だと heading という文字しか返さないので、別途分岐している
      const headingTag = selectedElementNode.getTag();

      return headingTag;
    }
    const selectedElementType = selectedElementNode.getType();
    if (!isSupportedNode(selectedElementType)) {
      throw new Error(
        `useSelectedNode でエラー: 選択中のノードのタイプがサポートされていません。type: ${selectedElementType}`,
      );
    }

    return selectedElementType;
  }
  /* ここまでヘルパー関数 */
}

export function useSelectedTextStyle() {
  const [isBoldSelected, setIsBoldSelected] = useState(false);
  const [isInlineCodeSelected, setIsInlineCodeSelected] = useState(false);
  const [editor] = useLexicalComposerContext();

  const $storeSelectedTextStyle = () => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBoldSelected(selection.hasFormat('bold'));
      setIsInlineCodeSelected(selection.hasFormat('code'));
    }
  };

  const $toggleBoldToSelection = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  };

  const $toggleInlineCodeInSelection = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
  };

  return {
    isBoldSelected,
    isInlineCodeSelected,
    $toggleBoldToSelection,
    $toggleInlineCodeInSelection,
    $storeSelectedTextStyle,
  } as const;
}

export function useCodeLanguage() {
  const [codeLanguage, setCodeLanguage] = useState('');
  const codeLanguagesOptions = Object.entries(
    CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  ).map(([value, label]) => ({ value, label }));

  return {
    codeLanguage,
    setCodeLanguage,
    codeLanguagesOptions,
  };
}
