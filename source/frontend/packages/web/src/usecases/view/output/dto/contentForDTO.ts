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

  constructor(content: Content) {
    switch (content.getType()) {
      case 'h2':
        this.strategy = new HeadingToDTOStrategy(content);
        break;
      case 'h3':
        this.strategy = new HeadingToDTOStrategy(content);
        break;
      case 'paragraph':
        this.strategy = new ParagraphToDTOStrategy(content);
        break;

      // TODO カスタムエラーでエラーハンドリングする
      default:
        throw new Error('不明なコンテンツタイプです');
    }
  }

  toDTO(): ContentForDTO {
    return this.strategy.toDTO();
  }
}
