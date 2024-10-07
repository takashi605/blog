import type { BlogPost } from '@/entities/blogPost';
import { createBlogPost } from '@/entities/blogPost';
import { createContent } from '@/entities/postContants/content';
import type { ViewBlogPostInput } from '@/usecases/view/input/input';
import type { ViewBlogPostOutput } from '@/usecases/view/output';

export const viewBlogPost = (input: ViewBlogPostInput): ViewBlogPostOutput => {
  const blogPost: BlogPost = createBlogPost(input.getPostTitle());

  input.getContents().forEach((contentInput) => {
    blogPost.addContent(
      createContent({
        id: blogPost.getContents().length + 1,
        type: contentInput.type,
        value: contentInput.contentValue,
      }),
    );
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
