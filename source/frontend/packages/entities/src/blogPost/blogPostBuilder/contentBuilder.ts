import { ContentType, type Content } from '../postContents/content';
import { H2, H3 } from '../postContents/heading';
import { ImageContent } from '../postContents/image';
import { Paragraph } from '../postContents/paragraph';

export class ContentBuildStrategyContext<T extends Content> {
  private strategy: ContentBuildStrategy<T>;

  constructor(input: ContentInput<T>) {
    this.strategy = input.buildStrategy();
  }

  build(id: number): T {
    return this.strategy.build(id);
  }
}

type ContentInput<T extends Content> = {
  type: ContentType;
  buildStrategy(): ContentBuildStrategy<T>;
};
// TODO rename contentValue->text
export class H2Input implements ContentInput<H2> {
  type: ContentType;
  contentValue: string;

  constructor(contentValue: string) {
    this.type = ContentType.H2;
    this.contentValue = contentValue;
  }

  buildStrategy(): ContentBuildStrategy<H2> {
    return new H2BuildStrategy(this);
  }
}
export class H3Input implements ContentInput<H3> {
  type: ContentType;
  contentValue: string;

  constructor(contentValue: string) {
    this.type = ContentType.H3;
    this.contentValue = contentValue;
  }

  buildStrategy(): ContentBuildStrategy<H3> {
    return new H3BuildStrategy(this);
  }
}
export class ParagraphInput implements ContentInput<Paragraph> {
  type: ContentType;
  contentValue: string;

  constructor(contentValue: string) {
    this.type = ContentType.Paragraph;
    this.contentValue = contentValue;
  }

  buildStrategy(): ContentBuildStrategy<Paragraph> {
    return new ParagraphBuildStrategy(this);
  }
}
export class ImageInput implements ContentInput<ImageContent> {
  type: ContentType;
  path: string;

  constructor(path: string) {
    this.type = ContentType.Image;
    this.path = path;
  }

  buildStrategy(): ContentBuildStrategy<ImageContent> {
    return new ImageBuildStrategy(this);
  }
}

type ContentBuildStrategy<T extends Content> = {
  build(id: number): T;
};
export class H2BuildStrategy implements ContentBuildStrategy<H2> {
  private contentValue: string;

  constructor(input: H2Input) {
    this.contentValue = input.contentValue;
  }

  build(id: number): H2 {
    return new H2(id, this.contentValue);
  }
}
export class H3BuildStrategy implements ContentBuildStrategy<H3> {
  private contentValue: string;

  constructor(input: H3Input) {
    this.contentValue = input.contentValue;
  }

  build(id: number): H3 {
    return new H3(id, this.contentValue);
  }
}
export class ParagraphBuildStrategy implements ContentBuildStrategy<Paragraph> {
  private contentValue: string;

  constructor(input: ParagraphInput) {
    this.contentValue = input.contentValue;
  }

  build(id: number): Paragraph {
    return new Paragraph(id, this.contentValue);
  }
}
export class ImageBuildStrategy implements ContentBuildStrategy<ImageContent> {
  private path: string;

  constructor(input: ImageInput) {
    this.path = input.path;
  }

  build(id: number): ImageContent {
    return new ImageContent(id, this.path);
  }
}
