import type { ContentType } from '../postContents/content';
import { createContent, type Content } from '../postContents/content';
import type { Heading } from '../postContents/heading';
import { createH2, createH3 } from '../postContents/heading';
import { Paragraph } from '../postContents/paragraph';

export class ContentBuilder {
  private type: ContentType;
  private contentValue: string;

  constructor(input: old__ContentInput) {
    this.type = input.type;
    this.contentValue = input.contentValue;
  }

  build(id: number): Content {
    return createContent({ id, type: this.type, value: this.contentValue });
  }
}

type old__ContentInput = HeadingInput | ParagraphInput;
type ContentInput = HeadingInput | ParagraphInput | ImageInput;
type ContentInputBase = { type: ContentType };
// TODO rename contentValue->text
type HeadingInput = { contentValue: string } & ContentInputBase;
type ParagraphInput = { contentValue: string } & ContentInputBase;
type ImageInput = { path: string } & ContentInputBase;

type ContentBuildStrategy = {
  build(id: number): Content;
};
export class H2BuildStrategy implements ContentBuildStrategy {
  private contentValue: string;

  constructor(contentValue: string) {
    this.contentValue = contentValue;
  }

  build(id: number): Heading {
    return createH2(id, this.contentValue);
  }
}
export class H3BuildStrategy implements ContentBuildStrategy {
  private contentValue: string;

  constructor(contentValue: string) {
    this.contentValue = contentValue;
  }

  build(id: number): Heading {
    return createH3(id, this.contentValue);
  }
}
export class ParagraphBuildStrategy implements ContentBuildStrategy {
  private contentValue: string;

  constructor(contentValue: string) {
    this.contentValue = contentValue;
  }

  build(id: number): Content {
    return new Paragraph(id, this.contentValue);
  }
}
