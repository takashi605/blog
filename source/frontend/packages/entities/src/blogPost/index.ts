import { BlogPostDate } from './blogPostDate';
import type { Content } from './postContents/content';

export class BlogPost {
  private title: string;
  private contents: Content[] = [];
  private postDate: BlogPostDate | null = null;
  private lastUpdateDate: BlogPostDate | null = null;

  constructor(title: string) {
    this.title = title;
  }

  getTitleText() {
    return this.title;
  }

  addContent(content: Content) {
    this.contents.push(content);
    return this;
  }

  getContents() {
    return this.contents;
  }

  setPostDate(date: string) {
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
