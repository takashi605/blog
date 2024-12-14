import { ContentType, type ContentBase } from './content';
import type { RichText } from './richText';

export class Paragraph implements ContentBase {
  private id: string;
  private text: RichText;

  constructor(id: string, text: RichText) {
    this.id = id;
    this.text = text;
  }

  getId() {
    return this.id;
  }
  // TODO getText に rename
  getValue() {
    return this.text;
  }
  getType(): ContentType.Paragraph {
    return ContentType.Paragraph;
  }
}
