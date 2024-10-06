import type { Content } from '@/entities/postContants/content';
import type { Heading } from './postContants/heading';
import { createH1, createH2, createH3 } from './postContants/heading';
import type { Paragraph } from './postContants/paragraph';
import { createParagraph } from './postContants/paragraph';

export type BlogPost = {
  getTitleText: () => string;
  getTitleLevel: () => number;
  getH2List: () => Heading[];
  getH3List: () => Heading[];
  getParagraphList: () => Paragraph[];
  getContents: () => Content[];
  addH2: (text: string) => BlogPost;
  addH3: (text: string) => BlogPost;
};

export const createBlogPost = (
  initialTitle: string,
  initialH2List: string[] = [],
  initialH3List: string[] = [],
  initialParagraphList: string[] = [],
): BlogPost => {
  // setter 等が必要になった時のために変数に保持しておく
  const title = createH1(1, initialTitle);
  const h2List = initialH2List.map((h2) => createH2(1, h2));
  const h3List = initialH3List.map((h3) => createH3(1, h3));
  const paragraphList = initialParagraphList.map((paragraph) =>
    createParagraph(1, paragraph),
  );
  const contents: Content[] = [];

  return {
    getTitleText: () => title.getContent(),
    getTitleLevel: () => title.getLevel(),
    getH2List: () => h2List,
    getH3List: () => h3List,
    getParagraphList: () => paragraphList,
    getContents: () => contents,
    addH2(text: string) {
      const id = contents.length + 1;
      contents.push(createH2(id, text));
      return this;
    },
    addH3(text: string) {
      const id = contents.length + 1;
      contents.push(createH3(id, text));
      return this;
    },
  };
};
