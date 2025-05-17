import {
  CodeNode,
  SerializedCodeNode,
} from '@lexical/code';
import {
  $applyNodeReplacement,
  EditorConfig,
  NodeKey,
  Spread,
  LexicalNode,
} from 'lexical';

type SerializedCustomCodeNode = Spread<
  {
    title: string;
    type: 'code';
    version: 1;
  },
  SerializedCodeNode
>;

export class CustomCodeNode extends CodeNode {
  __title: string;

  // CodeNode の要件を満たすために必須
  static getType(): string {
    return 'code';
  }

  // CodeNode の要件を満たすために必須
  static clone(node: CustomCodeNode): CustomCodeNode {
    return new CustomCodeNode(
      node.getLanguage() || '',
      node.__title,
      node.getKey()
    );
  }

  // CodeNode の要件を満たすために必須
  constructor(language: string, title: string = '', key?: NodeKey) {
    super(language, key);
    this.__title = title;
  }

  // CodeNode の要件を満たすために必須
  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    
    // title属性を追加
    if (this.__title) {
      dom.setAttribute('data-title', this.__title);
    }
    
    return dom;
  }

  // CodeNode の要件を満たすために必須
  updateDOM(
    prevNode: CodeNode,
    dom: HTMLElement,
    config: EditorConfig,
  ): boolean {
    const isUpdated = super.updateDOM(prevNode, dom, config);
    
    // タイトルが変更された場合にのみDOM更新
    if (prevNode instanceof CustomCodeNode && prevNode.__title !== this.__title) {
      if (this.__title) {
        dom.setAttribute('data-title', this.__title);
      } else {
        dom.removeAttribute('data-title');
      }
      return true;
    }

    return isUpdated;
  }

  // ほぼ必須。内部で様々な使い方がされており、
  // 不具合の一例として、undo/redo が適切に動作しなかったりする。
  static importJSON(serializedNode: SerializedCustomCodeNode): CustomCodeNode {
    const node = $createCustomCodeNode(
      serializedNode.language || '',
      serializedNode.title
    );
    
    if (serializedNode.direction) {
      node.setDirection(serializedNode.direction);
    }
    
    return node;
  }

  // ほぼ必須。内部で様々な使い方がされており、
  // 不具合の一例として、undo/redo が適切に動作しなかったりする。
  exportJSON(): SerializedCustomCodeNode {
    return {
      ...super.exportJSON(),
      title: this.__title,
      type: 'code',
      version: 1,
    };
  }

  /* 
  * 以下、CodeNode の要件を満たすために必須ではないが、必要に応じて実装するメソッド
  */
  getTitle(): string {
    return this.__title;
  }

  setTitle(title: string): void {
    const writable = this.getWritable();
    writable.__title = title;
  }
}

export function $createCustomCodeNode(
  language: string = '',
  title: string = '',
): CustomCodeNode {
  return $applyNodeReplacement(new CustomCodeNode(language, title)) as CustomCodeNode;
}

export function $isCustomCodeNode(
  node: LexicalNode | null | undefined,
): node is CustomCodeNode {
  return node instanceof CustomCodeNode;
}
