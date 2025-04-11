import { memo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { ContentDTO } from 'service/src/blogPostService/dto/contentDTO';
import H2 from './elements/H2';
import H3 from './elements/H3';
import ImageContent from './elements/ImageContent';
import Paragraph from './elements/Paragraph';

export type BlogPostContentProps = {
  content: ContentDTO;
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
      return (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={content.language}
          PreTag="div"
        >
          {content.code}
        </SyntaxHighlighter>
      );
    default:
      return null;
  }
}

export default memo(ContentRenderer);
