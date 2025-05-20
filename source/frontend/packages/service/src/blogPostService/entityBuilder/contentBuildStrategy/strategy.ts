import { CodeBlock } from 'entities/src/blogPost/postContents/code';
import type { Content } from 'entities/src/blogPost/postContents/content';
import { H2, H3 } from 'entities/src/blogPost/postContents/heading';
import { ImageContent } from 'entities/src/blogPost/postContents/image';
import { Paragraph } from 'entities/src/blogPost/postContents/paragraph';
import {
  RichText,
  RichTextPart,
} from 'entities/src/blogPost/postContents/richText';
import type {
  CodeBlockInput,
  H2Input,
  H3Input,
  ImageInput,
  ParagraphInput,
} from './input';

export type ContentBuildStrategy<T extends Content> = {
  build(): T;
};

export class H2BuildStrategy implements ContentBuildStrategy<H2> {
  private input: H2Input;

  constructor(input: H2Input) {
    this.input = input;
  }

  build(): H2 {
    return new H2(this.input.id, this.input.text);
  }
}
export class H3BuildStrategy implements ContentBuildStrategy<H3> {
  private input: H3Input;

  constructor(input: H3Input) {
    this.input = input;
  }

  build(): H3 {
    return new H3(this.input.id, this.input.text);
  }
}
export class ParagraphBuildStrategy implements ContentBuildStrategy<Paragraph> {
  private input: ParagraphInput;

  constructor(input: ParagraphInput) {
    this.input = input;
  }

  build(): Paragraph {
    const richTextParts = this.input.text.map(
      (part) => new RichTextPart(part.text, part.styles, part.link),
    );
    return new Paragraph(this.input.id, new RichText(richTextParts));
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
export class CodeBlockBuildStrategy implements ContentBuildStrategy<CodeBlock> {
  private input: CodeBlockInput;

  constructor(input: CodeBlockInput) {
    this.input = input;
  }

  build(): CodeBlock {
    return new CodeBlock(
      this.input.id,
      this.input.title,
      this.input.code,
      this.input.language,
    );
  }
}
