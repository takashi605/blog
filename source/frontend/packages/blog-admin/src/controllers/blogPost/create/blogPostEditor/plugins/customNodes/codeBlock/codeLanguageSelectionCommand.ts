import { $isCodeNode, CodeNode } from '@lexical/code';
import { $getNearestNodeOfType } from '@lexical/utils';
import type { LexicalEditor } from 'lexical';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  createCommand,
} from 'lexical';
import { TitledCodeNode, $isTitledCodeNode } from './TitledCodeNode';

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
      
      // TitledCodeNodeを優先的に検索
      if ($isTitledCodeNode(anchorNode)) {
        editor.update(() => {
          anchorNode.setLanguage(language);
        });
        return true;
      }
      
      // ElementNodesを取得して型キャストを行う
      const titledNode = $getNearestNodeOfType(anchorNode, TitledCodeNode) as TitledCodeNode | null;
      if (titledNode) {
        editor.update(() => {
          titledNode.setLanguage(language);
        });
        return true;
      }
      
      // 通常のCodeNodeを検索
      if ($isCodeNode(anchorNode)) {
        editor.update(() => {
          anchorNode.setLanguage(language);
        });
        return true;
      }
      
      const codeNode = $getNearestNodeOfType(anchorNode, CodeNode);
      if (codeNode) {
        editor.update(() => {
          codeNode.setLanguage(language);
        });
        return true;
      }

      return false;
    },
    COMMAND_PRIORITY_CRITICAL,
  );
}
