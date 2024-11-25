import { ContentType, type ContentBase } from './content';

export class H2 implements ContentBase {
  private id: string;
  private text: string;
  private type: ContentType.H2 = ContentType.H2;

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
  getType() {
    return this.type;
  }
}
export class H3 implements ContentBase {
  private id: string;
  private text: string;
  private type: ContentType.H3 = ContentType.H3;

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
  getType() {
    return this.type;
  }
}
