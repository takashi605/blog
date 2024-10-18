import { BlogPostDate } from './blogPostDate';
import type { Content } from './postContents/content';
import type { Heading } from './postContents/heading';
import { createH1 } from './postContents/heading';

export class BlogPost {
  private title: Heading;
  private contents: Content[] = [];
  private postDate: BlogPostDate | null = null;
  private lastUpdateDate: BlogPostDate | null = null;

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

  setPostDate(date: string) {
    if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      throw new Error('日付は YYYY-MM-DD 形式で指定してください');
    }
    this.postDate = new BlogPostDate(date);
    return this;
  }

  getPostDate() {
    if (!this.postDate) {
      throw new Error('投稿日が設定されていません');
    }
    return this.postDate.getDate();
  }

  setLastUpdateDate(date: string) {
    if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      throw new Error('日付は YYYY-MM-DD 形式で指定してください');
    }
    this.lastUpdateDate = new BlogPostDate(date);
    return this;
  }

  getLastUpdateDate() {
    if (!this.lastUpdateDate) {
      throw new Error('最終更新日が設定されていません');
    }
    return this.lastUpdateDate.getDate();
  }
}
