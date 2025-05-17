import {
  CodeNode,
  SerializedCodeNode,
} from '@lexical/code';
import {
  $applyNodeReplacement,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  NodeKey,
  Spread,
  LexicalNode,
} from 'lexical';

type SerializedTitledCodeNode = Spread<
  {
    title: string;
    type: 'titled-code';
    version: 1;
  },
  SerializedCodeNode
>;

export class TitledCodeNode extends CodeNode {
  __title: string;

  // CodeNode の要件を満たすために必須
  static getType(): string {
    return 'titled-code';
  }

  // CodeNode の要件を満たすために必須
  static clone(node: TitledCodeNode): TitledCodeNode {
    return new TitledCodeNode(
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
    if (prevNode instanceof TitledCodeNode && prevNode.__title !== this.__title) {
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
  static importJSON(serializedNode: SerializedTitledCodeNode): TitledCodeNode {
    const node = $createTitledCodeNode(
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
  exportJSON(): SerializedTitledCodeNode {
    return {
      ...super.exportJSON(),
      title: this.__title,
      type: 'titled-code',
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

export function $createTitledCodeNode(
  language: string = '',
  title: string = '',
): TitledCodeNode {
  return $applyNodeReplacement(new TitledCodeNode(language, title)) as TitledCodeNode;
}

export function $isTitledCodeNode(
  node: LexicalNode | null | undefined,
): node is TitledCodeNode {
  return node instanceof TitledCodeNode;
}
