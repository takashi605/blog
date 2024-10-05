import type { BlogPost } from '@/entities/blogPost';
import { createBlogPost } from '@/entities/blogPost';

export type ViewBlogPostInput = {
  postTitle: string;
  h2List: string[];
};

export type ViewBlogPostOutput = {
  postTitle: {
    getTitle: () => string;
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
      getTitle: () => blogPost.getTitleText(),
      getLevel: () => blogPost.getTitleLevel(),
    },
    getH2List: () => {
      return blogPost.getH2List().map((h2) => {
        return {
          getText: () => h2.getText(),
          getLevel: () => h2.getLevel(),
        };
      });
    },
  };
};
