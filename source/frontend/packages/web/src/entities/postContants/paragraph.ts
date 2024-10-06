import type { Content } from "@/entities/postContants/content";

export type Paragraph = Content;

export const createParagraph = (id: number, initialText: string): Paragraph => {
  const text = initialText;

  return {
    getId: () => id,
    getContent: () => text,
    getContentType: () => 'paragraph',
  };
};
