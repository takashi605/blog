import { $isCodeNode, CodeNode } from '@lexical/code';
import { $getNearestNodeOfType } from '@lexical/utils';
import type { LexicalEditor } from 'lexical';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  createCommand,
} from 'lexical';

export const CODE_LANGUAGE_COMMAND = createCommand<string>();

export function registerCodeLanguageSelecting(editor: LexicalEditor): () => void {
  return editor.registerCommand(
    CODE_LANGUAGE_COMMAND,
    (language, editor) => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return false;

      // 選択中のノード、もしくは親ノードを targetNode として取得
      // CodeNode が見つからなければ、早期リターン
      const anchorNode = selection.anchor.getNode();
      const targetNode = $isCodeNode(anchorNode)
        ? anchorNode
        : $getNearestNodeOfType(anchorNode, CodeNode);
      if (!targetNode) return false;

      // CodeNode の language を更新
      editor.update(() => {
        targetNode.setLanguage(language);
      });

      return true;
    },
    COMMAND_PRIORITY_CRITICAL,
  );
}
