import type { Content } from "@/entities/postContants/content";

export type Heading = Content & {
  getLevel: () => number;
};

export const createH1 = (id: number, initialText: string): Heading => {
  return createHeading(id, initialText, 1);
};

export const createH2 = (id: number, initialText: string): Heading => {
  return createHeading(id, initialText, 2);
};

export const createH3 = (id: number, initialText: string): Heading => {
  return createHeading(id, initialText, 3);
};

const createHeading = (
  id: number,
  initialText: string,
  level: number,
): Heading => {
  const text = initialText;

  return {
    getId: () => id,
    getContent: () => text,
    getLevel: () => level,
    getContentType: () => `h${level}`,
  };
};
