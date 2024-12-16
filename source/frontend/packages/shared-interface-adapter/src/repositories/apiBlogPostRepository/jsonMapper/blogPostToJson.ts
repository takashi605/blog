import type { BlogPost } from 'entities/src/blogPost';
import { ImageContent } from 'entities/src/blogPost/postContents/image';
import { Paragraph } from 'entities/src/blogPost/postContents/paragraph';

export function blogPostToJson(blogPost: BlogPost): string {
  return JSON.stringify({
    id: blogPost.getId(),
    title: blogPost.getTitleText(),
    thumbnail: {
      path: blogPost.getThumbnail().getPath(),
    },
    postDate: blogPost.getPostDate().toISOString().split('T')[0],
    lastUpdateDate: blogPost.getLastUpdateDate().toISOString().split('T')[0],
    contents: blogPost.getContents().map((content) => {
      // TODO: ここで instanceof を使っているのは役割が集中して良くないので、
      // ストラテジークラスなどを使って責務を分離する
      if (content instanceof ImageContent) {
        return {
          id: content.getId(),
          type: 'image',
          path: content.getPath(),
        };
      }
      if (content instanceof Paragraph) {
        const richText = content.getValue();
        const richTextParts = richText.getText();
        return {
          id: content.getId(),
          type: 'paragraph',
          text: richTextParts.map((richTextPart) => {
            return {
              text: richTextPart.getText(),
              styles: { bold: richTextPart.getStyles().bold },
            };
          }),
        };
      }
      return {
        id: content.getId(),
        type: content.getType(),
        text: content.getValue(),
      };
    }),
  });
}
