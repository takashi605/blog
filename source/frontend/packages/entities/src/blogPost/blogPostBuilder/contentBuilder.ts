import {
  createContent,
  type Content,
  type ContentType,
} from '../postContents/content';

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
