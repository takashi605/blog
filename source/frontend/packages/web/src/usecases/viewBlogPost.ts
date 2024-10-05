import { createBlogPost } from "@/entities/blogPost";
import type { BlogPost, Heading } from "@/entities/blogPost";

export type ViewBlogPostInput = {
  postTitle: Heading;
};

export type ViewBlogPostOutput = {
  postTitle: string;
};

export const viewBlogPost = (input: ViewBlogPostInput): ViewBlogPostOutput => {
  const blogPost: BlogPost = createBlogPost(input.postTitle);
  return {
    postTitle: blogPost.getTitle(),
  };
};
