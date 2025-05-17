import { $getNearestNodeOfType } from '@lexical/utils';
import type { LexicalEditor } from 'lexical';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  createCommand,
} from 'lexical';
import { $isCustomCodeNode, CustomCodeNode } from './CustomCodeNode';

export const CODE_LANGUAGE_COMMAND = createCommand<string>();

export function registerCodeLanguageSelecting(
  editor: LexicalEditor,
): () => void {
  return editor.registerCommand(
    CODE_LANGUAGE_COMMAND,
    (language, editor) => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return false;

      // 選択中のノード、もしくは親ノードを targetNode として取得
      const anchorNode = selection.anchor.getNode();

      // anchorNode が CodeNode の場合、直接的に言語を設定
      if ($isCustomCodeNode(anchorNode)) {
        editor.update(() => {
          anchorNode.setLanguage(language);
        });
        return true;
      }

      // 祖先の CustomCodeNode を探し、言語を設定
      const customNode = $getNearestNodeOfType(
        anchorNode,
        CustomCodeNode,
      ) as CustomCodeNode | null;
      if (customNode) {
        editor.update(() => {
          customNode.setLanguage(language);
        });
        return true;
      }

      return false;
    },
    COMMAND_PRIORITY_CRITICAL,
  );
}
