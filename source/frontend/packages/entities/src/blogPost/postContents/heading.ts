import { ContentType, type Content } from './content';

export const createH2 = (id: number, initialText: string): Heading => {
  return new Heading(id, initialText, 2, ContentType.H2);
};

export const createH3 = (id: number, initialText: string): Heading => {
  return new Heading(id, initialText, 3, ContentType.H3);
};

export class Heading implements Content {
  private id: number;
  private text: string;
  private level: number;
  private type: ContentType;

  constructor(id: number, text: string, level: number, type: ContentType) {
    this.id = id;
    this.text = text;
    this.level = level;
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
  getLevel() {
    return this.level;
  }
}
