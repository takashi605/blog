import type { BlogPostBuilder } from '@/usecases/view/input/input';
import {
  createViewBlogPostDTO,
  type ViewBlogPostDTO,
} from '@/usecases/view/output';
import type { BlogPost } from 'entities/src/blogPost';

export const viewBlogPost = (input: BlogPostBuilder): ViewBlogPostDTO => {
  const blogPost: BlogPost = input.build();

  const dto = createViewBlogPostDTO(blogPost);
  return dto;
};
