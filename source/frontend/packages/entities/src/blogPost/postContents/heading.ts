import { ContentType, type ContentBase } from './content';

export const createH2 = (id: number, initialText: string): H2 => {
  return new H2(id, initialText, ContentType.H2);
};

export const createH3 = (id: number, initialText: string): H3 => {
  return new H3(id, initialText, ContentType.H3);
};

export class H2 implements ContentBase {
  private id: number;
  private text: string;
  private type: ContentType.H2 | ContentType.H3;

  constructor(id: number, text: string, type: ContentType.H2 | ContentType.H3) {
    this.id = id;
    this.text = text;
    this.type = type;
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
  private id: number;
  private text: string;
  private type: ContentType.H2 | ContentType.H3;

  constructor(id: number, text: string, type: ContentType.H2 | ContentType.H3) {
    this.id = id;
    this.text = text;
    this.type = type;
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
