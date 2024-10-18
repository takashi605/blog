import { BlogPostDate } from './blogPostDate';
import type { Content } from './postContents/content';
import type { Heading } from './postContents/heading';
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
  let postDate: BlogPostDate | null = null;
  let lastUpdateDate: BlogPostDate | null = null;
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
      return postDate.getDate();
    },
    setPostDate(date: string) {
      postDate = new BlogPostDate(date);
      return this;
    },
    getLastUpdateDate: () => {
      if (!lastUpdateDate) {
        throw new Error('最終更新日が設定されていません');
      }
      return lastUpdateDate.getDate();
    },
    setLastUpdateDate(date: string) {
      lastUpdateDate = new BlogPostDate(date);
      return this;
    },
  };
};

export class n__BlogPost {
  private title: Heading;
  private contents: Content[] = [];

  constructor(title: string) {
    this.title = createH1(1, title);
  }

  getTitleText() {
    return this.title.getValue();
  }

  getTitleLevel() {
    return this.title.getLevel();
  }

  addContent(content: Content) {
    this.contents.push(content);
    return this;
  }

  getContents() {
    return this.contents;
  }
}
