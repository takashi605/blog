export type Paragraph = {
  getId: () => number;
  getContent: () => string;
};

export const createParagraph = (id: number, initialText: string): Paragraph => {
  const text = initialText;

  return {
    getId: () => id,
    getContent: () => text,
  };
};
