import type {
  ContentForDTO,
  H2ForDTO,
  H3ForDTO,
  ImageForDTO,
  ParagraphForDTO,
} from '@/usecases/view/output/dto/contentToDTO/types';
import type { Content } from 'entities/src/blogPost/postContents/content';
import { H2, H3 } from 'entities/src/blogPost/postContents/heading';
import { ImageContent } from 'entities/src/blogPost/postContents/image';
import { Paragraph } from 'entities/src/blogPost/postContents/paragraph';

abstract class ContentToDTOStrategy<
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
    return {
      id: this.content.getId(),
      text: this.content.getValue(),
      type: this.content.getType(),
    };
  }
}

// TODO H2,H3 を分割する
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

export class ContentToDTOContext<T extends Content, U extends ContentForDTO> {
  private strategy: ContentToDTOStrategy<T, U>;

  constructor(strategy: ContentToDTOStrategy<T, U>) {
    this.strategy = strategy;
  }

  toDTO(): U {
    return this.strategy.toDTO();
  }
}

// コンテキスト生成関数のオーバーロード
// これにより呼び出し元で返り値の型を自動で推論できる
// 例: createContentToDTOContext(new Paragraph(1, 'text')).toDTO()
// 　　の返り値の型は ParagraphForDTO になる
export function createContentToDTOContext(
  content: Paragraph,
): ContentToDTOContext<Paragraph, ParagraphForDTO>;
export function createContentToDTOContext(
  content: H2,
): ContentToDTOContext<H2, H2ForDTO>;
export function createContentToDTOContext(
  content: H3,
): ContentToDTOContext<H3, H3ForDTO>;
export function createContentToDTOContext(
  content: ImageContent,
): ContentToDTOContext<ImageContent, ImageForDTO>;
export function createContentToDTOContext(
  content: Content,
): ContentToDTOContext<Content, ContentForDTO>;

// コンテキスト生成関数の実装
export function createContentToDTOContext(
  content: Content,
): ContentToDTOContext<Content, ContentForDTO> {
  if (content instanceof Paragraph) {
    return new ContentToDTOContext(new ParagraphToDTOStrategy(content));
  } else if (content instanceof H2) {
    return new ContentToDTOContext(new H2ToDTOStrategy(content));
  } else if (content instanceof H3) {
    return new ContentToDTOContext(new H3ToDTOStrategy(content));
  } else if (content instanceof ImageContent) {
    return new ContentToDTOContext(new ImageToDTOStrategy(content));
  } else {
    throw new Error('存在しないコンテンツタイプを DTO に変換しようとしました');
  }
}
