import type { BlogPost } from '@/entities/blogPost';
import { createBlogPost } from '@/entities/blogPost';
import type { ViewBlogPostInput } from '@/usecases/view/input';
import type { ViewBlogPostOutput } from '@/usecases/view/output';

export const viewBlogPost = (input: ViewBlogPostInput): ViewBlogPostOutput => {
  const blogPost: BlogPost = createBlogPost(input.getPostTitle());

  input.getContents().forEach((content) => {
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
