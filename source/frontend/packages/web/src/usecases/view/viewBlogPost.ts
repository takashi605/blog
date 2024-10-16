import type { ViewBlogPostInput } from '@/usecases/view/input/input';
import {
  extractLastUpdateDateForDTO,
  extractPostDateForDTO,
  type ViewBlogPost,
} from '@/usecases/view/output';
import type { BlogPost } from 'entities/src/blogPost';

export const viewBlogPost = (input: ViewBlogPostInput): ViewBlogPost => {
  const blogPost: BlogPost = input.generateBlogPost();

  return {
    title: blogPost.getTitleText(),
    postDate: extractPostDateForDTO(blogPost),
    lastUpdateDate: extractLastUpdateDateForDTO(blogPost),
    contents: blogPost.getContents().map((content, index) => {
      return {
        id: index + 1,
        value: content.getValue(),
        type: content.getType(),
      };
    }),
  };
};
