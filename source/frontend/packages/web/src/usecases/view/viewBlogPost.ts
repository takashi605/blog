import type { ViewBlogPostInput } from '@/usecases/view/input/input';
import type { ViewBlogPost } from '@/usecases/view/output';
import type { BlogPost } from 'entities/src/blogPost';
import { createBlogPost } from 'entities/src/blogPost';

export const viewBlogPost = (input: ViewBlogPostInput): ViewBlogPost => {
  const blogPost: BlogPost = createBlogPost(input.getPostTitle());

  input.injectionContentsTo(blogPost);

  return {
    title: blogPost.getTitleText(),
    getContents: () => blogPost.getContents(),
  };
};
