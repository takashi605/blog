import type { BlogPost } from '@/entities/blogPost';
import { createBlogPost } from '@/entities/blogPost';
import type { ViewBlogPostInput } from '@/usecases/view/input/input';
import type { ViewBlogPost } from '@/usecases/view/output';

export const viewBlogPost = (input: ViewBlogPostInput): ViewBlogPost => {
  const blogPost: BlogPost = createBlogPost(input.getPostTitle());

  input.injectionContentsTo(blogPost);

  return {
    getTitle: () => blogPost.getTitleText(),
    getContents: () => blogPost.getContents(),
  };
};
