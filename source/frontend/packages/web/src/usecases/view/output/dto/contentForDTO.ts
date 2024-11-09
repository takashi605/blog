import type { Content } from 'entities/src/blogPost/postContents/content';
import { Heading } from 'entities/src/blogPost/postContents/heading';
import type { ImageContent } from 'entities/src/blogPost/postContents/image';
import { Paragraph } from 'entities/src/blogPost/postContents/paragraph';

export type ContentForDTO = HeadingForDTO | ParagraphForDTO | ImageForDTO;

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

type ImageForDTO = Readonly<{
  id: ReturnType<ImageContent['getId']>;
  type: ReturnType<ImageContent['getType']>;
  path: ReturnType<ImageContent['getPath']>;
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

  constructor(strategy: ContentToDTOStrategy<Content>) {
    this.strategy = strategy;
  }

  toDTO(): ContentForDTO {
    return this.strategy.toDTO();
  }
}

type TypeToStrategyMapping = {
  [key in ReturnType<Content["getType"]>]: Extract<Content, { getType: () => key }>;
};

export function createContentToDTOContext(
  content: Content,
): ContentToDTOContext {
  if (content instanceof Paragraph) {
    return new ContentToDTOContext(new ParagraphToDTOStrategy(content));
  } else if (content instanceof Heading) {
    return new ContentToDTOContext(new HeadingToDTOStrategy(content));
  } else {
    throw new Error('Unsupported content type');
  }
}
