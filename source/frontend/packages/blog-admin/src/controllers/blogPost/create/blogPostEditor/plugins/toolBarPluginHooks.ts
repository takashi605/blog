import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $getSelection, $isRangeSelection } from 'lexical';
import { useState } from 'react';

export function useUpdateBlockType() {
  const $setHeadingToSelection = (headingType: 'h2' | 'h3') => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return;
    }
    $setBlocksType(selection, () => $createHeadingNode(headingType));
  };
  return {
    $setHeadingToSelection,
  } as const;
}

export function useSelectedNode() {
  const $getElementTypeOfSelected = () => {
    const selectedElementNode = $getElementOfSelected();
    if (!selectedElementNode) {
      return null;
    }
    if ($isHeadingNode(selectedElementNode)) {
      // h2,h3,h4 等の文字列を返す
      const headingTag = selectedElementNode.getTag();
      return headingTag;
    }
    return selectedElementNode.getType();
  };
  return { $getElementTypeOfSelected } as const;

  function $getElementOfSelected() {
    const selectedNode = $getSelectedNode();
    if (!selectedNode) {
      return null;
    }
    return selectedNode.getTopLevelElementOrThrow();
  }

  function $getSelectedNode() {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return null;
    }
    const focusNode = selection.focus.getNode();
    return focusNode;
  }
}

export function useSelectedText() {
  const [isBoldSelected, setIsBoldSelected] = useState(false);

  const $checkStylesForSelection = () => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBoldSelected(selection.hasFormat('bold'));
    }
  };

  return { isBoldSelected, $checkStylesForSelection } as const;
}
