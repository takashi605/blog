import type { BlogPost } from '@/entities/blogPost';
import { createBlogPost } from '@/entities/blogPost';

export type ViewBlogPostInput = {
  postTitle: string;
  h2List: string[];
  h3List: string[];
  paragraphList: string[];
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
  getParagraphList: () => {
    getText: () => string;
  }[];
};

export const viewBlogPost = (
  input: ViewBlogPostInput
): ViewBlogPostOutput => {
  const blogPost: BlogPost = createBlogPost(input.postTitle, input.h2List, input.h3List, input.paragraphList);
  return {
    postTitle: {
      getText: () => blogPost.getTitleText(),
      getLevel: () => blogPost.getTitleLevel(),
    },
    getH2List: () => {
      return blogPost.getH2List().map((h2) => {
        return {
          getText: () => h2.getContent(),
          getLevel: () => h2.getLevel(),
        };
      });
    },
    getH3List: () => {
      return blogPost.getH3List().map((h3) => {
        return {
          getText: () => h3.getContent(),
          getLevel: () => h3.getLevel(),
        };
      });
    },
    getParagraphList: () => blogPost.getParagraphList(),
  };
};
