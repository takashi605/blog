import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $getSelection, $isRangeSelection } from 'lexical';

export function useUpdateBlockType() {
  const $setH2ToSelection = () => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return;
    }
    $setBlocksType(selection, () => $createHeadingNode('h2'));
  };
  return {
    $setH2ToSelection,
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
