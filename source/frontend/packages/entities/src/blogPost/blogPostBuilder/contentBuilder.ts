import { ContentType, type Content } from '../postContents/content';
import { H2, H3 } from '../postContents/heading';
import { ImageContent } from '../postContents/image';
import { Paragraph } from '../postContents/paragraph';

export class ContentBuildStrategyContext<T extends Content> {
  private strategy: ContentBuildStrategy<T>;

  constructor(input: ContentInput<T>) {
    this.strategy = input.buildStrategy();
  }

  build(): T {
    return this.strategy.build();
  }
}

type ContentInput<T extends Content> = {
  type: ContentType;
  buildStrategy(): ContentBuildStrategy<T>;
};
// TODO rename contentValue->text
export class H2Input implements ContentInput<H2> {
  id: number;
  type: ContentType;
  contentValue: string;

  constructor(id: number, contentValue: string) {
    this.id = id;
    this.type = ContentType.H2;
    this.contentValue = contentValue;
  }

  buildStrategy(): ContentBuildStrategy<H2> {
    return new H2BuildStrategy(this);
  }
}
export class H3Input implements ContentInput<H3> {
  id: number;
  type: ContentType;
  contentValue: string;

  constructor(id: number, contentValue: string) {
    this.id = id;
    this.type = ContentType.H3;
    this.contentValue = contentValue;
  }

  buildStrategy(): ContentBuildStrategy<H3> {
    return new H3BuildStrategy(this);
  }
}
export class ParagraphInput implements ContentInput<Paragraph> {
  id: number;
  type: ContentType;
  contentValue: string;

  constructor(id: number, contentValue: string) {
    this.id = id;
    this.type = ContentType.Paragraph;
    this.contentValue = contentValue;
  }

  buildStrategy(): ContentBuildStrategy<Paragraph> {
    return new ParagraphBuildStrategy(this);
  }
}
export class ImageInput implements ContentInput<ImageContent> {
  id: number;
  type: ContentType;
  path: string;

  constructor(id: number, path: string) {
    this.id = id;
    this.type = ContentType.Image;
    this.path = path;
  }

  buildStrategy(): ContentBuildStrategy<ImageContent> {
    return new ImageBuildStrategy(this);
  }
}

type ContentBuildStrategy<T extends Content> = {
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
