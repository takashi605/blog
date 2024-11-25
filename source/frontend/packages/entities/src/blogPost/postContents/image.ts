import type { ContentBase } from '../postContents/content';
import { ContentType } from '../postContents/content';

export class ImageContent implements ContentBase {
  private id: string;
  private path: string;

  constructor(id: string, path: string) {
    this.id = id;
    this.path = path;
  }

  getId() {
    return this.id;
  }
  getPath() {
    return this.path;
  }
  getType(): ContentType.Image {
    return ContentType.Image;
  }
}
