import type { ContentProps } from '@/components/models/blogPost/controllers/ViewBlogPostController';

export function Paragraph({ value }: ContentProps) {
  return <p>{value}</p>;
}

export default Paragraph;
