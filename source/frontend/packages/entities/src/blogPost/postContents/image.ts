import type { ContentBase } from '../postContents/content';
import { ContentType } from '../postContents/content';

export class ImageContent implements ContentBase {
  private id: number;
  private path: string;

  constructor(id: number, path: string) {
    this.id = id;
    this.path = path;
  }

  getType() {
    return ContentType.Image;
  }
  getId() {
    return this.id;
  }

  getPath() {
    return this.path;
  }
}
