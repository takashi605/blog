import type { Content } from '@/entities/postContants/content';
import { createH1, createH2, createH3 } from './postContants/heading';
import { createParagraph } from './postContants/paragraph';

export type BlogPost = {
  getTitleText: () => string;
  getTitleLevel: () => number;
  getContents: () => Content[];
  addH2: (text: string) => BlogPost;
  addH3: (text: string) => BlogPost;
  addParagraph: (text: string) => BlogPost;
};

export const createBlogPost = (
  initialTitle: string,
): BlogPost => {
  // setter 等が必要になった時のために変数に保持しておく
  const title = createH1(1, initialTitle);
  const contents: Content[] = [];

  return {
    getTitleText: () => title.getContent(),
    getTitleLevel: () => title.getLevel(),
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
    addParagraph(text: string) {
      const id = contents.length + 1;
      contents.push(createParagraph(id, text));
      return this;
    },
  };
};
