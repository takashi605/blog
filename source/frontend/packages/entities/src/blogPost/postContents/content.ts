import type { ImageContent } from '../postContents/image';
import { EntityError } from '../../error/error';
import type { Heading } from './heading';
import { createH2, createH3 } from './heading';
import { Paragraph } from './paragraph';

export const enum ContentType {
  H2 = 'h2',
  H3 = 'h3',
  Paragraph = 'paragraph',
  Image = 'image',
}

export type ContentBase = {
  getId: () => number;
  getType: () => ContentType;
};

export type Content = Heading | Paragraph | ImageContent;

export const createContent = (params: {
  id: number;
  type: ContentType;
  value: string;
}): Content => {
  switch (params.type) {
    case 'h2':
      return createH2(params.id, params.value);
    case 'h3':
      return createH3(params.id, params.value);
    case 'paragraph':
      return new Paragraph(params.id, params.value);
    default:
      throw new EntityError('不明なコンテントタイプです');
  }
};
