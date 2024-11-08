import {
  ContentType,
  createContent,
  type Content,
} from '../postContents/content';
import type { Heading } from '../postContents/heading';
import { createH2, createH3 } from '../postContents/heading';

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

type old__ContentInput = {
  type: ContentType;
  contentValue: string;
};

export class StrategyContext<T extends Content> {
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
export class H2Input implements ContentInput<Heading> {
  type: ContentType;
  contentValue: string;

  constructor(contentValue: string) {
    this.type = ContentType.H2;
    this.contentValue = contentValue;
  }

  buildStrategy(): ContentBuildStrategy<Heading> {
    return new H2BuildStrategy(this);
  }
}
export class H3Input implements ContentInput<Heading> {
  type: ContentType;
  contentValue: string;

  constructor(contentValue: string) {
    this.type = ContentType.H3;
    this.contentValue = contentValue;
  }

  buildStrategy(): ContentBuildStrategy<Heading> {
    return new H3BuildStrategy(this);
  }
}

// type ParagraphInput = { contentValue: string } & ContentInputBase;
// type ImageInput = { path: string } & ContentInputBase;

type ContentBuildStrategy<T extends Content> = {
  build(id: number): T;
};
export class H2BuildStrategy implements ContentBuildStrategy<Heading> {
  private contentValue: string;

  constructor(input: H2Input) {
    this.contentValue = input.contentValue;
  }

  build(id: number): Heading {
    return createH2(id, this.contentValue);
  }
}
export class H3BuildStrategy implements ContentBuildStrategy<Heading> {
  private contentValue: string;

  constructor(input: H3Input) {
    this.contentValue = input.contentValue;
  }

  build(id: number): Heading {
    return createH3(id, this.contentValue);
  }
}
// export class ParagraphBuildStrategy implements ContentBuildStrategy {
//   private contentValue: string;

//   constructor(input: ParagraphInput) {
//     this.contentValue = input.contentValue;
//   }

//   build(id: number): Paragraph {
//     return new Paragraph(id, this.contentValue);
//   }
// }
// export class ImageBuildStrategy implements ContentBuildStrategy {
//   private path: string;

//   constructor(input: ImageInput) {
//     this.path = input.path;
//   }

//   build(id: number): ImageContent {
//     return new ImageContent(id, this.path);
//   }
// }
