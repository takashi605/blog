import type { ContentProps } from '@/components/models/blogPost/controllers/ViewBlogPostController';
import H2 from '@/components/models/blogPost/ui/contents/elements/H2';
import H3 from '@/components/models/blogPost/ui/contents/elements/H3';

function ContentRenderer({ type, value }: ContentProps) {
  return type === 'h2' ? (
    <H2 type={type} value={value} />
  ) : type === 'h3' ? (
    <H3 type={type} value={value} />
  ) : type === 'paragraph' ? (
    <p>{value}</p>
  ) : null;
}

export default ContentRenderer;
