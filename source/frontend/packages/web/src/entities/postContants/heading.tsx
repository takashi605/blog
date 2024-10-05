export type Heading = {
  getText: () => string;
  getLevel: () => number;
};

export const createH1 = (initialText: string): Heading => {
  return createHeading(initialText, 1);
}

export const createH2 = (initialText: string): Heading => {
  return createHeading(initialText, 2);
}

const createHeading = (initialText: string, level: number): Heading => {
  const text = initialText;

  return {
    getText: () => text,
    getLevel: () => level,
  };
}
