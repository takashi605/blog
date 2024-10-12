import type { ContentElementProps } from '@/components/models/blogPost/ui/contents/Content';

export function Paragraph({ children }: ContentElementProps) {
  return <p>{children}</p>;
}

export default Paragraph;
