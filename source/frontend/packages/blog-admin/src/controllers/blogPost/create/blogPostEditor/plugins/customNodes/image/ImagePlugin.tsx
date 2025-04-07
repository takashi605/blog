import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $wrapNodeInElement, mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
} from 'lexical';
import { useEffect } from 'react';
import { $createImageNode, ImageNode } from './ImageNode';
import type { InsertImagePayload } from './InsertImageCommand';
import { INSERT_IMAGE_COMMAND } from './InsertImageCommand';

export const ImageRegister = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error(
        'ImageRegister でエラー: LexicalNode「ImageNode」が見つかりませんでした。',
      );
    }

    return mergeRegister(
      // ImageNode の Insert コマンドを登録
      editor.registerCommand<InsertImagePayload>(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          // ImageNode を生成
          const imageNode = $createImageNode(payload);

          // カーソル位置に ImageNode を挿入
          $insertNodes([imageNode]);

          // DecoratorNode(ImageNode) は ElementNode の子でなければならないので、それを強制する
          // 具体的には、RootNode の子である場合は、ElementNode である ParagraphNode でラップする
          // また、selectEnd() でカーソルを末尾に
          if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
          }
          return true;
        },

        // 複数のコマンドが同時に実行された場合の実行優先度の設定
        // 0(最低値) にしているので、他のコマンドが優先される
        COMMAND_PRIORITY_EDITOR,
      ),
    );
  }, [editor]);

  return null;
};
