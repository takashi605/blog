import type { Content } from 'entities/src/blogPost/postContents/content';
import type { Heading } from 'entities/src/blogPost/postContents/heading';
import type { Paragraph } from 'entities/src/blogPost/postContents/paragraph';

export type ContentForDTO = HeadingForDTO | ParagraphForDTO;

type HeadingForDTO = Readonly<{
  id: ReturnType<Heading['getId']>;
  text: ReturnType<Heading['getValue']>;
  type: ReturnType<Heading['getType']>;
}>;

type ParagraphForDTO = Readonly<{
  id: ReturnType<Paragraph['getId']>;
  text: ReturnType<Paragraph['getValue']>;
  type: ReturnType<Paragraph['getType']>;
}>;

export function createContentToDTOContext(
  content: Content,
): ContentToDTOContext {
  switch (content.getType()) {
    case 'h2':
      return new ContentToDTOContext(new HeadingToDTOStrategy(content));
    case 'h3':
      return new ContentToDTOContext(new HeadingToDTOStrategy(content));
    case 'paragraph':
      return new ContentToDTOContext(new ParagraphToDTOStrategy(content));

    // TODO カスタムエラーでエラーハンドリングする
    default:
      throw new Error('不明なコンテンツタイプです');
  }
}

abstract class ContentToDTOStrategy {
  protected content: Content;

  constructor(content: Content) {
    this.content = content;
  }
  abstract toDTO(): ContentForDTO;
}

export class ParagraphToDTOStrategy extends ContentToDTOStrategy {
  toDTO(): ParagraphForDTO {
    return {
      id: this.content.getId(),
      text: this.content.getValue(),
      type: this.content.getType(),
    };
  }
}

export class HeadingToDTOStrategy extends ContentToDTOStrategy {
  toDTO(): HeadingForDTO {
    return {
      id: this.content.getId(),
      text: this.content.getValue(),
      type: this.content.getType(),
    };
  }
}

export class ContentToDTOContext {
  private strategy: ContentToDTOStrategy;

  constructor(strategy: ContentToDTOStrategy) {
    this.strategy = strategy;
  }

  toDTO(): ContentForDTO {
    return this.strategy.toDTO();
  }
}
