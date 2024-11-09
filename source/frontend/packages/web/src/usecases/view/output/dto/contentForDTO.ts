import type { Content } from 'entities/src/blogPost/postContents/content';
import { H2, H3 } from 'entities/src/blogPost/postContents/heading';
import type { ImageContent } from 'entities/src/blogPost/postContents/image';
import { Paragraph } from 'entities/src/blogPost/postContents/paragraph';

export type ContentForDTO = H2ForDTO | H3ForDTO | ParagraphForDTO | ImageForDTO;

type H2ForDTO = Readonly<{
  id: ReturnType<H2['getId']>;
  text: ReturnType<H2['getValue']>;
  type: ReturnType<H2['getType']>;
}>;
type H3ForDTO = Readonly<{
  id: ReturnType<H3['getId']>;
  text: ReturnType<H3['getValue']>;
  type: ReturnType<H3['getType']>;
}>;

type ParagraphForDTO = Readonly<{
  id: ReturnType<Paragraph['getId']>;
  text: ReturnType<Paragraph['getValue']>;
  type: ReturnType<Paragraph['getType']>;
}>;

type ImageForDTO = Readonly<{
  id: ReturnType<ImageContent['getId']>;
  type: ReturnType<ImageContent['getType']>;
  path: ReturnType<ImageContent['getPath']>;
}>;

abstract class ContentToDTOStrategy<
  T extends Content,
  U extends ContentForDTO,
> {
  protected content: T;

  constructor(content: T) {
    this.content = content;
  }
  abstract toDTO(): U;
}

export class ParagraphToDTOStrategy extends ContentToDTOStrategy<
  Paragraph,
  ParagraphForDTO
> {
  toDTO(): ParagraphForDTO {
    return {
      id: this.content.getId(),
      text: this.content.getValue(),
      type: this.content.getType(),
    };
  }
}

// TODO H2,H3 を分割する
export class H2ToDTOStrategy extends ContentToDTOStrategy<H2, H2ForDTO> {
  toDTO(): H2ForDTO {
    return {
      id: this.content.getId(),
      text: this.content.getValue(),
      type: this.content.getType(),
    };
  }
}
export class H3ToDTOStrategy extends ContentToDTOStrategy<H3, H3ForDTO> {
  toDTO(): H3ForDTO {
    return {
      id: this.content.getId(),
      text: this.content.getValue(),
      type: this.content.getType(),
    };
  }
}

export class ContentToDTOContext<T extends Content, U extends ContentForDTO> {
  private strategy: ContentToDTOStrategy<T, U>;

  constructor(strategy: ContentToDTOStrategy<T, U>) {
    this.strategy = strategy;
  }

  toDTO(): U {
    return this.strategy.toDTO();
  }
}

type TypeToStrategyMapping = {
  [key in ReturnType<Content['getType']>]: Extract<
    Content,
    { getType: () => key }
  >;
};

// コンテキスト生成関数のオーバーロード
// これにより呼び出し元で返り値の型を自動で推論できる
// 例: createContentToDTOContext(new Paragraph(1, 'text')).toDTO()
// 　　の返り値の型は ParagraphForDTO になる
export function createContentToDTOContext(
  content: Paragraph,
): ContentToDTOContext<Paragraph, ParagraphForDTO>;
export function createContentToDTOContext(
  content: H2,
): ContentToDTOContext<H2, H2ForDTO>;
export function createContentToDTOContext(
  content: H3,
): ContentToDTOContext<H3, H3ForDTO>;

// コンテキスト生成関数の実装
export function createContentToDTOContext(
  content: Content,
): ContentToDTOContext<Content, ContentForDTO> {
  if (content instanceof Paragraph) {
    return new ContentToDTOContext(new ParagraphToDTOStrategy(content));
  } else if (content instanceof H2) {
    return new ContentToDTOContext(new H2ToDTOStrategy(content));
  } else if (content instanceof H3) {
    return new ContentToDTOContext(new H3ToDTOStrategy(content));
  } else {
    throw new Error('存在しないコンテンツタイプを DTO に変換しようとしました');
  }
}
