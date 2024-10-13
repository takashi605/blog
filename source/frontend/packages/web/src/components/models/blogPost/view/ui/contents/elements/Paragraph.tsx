import type { ContentElementProps } from '@/components/models/blogPost/view/ui/contents/Content';

export function Paragraph({ children }: ContentElementProps) {
  return <p>{children}</p>;
}

export default Paragraph;
