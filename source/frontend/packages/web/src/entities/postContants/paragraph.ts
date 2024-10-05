export type Paragraph = {
  getText: () => string;
};

export const createParagraph = (initialText: string): Paragraph => {
  const text = initialText;

  return {
    getText: () => text,
  };
};
