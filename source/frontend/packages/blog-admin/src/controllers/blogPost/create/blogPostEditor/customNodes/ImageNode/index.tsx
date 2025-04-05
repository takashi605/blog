// 参考記事：https://zenn.dev/mktu/articles/7d547829f330c9
import { BlockWithAlignableContents } from '@lexical/react/LexicalBlockWithAlignableContents';
import type {
  EditorConfig,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';

import { $applyNodeReplacement, DecoratorNode } from 'lexical';
import { CldImage } from 'next-cloudinary';

// ImageNode の生成時に渡す引数の型
export interface ImagePayload {
  altText: string;
  height?: number;
  key?: NodeKey;
  src: string;
  width?: number;
}

// ImageNode を JSON としてシリアライズする際の型
export type SerializedImageNode = Spread<
  {
    altText: string;
    height?: number;
    src: string;
    width?: number;
    type: 'image';
    version: 1;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __width: undefined | number;
  __height: undefined | number;

  constructor(
    src: string,
    altText: string,
    width?: number,
    height?: number,
    key?: NodeKey,
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__width = width || 100;
    this.__height = height || 100;
  }

  // decorate メソッドで返されるノードについて、なんの要素でラップするか
  // Lexical が React.createPortal に依存した実装をしているので、省略は不可
  // React.createPortal の記事(createDOM で生成させるのは第2引数に渡す DOM ノード): https://zenn.dev/nakaakist/scraps/7a949f32b01aab
  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span');
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  // エディタ内に描画する React コンポーネントを返却する
  decorate(): JSX.Element {
    return (
      // BlockWithAlignableContents という nodeKey を紐づけられる公式コンポーネントがあるので、それでラップする
      // nodeKey は内部で自動的に生成されるが、(参考：https://github.com/facebook/lexical/blob/main/packages/lexical/src/LexicalNode.ts#L322)
      // コンポーネントには勝手に紐づかない(と思う)
      // 一応、本来 BlockWithAlignableContents は「test-align できるブロック要素」として使うらしい
      <BlockWithAlignableContents
        format=""
        nodeKey={this.__key}
        className={{
          base: 'relative',
          focus: 'relative outline outline-indigo-300',
        }}
      >
        <CldImage
          src={this.__src}
          height={this.__height}
          width={this.__width}
          alt={this.__altText}
        />
      </BlockWithAlignableContents>
    );
  }

  static getType(): string {
    return 'image';
  }
}

export function $createImageNode({
  altText,
  height,
  src,
  width,
  key,
}: ImagePayload): ImageNode {
  return $applyNodeReplacement(new ImageNode(src, altText, width, height, key));
}
