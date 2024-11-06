import { ContentType } from '../postContents/content';

export class ImageContent {
  private id: number;
  private path: string;

  constructor(id: number, path: string) {
    this.id = id;
    this.path = path;
  }

  getPath() {
    return this.path;
  }
  getType() {
    return ContentType.Image;
  }
  getId() {
    return this.id;
  }
}
