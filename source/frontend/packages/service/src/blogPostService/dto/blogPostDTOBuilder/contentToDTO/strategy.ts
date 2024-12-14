import type { Content } from 'entities/src/blogPost/postContents/content';
import type { H2, H3 } from 'entities/src/blogPost/postContents/heading';
import type { ImageContent } from 'entities/src/blogPost/postContents/image';
import type { Paragraph } from 'entities/src/blogPost/postContents/paragraph';
import type {
  ContentForDTO,
  H2ForDTO,
  H3ForDTO,
  ImageForDTO,
  ParagraphForDTO,
} from './types';

export abstract class ContentToDTOStrategy<
  T extends Content,
  U extends ContentForDTO,
> {
  protected content: T;

  constructor(content: T) {
    this.content = content;
  }
  abstract toDTO(): U;
}

export class ParagraphToDTOStrategy extends ContentToDTOStrategy<
  Paragraph,
  ParagraphForDTO
> {
  toDTO(): ParagraphForDTO {
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

export class H2ToDTOStrategy extends ContentToDTOStrategy<H2, H2ForDTO> {
  toDTO(): H2ForDTO {
    return {
      id: this.content.getId(),
      text: this.content.getValue(),
      type: this.content.getType(),
    };
  }
}
export class H3ToDTOStrategy extends ContentToDTOStrategy<H3, H3ForDTO> {
  toDTO(): H3ForDTO {
    return {
      id: this.content.getId(),
      text: this.content.getValue(),
      type: this.content.getType(),
    };
  }
}

export class ImageToDTOStrategy extends ContentToDTOStrategy<
  ImageContent,
  ImageForDTO
> {
  toDTO(): ImageForDTO {
    return {
      id: this.content.getId(),
      type: this.content.getType(),
      path: this.content.getPath(),
    };
  }
}
