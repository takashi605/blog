import type { BlogPost } from '@/entities/blogPost';
import { createBlogPost } from '@/entities/blogPost';

export type ViewBlogPostInput = {
  postTitle: string;
  h2List: string[];
  h3List: string[];
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
  getH3List: () => {
    getText: () => string;
    getLevel: () => number;
  }[];
};

export const viewBlogPost = (
  input: ViewBlogPostInput
): ViewBlogPostOutput => {
  const blogPost: BlogPost = createBlogPost(input.postTitle, input.h2List, input.h3List);
  return {
    postTitle: {
      getText: () => blogPost.getTitleText(),
      getLevel: () => blogPost.getTitleLevel(),
    },
    getH2List: () => blogPost.getH2List(),
    getH3List: () => blogPost.getH3List(),
  };
};
