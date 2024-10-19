import type { Content } from './content';

export const createH1 = (id: number, initialText: string): Heading => {
  return new Heading(id, initialText, 1);
};

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
    return `h${this.level}`;
  }
  getLevel() {
    return this.level;
  }
}
