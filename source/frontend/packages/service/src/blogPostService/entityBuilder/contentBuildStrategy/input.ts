import type { Content } from 'entities/src/blogPost/postContents/content';
import { ContentType } from 'entities/src/blogPost/postContents/content';
import type { H2, H3 } from 'entities/src/blogPost/postContents/heading';
import type { ImageContent } from 'entities/src/blogPost/postContents/image';
import type { Paragraph } from 'entities/src/blogPost/postContents/paragraph';
import type { RichTextDTO } from '../../dto/contentDTO';
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
  id: string;
  type: ContentType;
  text: string;

  constructor(id: string, contentValue: string) {
    this.id = id;
    this.type = ContentType.H2;
    this.text = contentValue;
  }

  buildStrategy(): ContentBuildStrategy<H2> {
    return new H2BuildStrategy(this);
  }
}
export class H3Input implements ContentInput<H3> {
  id: string;
  type: ContentType;
  text: string;

  constructor(id: string, contentValue: string) {
    this.id = id;
    this.type = ContentType.H3;
    this.text = contentValue;
  }

  buildStrategy(): ContentBuildStrategy<H3> {
    return new H3BuildStrategy(this);
  }
}
export class ParagraphInput implements ContentInput<Paragraph> {
  id: string;
  type: ContentType;
  text: RichTextDTO;

  constructor(id: string, contentValue: RichTextDTO) {
    this.id = id;
    this.type = ContentType.Paragraph;
    this.text = contentValue;
  }

  buildStrategy(): ContentBuildStrategy<Paragraph> {
    return new ParagraphBuildStrategy(this);
  }
}
export class ImageInput implements ContentInput<ImageContent> {
  id: string;
  type: ContentType;
  path: string;

  constructor(id: string, path: string) {
    this.id = id;
    this.type = ContentType.Image;
    this.path = path;
  }

  buildStrategy(): ContentBuildStrategy<ImageContent> {
    return new ImageBuildStrategy(this);
  }
}
