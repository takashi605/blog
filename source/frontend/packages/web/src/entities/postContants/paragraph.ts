export type Paragraph = {
  getId: () => number;
  getContent: () => string;
  getContentType: () => string;
};

export const createParagraph = (id: number, initialText: string): Paragraph => {
  const text = initialText;

  return {
    getId: () => id,
    getContent: () => text,
    getContentType: () => 'paragraph',
  };
};
