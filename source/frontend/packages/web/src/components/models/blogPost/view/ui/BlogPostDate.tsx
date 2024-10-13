import type { BlogPostDateProps } from '@/components/models/blogPost/view/controllers/types';

function BlogPostDate({ label, date }: BlogPostDateProps) {
  return (
    <p>
      {label}:<time dateTime={date}>{date}</time>
    </p>
  );
}

export default BlogPostDate;
