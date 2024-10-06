export type Paragraph = {
  getId: () => number;
  getText: () => string;
};

export const createParagraph = (id:number, initialText: string): Paragraph => {
  const text = initialText;

  return {
    getId: () => id,
    getText: () => text,
  };
};
