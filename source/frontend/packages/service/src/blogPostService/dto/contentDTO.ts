import type { Code } from 'entities/src/blogPost/postContents/code';
import type { H2, H3 } from 'entities/src/blogPost/postContents/heading';
import type { ImageContent } from 'entities/src/blogPost/postContents/image';
import type { Paragraph } from 'entities/src/blogPost/postContents/paragraph';

export type ContentDTO = H2DTO | H3DTO | ParagraphDTO | ImageContentDTO | CodeDTO;

export type H2DTO = Readonly<{
  id: ReturnType<H2['getId']>;
  text: ReturnType<H2['getValue']>;
  type: ReturnType<H2['getType']>;
}>;
export type H3DTO = Readonly<{
  id: ReturnType<H3['getId']>;
  text: ReturnType<H3['getValue']>;
  type: ReturnType<H3['getType']>;
}>;

export type ParagraphDTO = Readonly<{
  id: ReturnType<Paragraph['getId']>;
  text: RichTextDTO;
  type: ReturnType<Paragraph['getType']>;
}>;

export type ImageContentDTO = Readonly<{
  id: ReturnType<ImageContent['getId']>;
  type: ReturnType<ImageContent['getType']>;
  path: ReturnType<ImageContent['getPath']>;
}>;

export type RichTextDTO = ReadonlyArray<{
  text: string;
  styles?: {
    bold: boolean;
  };
}>;

export type CodeDTO = Readonly<{
  id: ReturnType<Code['getId']>;
  type: ReturnType<Code['getType']>;
  title: ReturnType<Code['getTitle']>;
  code: ReturnType<Code['getCode']>;
  language: ReturnType<Code['getLanguage']>;
}>;
