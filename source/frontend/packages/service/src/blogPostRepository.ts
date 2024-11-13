import type { BlogPost } from 'entities/src/blogPost';

export type CreatedBlogPost = {
  title: string;
  postDate: string;
  lastUpdateDate: string;
  contents: {
    type: string;
    text: string;
  }[];
};

export type BlogPostRepository = {
  save(blogPost: BlogPost): Promise<CreatedBlogPost>;
};
