import { ContentType, type Content } from './content';

export class Paragraph implements Content {
  private id: number;
  private text: string;

  constructor(id: number, text: string) {
    this.id = id;
    this.text = text;
  }

  getId() {
    return this.id;
  }
  getValue() {
    return this.text;
  }
  getType() {
    return ContentType.Paragraph;
  }
}
