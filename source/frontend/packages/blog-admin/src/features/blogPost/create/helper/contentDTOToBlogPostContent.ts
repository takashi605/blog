/**
 * ContentDTOをBlogPostContent型に変換するヘルパー関数
 */

import type { ContentDTO } from 'service/src/blogPostService/dto/contentDTO';
import type { BlogPost } from 'shared-lib/src/api';

type BlogPostContent = BlogPost['contents'][number];

/**
 * ContentDTOの配列をBlogPostContent型に変換
 */
export function contentDTOToBlogPostContent(
  contents: ContentDTO[],
): BlogPostContent[] {
  return contents.map((content) => {
    switch (content.type) {
      case 'h2':
        return {
          type: 'h2' as const,
          id: content.id,
          text: content.text,
        };

      case 'h3':
        return {
          type: 'h3' as const,
          id: content.id,
          text: content.text,
        };

      case 'paragraph':
        return {
          type: 'paragraph' as const,
          id: content.id,
          text: content.text.map((richText) => ({
            text: richText.text,
            styles: richText.styles,
            link: richText.link || null,
          })),
        };

      case 'image':
        return {
          type: 'image' as const,
          id: content.id,
          path: content.path,
        };

      case 'codeBlock':
        return {
          type: 'codeBlock' as const,
          id: content.id,
          title: content.title,
          code: content.code,
          language: content.language,
        };

      default:
        // TypeScriptの exhaustive check
        const _exhaustiveCheck: never = content;
        throw new Error(
          `未対応のコンテンツタイプ: ${JSON.stringify(_exhaustiveCheck)}`,
        );
    }
  });
}
