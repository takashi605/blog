import { EntityError } from '../error/error';
import { BlogPostDate } from './blogPostDate';
import type { Content } from './postContents/content';
import { Thumbnail } from './thumbnail';

export class BlogPost {
  private id: string;
  private title: string;
  private contents: Content[] = [];
  private postDate: BlogPostDate | null = null;
  private lastUpdateDate: BlogPostDate | null = null;
  private thumbnail: Thumbnail | null = null;

  constructor(id: string, title: string) {
    this.title = title;
    this.id = id;
  }

  getId() {
    return this.id;
  }

  getTitleText() {
    return this.title;
  }

  setThumbnail(id: string, path: string) {
    this.thumbnail = new Thumbnail(id, path);
    return this;
  }

  getThumbnail() {
    if (!this.thumbnail) {
      throw new EntityError('サムネイル画像が設定されていません');
    }
    return this.thumbnail;
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
      throw new EntityError('投稿日が設定されていません');
    }
    return this.postDate.getDate();
  }

  setLastUpdateDate(date: string) {
    this.lastUpdateDate = new BlogPostDate(date);
    return this;
  }

  getLastUpdateDate() {
    if (!this.lastUpdateDate) {
      throw new EntityError('最終更新日が設定されていません');
    }
    return this.lastUpdateDate.getDate();
  }
}
