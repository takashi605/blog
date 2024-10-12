import type { ContentProps } from '@/components/models/blogPost/controllers/ViewBlogPostController';

export function H2({ value }: ContentProps) {
  return <h2>{value}</h2>;
}

export default H2;
