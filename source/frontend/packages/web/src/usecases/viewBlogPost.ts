import { createBlogPost } from "@/entities/blogPost";
import type { BlogPost } from "@/entities/blogPost";

export type ViewBlogPostInput = {
  postTitle: string;
};

export type ViewBlogPostOutput = {
  postTitle: {
    getTitle: () => string;
    getLevel: () => number;
  };
};

export const viewBlogPost = (input: ViewBlogPostInput): ViewBlogPostOutput => {
  const blogPost: BlogPost = createBlogPost(input.postTitle);
  return {
    postTitle: {
      getTitle: () => blogPost.getTitleText(),
      getLevel: () => blogPost.getTitleLevel(),
    },
  };
};
