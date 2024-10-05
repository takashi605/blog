import { createBlogPost } from "@/entities/blogPost";
import type { BlogPost } from "@/entities/blogPost";

export type ViewBlogPostInput = {
  postTitle: string;
};

export type ViewBlogPostOutput = {
  postTitle: string;
};

export const viewBlogPost = (input: ViewBlogPostInput): ViewBlogPostOutput => {
  const blogPost: BlogPost = createBlogPost(input.postTitle);
  return {
    postTitle: blogPost.title,
  };
};
