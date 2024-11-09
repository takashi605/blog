import type { Content } from 'entities/src/blogPost/postContents/content';
import { H2, H3 } from 'entities/src/blogPost/postContents/heading';
import type { ImageContent } from 'entities/src/blogPost/postContents/image';
import { Paragraph } from 'entities/src/blogPost/postContents/paragraph';

export type ContentForDTO = H2ForDTO | ParagraphForDTO | ImageForDTO;

type H2ForDTO = Readonly<{
  id: ReturnType<H2['getId']>;
  text: ReturnType<H2['getValue']>;
  type: ReturnType<H2['getType']>;
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

// TODO H2,H3 を分割する
export class HeadingToDTOStrategy extends ContentToDTOStrategy<H2 | H3> {
  toDTO(): H2ForDTO {
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
  [key in ReturnType<Content['getType']>]: Extract<
    Content,
    { getType: () => key }
  >;
};

export function createContentToDTOContext(
  content: Content,
): ContentToDTOContext {
  if (content instanceof Paragraph) {
    return new ContentToDTOContext(new ParagraphToDTOStrategy(content));
  } else if (content instanceof H2) {
    return new ContentToDTOContext(new HeadingToDTOStrategy(content));
  } else if (content instanceof H3) {
    return new ContentToDTOContext(new HeadingToDTOStrategy(content));
  } else {
    throw new Error('存在しないコンテンツタイプを DTO に変換しようとしました');
  }
}
