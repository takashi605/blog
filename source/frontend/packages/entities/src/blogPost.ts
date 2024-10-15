import type { Content } from './postContents/content';
import { createH1 } from './postContents/heading';

export type BlogPost = {
  getTitleText: () => string;
  getTitleLevel: () => number;
  getContents: () => Content[];
  addContent: (content: Content) => BlogPost;
  getPostDate: () => Date | null;
  setPostDate: (date: string) => BlogPost;
};

export const createBlogPost = (initialTitle: string): BlogPost => {
  // setter 等が必要になった時のために変数に保持しておく
  const title = createH1(1, initialTitle);
  let postDate: Date | null = null;
  const contents: Content[] = [];

  return {
    getTitleText: () => title.getValue(),
    getTitleLevel: () => title.getLevel(),
    getContents: () => contents,
    addContent(content: Content) {
      contents.push(content);
      return this;
    },
    getPostDate: () => postDate,
    setPostDate(date: string) {
      postDate = new Date(date);
      return this;
    },
  };
};
