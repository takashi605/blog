import type { ContentProps } from '@/components/models/blogPost/controllers/ViewBlogPostController';
import H2 from '@/components/models/blogPost/ui/contents/elements/H2';

function ContentRenderer({ type, value }: ContentProps) {
  return type === 'h2' ? (
    <H2 type={type} value={value} />
  ) : type === 'h3' ? (
    <h3>{value}</h3>
  ) : type === 'paragraph' ? (
    <p>{value}</p>
  ) : null;
}

export default ContentRenderer;
