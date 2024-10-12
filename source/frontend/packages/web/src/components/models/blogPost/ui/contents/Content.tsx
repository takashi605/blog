import type { ContentProps } from '@/components/models/blogPost/controllers/ViewBlogPostController';
import H2 from '@/components/models/blogPost/ui/contents/elements/H2';
import H3 from '@/components/models/blogPost/ui/contents/elements/H3';
import Paragraph from '@/components/models/blogPost/ui/contents/elements/Paragraph';

export type ContentElementProps = {
  children: string;
};

function ContentRenderer({ type, value }: ContentProps) {
  return type === 'h2' ? (
    <H2>{value}</H2>
  ) : type === 'h3' ? (
    <H3>{value}</H3>
  ) : type === 'paragraph' ? (
    <Paragraph>{value}</Paragraph>
  ) : null;
}

export default ContentRenderer;
