import type { Content } from './content';

export type Paragraph = Content;

export const createParagraph = (id: number, initialText: string): Paragraph => {
  const text = initialText;

  return {
    getId: () => id,
    getValue: () => text,
    getType: () => 'paragraph',
  };
};
