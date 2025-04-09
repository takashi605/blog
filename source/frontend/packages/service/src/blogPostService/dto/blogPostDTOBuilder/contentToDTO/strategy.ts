import type { Code } from 'entities/src/blogPost/postContents/code';
import type { Content } from 'entities/src/blogPost/postContents/content';
import type { H2, H3 } from 'entities/src/blogPost/postContents/heading';
import type { ImageContent } from 'entities/src/blogPost/postContents/image';
import type { Paragraph } from 'entities/src/blogPost/postContents/paragraph';
import type {
  CodeDTO,
  ContentDTO,
  H2DTO,
  H3DTO,
  ImageContentDTO,
  ParagraphDTO,
} from '../../contentDTO';

export abstract class ContentToDTOStrategy<
  T extends Content,
  U extends ContentDTO,
> {
  protected content: T;

  constructor(content: T) {
    this.content = content;
  }
  abstract toDTO(): U;
}

export class ParagraphToDTOStrategy extends ContentToDTOStrategy<
  Paragraph,
  ParagraphDTO
> {
  toDTO(): ParagraphDTO {
    const richText = this.content.getValue();
    const richTextDTO = richText.getText().map((richTextPart) => {
      return {
        text: richTextPart.getText(),
        styles: { bold: richTextPart.getStyles().bold },
      };
    });
    return {
      id: this.content.getId(),
      text: richTextDTO,
      type: this.content.getType(),
    };
  }
}

export class H2ToDTOStrategy extends ContentToDTOStrategy<H2, H2DTO> {
  toDTO(): H2DTO {
    return {
      id: this.content.getId(),
      text: this.content.getValue(),
      type: this.content.getType(),
    };
  }
}
export class H3ToDTOStrategy extends ContentToDTOStrategy<H3, H3DTO> {
  toDTO(): H3DTO {
    return {
      id: this.content.getId(),
      text: this.content.getValue(),
      type: this.content.getType(),
    };
  }
}

export class ImageToDTOStrategy extends ContentToDTOStrategy<
  ImageContent,
  ImageContentDTO
> {
  toDTO(): ImageContentDTO {
    return {
      id: this.content.getId(),
      type: this.content.getType(),
      path: this.content.getPath(),
    };
  }
}

export class CodeToDTOStrategy extends ContentToDTOStrategy<Code, CodeDTO> {
  toDTO(): CodeDTO {
    return {
      id: this.content.getId(),
      type: this.content.getType(),
      title: this.content.getTitle(),
      code: this.content.getCode(),
      language: this.content.getLanguage(),
    };
  }
}
