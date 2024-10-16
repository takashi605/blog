import type { Content } from './postContents/content';
import { createH1 } from './postContents/heading';

export type BlogPost = {
  getTitleText: () => string;
  getTitleLevel: () => number;
  getContents: () => Content[];
  addContent: (content: Content) => BlogPost;
  getPostDate: () => Date;
  setPostDate: (date: string) => BlogPost;
  getLastUpdateDate: () => Date;
  setLastUpdateDate: (date: string) => BlogPost;
};

export const createBlogPost = (initialTitle: string): BlogPost => {
  // setter 等が必要になった時のために変数に保持しておく
  const title = createH1(1, initialTitle);
  let postDate: Date | null = null;
  let lastUpdateDate: Date | null = null;
  const contents: Content[] = [];

  return {
    getTitleText: () => title.getValue(),
    getTitleLevel: () => title.getLevel(),
    getContents: () => contents,
    addContent(content: Content) {
      contents.push(content);
      return this;
    },
    getPostDate: () => {
      if (!postDate) {
        throw new Error('投稿日が設定されていません');
      }
      return postDate;
    },
    setPostDate(date: string) {
      postDate = new Date(date);
      return this;
    },
    getLastUpdateDate: () => {
      if (!lastUpdateDate) {
        throw new Error('最終更新日が設定されていません');
      }
      return lastUpdateDate;
    },
    setLastUpdateDate(date: string) {
      lastUpdateDate = new Date(date);
      return this;
    },
  };
};
