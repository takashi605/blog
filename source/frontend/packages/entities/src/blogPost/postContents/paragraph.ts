import { ContentType, type ContentBase } from './content';

export class Paragraph implements ContentBase {
  private id: string;
  private text: string;

  constructor(id: string, text: string) {
    this.id = id;
    this.text = text;
  }

  getId() {
    return this.id;
  }
  getValue() {
    return this.text;
  }
  getType(): ContentType.Paragraph {
    return ContentType.Paragraph;
  }
}
