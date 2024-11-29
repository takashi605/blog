import H2 from '@/controllers/blogPost/view/ui/contents/elements/H2';
import H3 from '@/controllers/blogPost/view/ui/contents/elements/H3';
import ImageContent from '@/controllers/blogPost/view/ui/contents/elements/ImageContent';
import Paragraph from '@/controllers/blogPost/view/ui/contents/elements/Paragraph';
import { memo } from 'react';
import type { ContentForDTO } from 'service/src/blogPostService/dto/contentDTO';

export type BlogPostContentProps = {
  content: ContentForDTO;
};

function ContentRenderer({ content }: BlogPostContentProps) {
  switch (content.type) {
    case 'h2':
      return <H2>{content.text}</H2>;
    case 'h3':
      return <H3>{content.text}</H3>;
    case 'paragraph':
      return <Paragraph>{content.text}</Paragraph>;
    case 'image':
      return <ImageContent imageContent={content} />;
    default:
      return null;
  }
}

export default memo(ContentRenderer);
