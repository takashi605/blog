type BlogPostDateProps = {
  label: string;
  date: string;
};

function BlogPostDate({ label, date }: BlogPostDateProps) {
  return (
    <p>
      {label}:<time dateTime={date}>{date}</time>
    </p>
  );
}

export default BlogPostDate;
