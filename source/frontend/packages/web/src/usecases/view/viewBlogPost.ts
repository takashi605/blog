import type { BlogPost } from '@/entities/blogPost';
import { createBlogPost } from '@/entities/blogPost';
import { createContentByInput } from '@/usecases/view/input/content';
import type { ViewBlogPostInput } from '@/usecases/view/input/input';
import type { ViewBlogPost } from '@/usecases/view/output';

export const viewBlogPost = (input: ViewBlogPostInput): ViewBlogPost => {
  const blogPost: BlogPost = createBlogPost(input.getPostTitle());

  input.getContents().forEach((contentInput) => {
    blogPost.addContent(
      createContentByInput(blogPost.getContents().length + 1, contentInput),
    );
  });

  return {
    getTitle: () => blogPost.getTitleText(),
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
