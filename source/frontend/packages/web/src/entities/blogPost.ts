import type { Content } from '@/entities/postContants/content';
import { createH1 } from './postContants/heading';

export type BlogPost = {
  getTitleText: () => string;
  getTitleLevel: () => number;
  getContents: () => Content[];
  addContent: (content: Content) => BlogPost;
};

export const createBlogPost = (initialTitle: string): BlogPost => {
  // setter 等が必要になった時のために変数に保持しておく
  const title = createH1(1, initialTitle);
  const contents: Content[] = [];

  return {
    getTitleText: () => title.getContent(),
    getTitleLevel: () => title.getLevel(),
    getContents: () => contents,
    addContent(content: Content) {
      contents.push(content);
      return this;
    },
  };
};
