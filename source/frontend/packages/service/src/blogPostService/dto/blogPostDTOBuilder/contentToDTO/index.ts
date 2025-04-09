import { CodeBlock } from 'entities/src/blogPost/postContents/code';
import type { Content } from 'entities/src/blogPost/postContents/content';
import { H2, H3 } from 'entities/src/blogPost/postContents/heading';
import { ImageContent } from 'entities/src/blogPost/postContents/image';
import { Paragraph } from 'entities/src/blogPost/postContents/paragraph';
import type {
  CodeBlockDTO,
  ContentDTO,
  H2DTO,
  H3DTO,
  ImageContentDTO,
  ParagraphDTO,
} from '../../contentDTO';
import { ContentToDTOContext } from './context';
import {
  CodeBlockToDTOStrategy,
  H2ToDTOStrategy,
  H3ToDTOStrategy,
  ImageToDTOStrategy,
  ParagraphToDTOStrategy,
} from './strategy';

// コンテキスト生成関数のオーバーロード
// これにより呼び出し元で返り値の型を自動で推論できる
// 例: createContentToDTOContext(new Paragraph(1, 'text')).toDTO()
// 　　の返り値の型は ParagraphDTO になる
export function createContentToDTOContext(
  content: Paragraph,
): ContentToDTOContext<Paragraph, ParagraphDTO>;
export function createContentToDTOContext(
  content: H2,
): ContentToDTOContext<H2, H2DTO>;
export function createContentToDTOContext(
  content: H3,
): ContentToDTOContext<H3, H3DTO>;
export function createContentToDTOContext(
  content: ImageContent,
): ContentToDTOContext<ImageContent, ImageContentDTO>;
export function createContentToDTOContext(
  content: CodeBlock,
): ContentToDTOContext<CodeBlock, CodeBlockDTO>;
export function createContentToDTOContext(
  content: Content,
): ContentToDTOContext<Content, ContentDTO>;

// コンテキスト生成関数の実装
export function createContentToDTOContext(
  content: Content,
): ContentToDTOContext<Content, ContentDTO> {
  if (content instanceof Paragraph) {
    return new ContentToDTOContext(new ParagraphToDTOStrategy(content));
  } else if (content instanceof H2) {
    return new ContentToDTOContext(new H2ToDTOStrategy(content));
  } else if (content instanceof H3) {
    return new ContentToDTOContext(new H3ToDTOStrategy(content));
  } else if (content instanceof ImageContent) {
    return new ContentToDTOContext(new ImageToDTOStrategy(content));
  } else if (content instanceof CodeBlock) {
    return new ContentToDTOContext(new CodeBlockToDTOStrategy(content));
  } else {
    throw new Error('存在しないコンテンツタイプを DTO に変換しようとしました');
  }
}
