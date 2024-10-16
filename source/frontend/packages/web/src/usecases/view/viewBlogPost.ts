import type { ViewBlogPostInput } from '@/usecases/view/input/input';
import {
  createViewBlogPostDTO,
  type ViewBlogPostDTO,
} from '@/usecases/view/output';
import type { BlogPost } from 'entities/src/blogPost';

export const viewBlogPost = (input: ViewBlogPostInput): ViewBlogPostDTO => {
  const blogPost: BlogPost = input.generateBlogPost();

  const dto = createViewBlogPostDTO(blogPost);
  return dto;
};
