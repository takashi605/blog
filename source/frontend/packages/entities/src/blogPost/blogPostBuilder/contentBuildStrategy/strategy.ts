import type { Content } from '../../postContents/content';
import { H2, H3 } from '../../postContents/heading';
import { ImageContent } from '../../postContents/image';
import { Paragraph } from '../../postContents/paragraph';
import type { H2Input, H3Input, ImageInput, ParagraphInput } from './input';

export type ContentBuildStrategy<T extends Content> = {
  build(): T;
};

export class H2BuildStrategy implements ContentBuildStrategy<H2> {
  private input: H2Input;

  constructor(input: H2Input) {
    this.input = input;
  }

  build(): H2 {
    return new H2(this.input.id, this.input.contentValue);
  }
}
export class H3BuildStrategy implements ContentBuildStrategy<H3> {
  private input: H3Input;

  constructor(input: H3Input) {
    this.input = input;
  }

  build(): H3 {
    return new H3(this.input.id, this.input.contentValue);
  }
}
export class ParagraphBuildStrategy implements ContentBuildStrategy<Paragraph> {
  private input: ParagraphInput;

  constructor(input: ParagraphInput) {
    this.input = input;
  }

  build(): Paragraph {
    return new Paragraph(this.input.id, this.input.contentValue);
  }
}
export class ImageBuildStrategy implements ContentBuildStrategy<ImageContent> {
  private input: ImageInput;

  constructor(input: ImageInput) {
    this.input = input;
  }

  build(): ImageContent {
    return new ImageContent(this.input.id, this.input.path);
  }
}
