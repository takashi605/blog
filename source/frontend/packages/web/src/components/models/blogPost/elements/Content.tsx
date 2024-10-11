import type { ContentProps } from '@/components/models/blogPost/controllers/ViewBlogPostController';

function Content({ type, value }: ContentProps) {
  return type === 'h2' ? (
    <h2>{value}</h2>
  ) : type === 'h3' ? (
    <h3>{value}</h3>
  ) : type === 'paragraph' ? (
    <p>{value}</p>
  ) : null;
}

export default Content;
