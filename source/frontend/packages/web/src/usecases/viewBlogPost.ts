import type { BlogPost } from '@/entities/blogPost';
import { createBlogPost } from '@/entities/blogPost';

export type ViewBlogPostInput = {
  postTitle: string;
  h2List: string[];
  h3List: string[];
  paragraphList: string[];
  contents: {
    type: string;
    contentValue: string;
  }[];
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
  getContents: () => {
    getId: () => number;
    getText: () => string;
    getType: () => string;
  }[];
};

export const viewBlogPost = (
  input: ViewBlogPostInput
): ViewBlogPostOutput => {
  const blogPost: BlogPost = createBlogPost(input.postTitle, input.h2List, input.h3List, input.paragraphList);

  input.contents.forEach((content) => {
    if (content.type === 'h2') {
      blogPost.addH2(content.contentValue);
    } else if (content.type === 'h3') {
      blogPost.addH3(content.contentValue);
    } else if (content.type === 'paragraph') {
      blogPost.addParagraph(content.contentValue);
    }
  });

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
    getParagraphList: () => {
      return blogPost.getParagraphList().map((paragraph) => {
        return {
          getText: () => paragraph.getContent(),
        };
      });
    },
    getContents: () => {
      return blogPost.getContents().map((content) => {
        return {
          getId: () => content.getId(),
          getText: () => content.getContent(),
          getType: () => content.getContentType(),
        };
      });
    },
  };
};
