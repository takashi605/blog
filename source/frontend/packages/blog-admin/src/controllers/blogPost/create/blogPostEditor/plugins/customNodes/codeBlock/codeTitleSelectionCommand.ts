import { $getNearestNodeOfType } from '@lexical/utils';
import type { LexicalEditor } from 'lexical';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  createCommand,
} from 'lexical';
import { TitledCodeNode, $isTitledCodeNode } from './TitledCodeNode';

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
      // TitledCodeNode が見つからなければ、早期リターン
      const anchorNode = selection.anchor.getNode();
      const targetNode = $isTitledCodeNode(anchorNode)
        ? anchorNode
        : $getNearestNodeOfType(anchorNode, TitledCodeNode) as TitledCodeNode | null;
      if (!targetNode) return false;

      // TitledCodeNode の title を更新
      editor.update(() => {
        targetNode.setTitle(title);
      });

      return true;
    },
    COMMAND_PRIORITY_CRITICAL,
  );
}
