import type { Content } from '../../postContents/content';
import { ContentType } from '../../postContents/content';
import type { H2, H3 } from '../../postContents/heading';
import type { ImageContent } from '../../postContents/image';
import type { Paragraph } from '../../postContents/paragraph';
import type { ContentBuildStrategy } from './strategy';
import {
  H2BuildStrategy,
  H3BuildStrategy,
  ImageBuildStrategy,
  ParagraphBuildStrategy,
} from './strategy';

export type ContentInput<T extends Content> = {
  type: ContentType;
  buildStrategy(): ContentBuildStrategy<T>;
};

export class H2Input implements ContentInput<H2> {
  id: number;
  type: ContentType;
  text: string;

  constructor(id: number, contentValue: string) {
    this.id = id;
    this.type = ContentType.H2;
    this.text = contentValue;
  }

  buildStrategy(): ContentBuildStrategy<H2> {
    return new H2BuildStrategy(this);
  }
}
export class H3Input implements ContentInput<H3> {
  id: number;
  type: ContentType;
  text: string;

  constructor(id: number, contentValue: string) {
    this.id = id;
    this.type = ContentType.H3;
    this.text = contentValue;
  }

  buildStrategy(): ContentBuildStrategy<H3> {
    return new H3BuildStrategy(this);
  }
}
export class ParagraphInput implements ContentInput<Paragraph> {
  id: number;
  type: ContentType;
  text: string;

  constructor(id: number, contentValue: string) {
    this.id = id;
    this.type = ContentType.Paragraph;
    this.text = contentValue;
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
