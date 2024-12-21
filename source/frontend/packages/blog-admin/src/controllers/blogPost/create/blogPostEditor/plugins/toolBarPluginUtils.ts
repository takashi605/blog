import { $getSelection, $isRangeSelection } from 'lexical';

function $getSelectedNode() {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return null;
  }
  const focusNode = selection.focus.getNode();
  return focusNode;
}

export function $getElementTypeOfSelected() {
  const selectedNode = $getSelectedNode();
  if (!selectedNode) {
    return null;
  }
  return selectedNode.getTopLevelElementOrThrow().getType();
}
