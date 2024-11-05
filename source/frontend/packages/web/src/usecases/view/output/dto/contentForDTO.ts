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

type ContentToDTOStrategy = {
  toDTO: (content: Content) => ContentForDTO;
};

export class ParagraphToDTOStrategy implements ContentToDTOStrategy {
  toDTO(content: Content): ParagraphForDTO {
    return {
      id: content.getId(),
      text: content.getValue(),
      type: content.getType(),
    };
  }
}

export class HeadingToDTOStrategy implements ContentToDTOStrategy {
  toDTO(content: Content): HeadingForDTO {
    return {
      id: content.getId(),
      text: content.getValue(),
      type: content.getType(),
    };
  }
}

export class ContentToDTOContext {
  private strategy: ContentToDTOStrategy;

  constructor(strategy: ContentToDTOStrategy) {
    this.strategy = strategy;
  }

  toDTO(content: Content): ContentForDTO {
    return this.strategy.toDTO(content);
  }
}
