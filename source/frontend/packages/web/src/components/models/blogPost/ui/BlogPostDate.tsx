import type { BlogPostDateProps } from '@/components/models/blogPost/controllers/ViewBlogPostController';

function BlogPostDate({ label, date }: BlogPostDateProps) {
  return (
    <p>
      {label}:<time dateTime={date}>{date}</time>
    </p>
  );
}

export default BlogPostDate;
