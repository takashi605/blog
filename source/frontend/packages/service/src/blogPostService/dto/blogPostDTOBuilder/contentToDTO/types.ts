import type { H2, H3 } from 'entities/src/blogPost/postContents/heading';
import type { ImageContent } from 'entities/src/blogPost/postContents/image';
import type { Paragraph } from 'entities/src/blogPost/postContents/paragraph';

export type ContentForDTO = H2ForDTO | H3ForDTO | ParagraphForDTO | ImageForDTO;

export type H2ForDTO = Readonly<{
  id: ReturnType<H2['getId']>;
  text: ReturnType<H2['getValue']>;
  type: ReturnType<H2['getType']>;
}>;
export type H3ForDTO = Readonly<{
  id: ReturnType<H3['getId']>;
  text: ReturnType<H3['getValue']>;
  type: ReturnType<H3['getType']>;
}>;

export type ParagraphForDTO = Readonly<{
  id: ReturnType<Paragraph['getId']>;
  text: ReturnType<Paragraph['getValue']>;
  type: ReturnType<Paragraph['getType']>;
}>;

export type ImageForDTO = Readonly<{
  id: ReturnType<ImageContent['getId']>;
  type: ReturnType<ImageContent['getType']>;
  path: ReturnType<ImageContent['getPath']>;
}>;
