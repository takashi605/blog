import type { BlogPostContentProps } from '@/components/models/blogPost/view/controllers/types';
import H2 from '@/components/models/blogPost/view/ui/contents/elements/H2';
import H3 from '@/components/models/blogPost/view/ui/contents/elements/H3';
import Paragraph from '@/components/models/blogPost/view/ui/contents/elements/Paragraph';
import { memo } from 'react';

function ContentRenderer({ type, value }: BlogPostContentProps) {
  switch (type) {
    case 'h2':
      return <H2>{value}</H2>;
    case 'h3':
      return <H3>{value}</H3>;
    case 'paragraph':
      return <Paragraph>{value}</Paragraph>;
    default:
      return null;
  }
}

export default memo(ContentRenderer);
