import type { Heading } from './postContants/heading';
import type { Paragraph } from './postContants/paragraph';
import { createH1, createH2, createH3 } from './postContants/heading';
import { createParagraph } from './postContants/paragraph';

export type BlogPost = {
  getTitleText: () => string;
  getTitleLevel: () => number;
  getH2List: () => Heading[];
  getH3List: () => Heading[];
  getParagraphList: () => Paragraph[];
};

export const createBlogPost = (
  initialTitle: string,
  initialH2List: string[] = [],
  initialH3List: string[] = [],
  initialParagraphList: string[] = [],
): BlogPost => {
  // setter 等が必要になった時のために変数に保持しておく
  const title = createH1(initialTitle);
  const h2List = initialH2List.map((h2) => createH2(h2));
  const h3List = initialH3List.map((h3) => createH3(h3));
  const paragraphList = initialParagraphList.map((paragraph) => createParagraph(paragraph));

  return {
    getTitleText: () => title.getText(),
    getTitleLevel: () => title.getLevel(),
    getH2List: () => h2List,
    getH3List: () => h3List,
    getParagraphList: () => paragraphList,
  };
};
