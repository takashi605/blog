import { memo } from 'react';
import type { BlogPostContent } from 'shared-lib/src/api/types';
import ImageContent from 'shared-ui/src/blogPost/components/ImageContent';
import CodeBlock from './elements/CodeBlock';
import H2 from './elements/H2';
import H3 from './elements/H3';
import Paragraph from './elements/Paragraph';

export type BlogPostContentProps = {
  content: BlogPostContent;
};

function ContentRenderer({ content }: BlogPostContentProps) {
  switch (content.type) {
    case 'h2':
      return <H2>{content.text}</H2>;
    case 'h3':
      return <H3>{content.text}</H3>;
    case 'paragraph':
      return <Paragraph richText={content.text} />;
    case 'image':
      return <ImageContent imageContent={content} />;
    case 'codeBlock':
      return <CodeBlock codeBlockData={content} />;
    default:
      return null;
  }
}

export default memo(ContentRenderer);
