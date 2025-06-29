import { CODE_LANGUAGE_FRIENDLY_NAME_MAP } from '@lexical/code';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import type { LexicalNode, RangeSelection } from 'lexical';
import {
  $createParagraphNode,
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
} from 'lexical';
import { useCallback, useState } from 'react';
import { $createCustomCodeNode } from '../customNodes/codeBlock/CustomCodeNode';
import { CODE_TITLE_COMMAND } from '../customNodes/codeBlock/codeTitleSelectionCommand';
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
    if (!$isRangeSelection(selection)) {
      return;
    }

    // 以下の処理は、複数行の選択範囲を単一のコードブロックに変換するために多少複雑になっています。
    // 1. 選択範囲内のテキストを全て取得
    // 2. 選択範囲内のノードを最初のものだけ残して削除
    // 3. 最初のノードに 1 で取得したテキストを持つコードブロックに置き換え

    // 選択範囲内のテキストを全て取得（改行も含む）
    const selectedText = $getSelectedText(selection);

    // 選択範囲内のノードを取得
    const selectedNodes = $getSelectedNodes(selection);
    const topLevelNodes = $getUniqueTopLevelElements(selectedNodes);

    // 最初のノード以外を削除して、最初のノードを取得
    const firstNode = $removeExtraNodesAndReturnFirst(topLevelNodes);

    // 単一のコードブロックを作成し、選択されたテキストを設定
    const codeNode = $createCustomCodeNode();
    codeNode.append($createTextNode(selectedText));

    // 最初のノードをコードブロックに置き換え
    firstNode.replace(codeNode);
  };
  return {
    $setHeadingInSelection,
    $setParagraphInSelection,
    $setCodeInSelection,
  } as const;

  // 複数ノードから最初のノード以外を削除し、最初のノードを返す
  function $removeExtraNodesAndReturnFirst(nodes: LexicalNode[]): LexicalNode {
    const [firstNode, ...restNodes] = nodes;
    restNodes.forEach((node) => node.remove());
    return firstNode;
  }

  // 全てのトップレベルノードを取得
  // 同じエレメントノードが複数選択されている場合もあるため、Set を使用して重複を排除
  function $getUniqueTopLevelElements(nodes: LexicalNode[]): LexicalNode[] {
    const topLevelElements = new Set<LexicalNode>();
    nodes.forEach((node) => {
      const topLevelElement = node.getTopLevelElementOrThrow();
      topLevelElements.add(topLevelElement);
    });
    return Array.from(topLevelElements);
  }

  function $getSelectedNodes(selection: RangeSelection): LexicalNode[] {
    return Array.from(selection.getNodes());
  }

  function $getSelectedText(selection: RangeSelection): string {
    return selection.getTextContent();
  }
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
    const selectedNode = $getFocusedNode();
    if (!selectedNode) {
      return null;
    }
    const targetNode = $findTopLevelElementByNode(selectedNode);

    return targetNode;
  }

  return {
    $getElementTypeOfSelected,
    $getSelectionTopLevelElement,
  } as const;

  /* 以下ヘルパー関数 */
  function $getFocusedNode() {
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
  const [isLinkSelected, setIsLinkSelected] = useState(false);
  const [editor] = useLexicalComposerContext();

  const $storeSelectedTextStyle = () => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBoldSelected(selection.hasFormat('bold'));
      setIsInlineCodeSelected(selection.hasFormat('code'));

      // リンク状態の検知
      const selectedNodes = selection.getNodes();
      const hasLink = selectedNodes.some((node) => {
        // ノード自体がLinkNodeの場合
        if ($isLinkNode(node)) return true;
        // 親ノードがLinkNodeの場合
        const parent = node.getParent();
        return parent && $isLinkNode(parent);
      });
      setIsLinkSelected(hasLink);
    }
  };

  const $toggleBoldToSelection = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  };

  const $toggleInlineCodeInSelection = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
  };

  const $removeLinkInSelection = () => {
    // リンクが選択されている場合は削除（null を渡すとリンク削除）
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
  };

  return {
    isBoldSelected,
    isInlineCodeSelected,
    isLinkSelected,
    $toggleBoldToSelection,
    $toggleInlineCodeInSelection,
    $removeLinkInSelection,
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

// コードブロックのタイトル操作用のフック
export function useCodeTitle() {
  const [editor] = useLexicalComposerContext();
  const [codeTitle, setCodeTitle] = useState<string>('');

  const updateCodeTitle = useCallback(
    (title: string) => {
      setCodeTitle(title);

      // エディタにコマンドを送信してノードを更新する
      editor.dispatchCommand(CODE_TITLE_COMMAND, title);
    },
    [editor],
  );

  return {
    codeTitle,
    setCodeTitle: updateCodeTitle,
  } as const;
}
