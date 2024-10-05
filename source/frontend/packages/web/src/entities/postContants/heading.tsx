export type Heading = {
  getText: () => string;
  getLevel: () => number;
};

export const createH1 = (initialText: string): Heading => {
  const text = initialText;
  const level = 1;

  return {
    getText: () => text,
    getLevel: () => level,
  };
}

export const createH2 = (initialText: string): Heading => {
  const text = initialText;
  const level = 2;

  return {
    getText: () => text,
    getLevel: () => level,
  };
}
