import type { ImageContent } from '../postContents/image';
import type { Code } from './code';
import type { H2, H3 } from './heading';
import type { Paragraph } from './paragraph';

export const enum ContentType {
  H2 = 'h2',
  H3 = 'h3',
  Paragraph = 'paragraph',
  Image = 'image',
  Code = 'code',
}

export type ContentBase = {
  getId: () => string;
  getType: () => ContentType;
};

export type Content = H2 | H3 | Paragraph | ImageContent | Code;
