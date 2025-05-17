import { $getNearestNodeOfType } from '@lexical/utils';
import type { LexicalEditor } from 'lexical';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  createCommand,
} from 'lexical';
import { CustomCodeNode, $isCustomCodeNode } from './CustomCodeNode';

export const CODE_TITLE_COMMAND = createCommand<string>();

export function registerCodeTitleSelecting(
  editor: LexicalEditor,
): () => void {
  return editor.registerCommand(
    CODE_TITLE_COMMAND,
    (title, editor) => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return false;

      // 選択中のノード、もしくは親ノードを targetNode として取得
      // CustomCodeNode が見つからなければ、早期リターン
      const anchorNode = selection.anchor.getNode();
      const targetNode = $isCustomCodeNode(anchorNode)
        ? anchorNode
        : $getNearestNodeOfType(anchorNode, CustomCodeNode) as CustomCodeNode | null;
      if (!targetNode) return false;

      // CustomCodeNode の title を更新
      editor.update(() => {
        targetNode.setTitle(title);
      });

      return true;
    },
    COMMAND_PRIORITY_CRITICAL,
  );
}
