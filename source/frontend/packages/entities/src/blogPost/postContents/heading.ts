import { ContentType, type Content } from './content';

export const createH2 = (id: number, initialText: string): Heading => {
  return new Heading(id, initialText, 2);
};

export const createH3 = (id: number, initialText: string): Heading => {
  return new Heading(id, initialText, 3);
};

export class Heading implements Content {
  private id: number;
  private text: string;
  private level: number;

  constructor(id: number, text: string, level: number) {
    this.id = id;
    this.text = text;
    this.level = level;
  }

  getId() {
    return this.id;
  }
  getValue() {
    return this.text;
  }
  getType() {
    switch (this.level) {
      case 2:
        return ContentType.H2;
      case 3:
        return ContentType.H3;
      default:
        throw new Error('不明な見出しレベルです');
    }
  }
  getLevel() {
    return this.level;
  }
}
