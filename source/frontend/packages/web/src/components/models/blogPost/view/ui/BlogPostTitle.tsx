import React from 'react';

type BlogPostTitleProps = {
  children: React.ReactNode;
};

function BlogPostTitle({ children }: BlogPostTitleProps) {
  return <h1>{children}</h1>;
}

export default BlogPostTitle;
