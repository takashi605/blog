import type { Content } from 'entities/src/blogPost/postContents/content';
import { Heading } from 'entities/src/blogPost/postContents/heading';
import { Paragraph } from 'entities/src/blogPost/postContents/paragraph';

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

abstract class ContentToDTOStrategy<T extends Content> {
  protected content: T;

  constructor(content: T) {
    this.content = content;
  }
  abstract toDTO(): ContentForDTO;
}

export class ParagraphToDTOStrategy extends ContentToDTOStrategy<Paragraph> {
  toDTO(): ParagraphForDTO {
    return {
      id: this.content.getId(),
      text: this.content.getValue(),
      type: this.content.getType(),
    };
  }
}

export class HeadingToDTOStrategy extends ContentToDTOStrategy<Heading> {
  toDTO(): HeadingForDTO {
    return {
      id: this.content.getId(),
      text: this.content.getValue(),
      type: this.content.getType(),
    };
  }
}

export class ContentToDTOContext {
  private strategy: ContentToDTOStrategy<Content>;

  constructor(content: Content) {
    if (content instanceof Heading) {
      this.strategy = new HeadingToDTOStrategy(content);
    } else if (content instanceof Paragraph) {
      this.strategy = new ParagraphToDTOStrategy(content);
    } else {
      throw new Error('Unknown content type.');
    }
  }

  toDTO(): ContentForDTO {
    return this.strategy.toDTO();
  }
}
