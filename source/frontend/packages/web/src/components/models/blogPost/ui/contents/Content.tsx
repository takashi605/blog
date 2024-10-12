import type { ContentProps } from '@/components/models/blogPost/controllers/ViewBlogPostController';
import H2 from '@/components/models/blogPost/ui/contents/elements/H2';
import H3 from '@/components/models/blogPost/ui/contents/elements/H3';
import Paragraph from '@/components/models/blogPost/ui/contents/elements/Paragraph';

export type ContentElementProps = {
  children: string;
};

function ContentRenderer({ type, value }: ContentProps) {
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

export default ContentRenderer;
