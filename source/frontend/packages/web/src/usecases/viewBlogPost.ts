import type { BlogPost } from '@/entities/blogPost';
import { createBlogPost } from '@/entities/blogPost';

export type ViewBlogPostInput = {
  postTitle: string;
  h2List: string[];
};

export type ViewBlogPostOutput = {
  postTitle: {
    getText: () => string;
    getLevel: () => number;
  };
  getH2List: () => {
    getText: () => string;
    getLevel: () => number;
  }[];
};

export const viewBlogPost = (
  input: ViewBlogPostInput,
  h2List: string[],
): ViewBlogPostOutput => {
  const blogPost: BlogPost = createBlogPost(input.postTitle, h2List);
  return {
    postTitle: {
      getText: () => blogPost.getTitleText(),
      getLevel: () => blogPost.getTitleLevel(),
    },
    getH2List: () => blogPost.getH2List(),
  };
};
